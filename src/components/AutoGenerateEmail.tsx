import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EmailRecord } from '../types';
import { generateEmailRecord, copyEmailToClipboard, openInBugBugInbox } from '../utils';

type Props = {
    onEmailGenerated: (email: EmailRecord) => void;
};

export const AutoGenerateEmail: React.FC<Props> = ({ onEmailGenerated }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const generateAndRedirect = async () => {
            try {
                const newEmail = generateEmailRecord();
                await copyEmailToClipboard(newEmail.email);
                onEmailGenerated(newEmail);
                openInBugBugInbox(newEmail.email);
            } catch (err) {
                console.error('Error generating random email:', err);
                toast.error('Failed to generate random email');
                navigate('/');
            }
        };

        generateAndRedirect();
    }, [navigate, onEmailGenerated]);

    return null;
}; 