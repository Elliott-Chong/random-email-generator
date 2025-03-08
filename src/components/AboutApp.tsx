import React from 'react';

type Props = {
    isExpanded: boolean;
    onToggle: () => void;
};

export const AboutApp: React.FC<Props> = ({ isExpanded, onToggle }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                    <h2 className="font-semibold">About This App</h2>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>

            {isExpanded && (
                <div className="text-sm text-gray-600 space-y-2 mt-3">
                    <p>
                        This Random Email Generator creates temporary email addresses that you can use for testing or when you need a disposable email.
                    </p>
                    <p>
                        Each generated email follows the format <span className="font-mono bg-gray-100 px-1 rounded">username@bugbug-inbox.com</span> and is automatically copied to your clipboard.
                    </p>
                    <p>
                        When you click on an email, you'll be redirected to its inbox where you can view any messages sent to that address.
                    </p>
                    <p className="text-indigo-600 font-medium pt-1">
                        Made with ❤️ by <a href="https://github.com/elliott-chong/random-email-generator" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-800 transition-colors">Elliott</a>
                    </p>
                </div>
            )}
        </div>
    );
}; 