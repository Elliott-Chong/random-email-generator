import { toast } from 'sonner';
import { EmailRecord } from './types';

export const generateEmailRecord = (): EmailRecord => {
    // Options for generating email usernames
    const prefixes = [
        'cool', 'super', 'mega', 'ultra', 'hyper', 'cyber', 'tech', 'digi',
        'pixel', 'ninja', 'swift', 'buzz', 'star', 'pro', 'max', 'prime'
    ];

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Generate a random string of 5 characters
    let randomString = '';
    for (let i = 0; i < 5; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Pick a random prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // Create the email username: prefix + random string
    const generatedEmail = `${prefix}${randomString}`;

    return {
        id: Date.now().toString(),
        email: generatedEmail,
        createdAt: Date.now()
    };
};

export const copyEmailToClipboard = async (email: string): Promise<void> => {
    const fullEmail = `${email}@bugbug-inbox.com`;
    try {
        await navigator.clipboard.writeText(fullEmail);
        toast.success('Email copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
    }
};

export const openInBugBugInbox = (email: string): void => {
    window.location.href = `https://bugbug-inbox.com/${email}`;
};

export const updateStoredEmails = (newEmail: EmailRecord): void => {
    const storedEmails = localStorage.getItem('randomEmails');
    const existingEmails = storedEmails ? JSON.parse(storedEmails) : [];
    const updatedEmails = [newEmail, ...existingEmails];
    localStorage.setItem('randomEmails', JSON.stringify(updatedEmails));
}; 