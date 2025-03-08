import React from 'react';

type Props = {
    isExpanded: boolean;
    onToggle: () => void;
};

export const BugBugInfo: React.FC<Props> = ({ isExpanded, onToggle }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                    <h2 className="font-semibold">What is BugBug Inbox?</h2>
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
                        <span className="font-medium text-indigo-600">BugBug</span> is a modern end-to-end test automation tool that helps testers and developers create and run automated tests without coding.
                    </p>
                    <p>
                        <span className="font-medium text-indigo-600">BugBug Inbox</span> is a service that simplifies testing user registration and login flows by providing:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Temporary email addresses that receive real emails</li>
                        <li>Automatic inbox refreshing to show the latest emails</li>
                        <li>Short-term email storage (emails are stored for 10 minutes)</li>
                        <li>The ability to open and verify registration/confirmation emails</li>
                    </ul>
                    <p>
                        This app uses the BugBug Inbox service to generate random email addresses that you can use for testing, signing up for services, or whenever you need a disposable email address.
                    </p>
                    <p>
                        <a href="https://bugbug.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Learn more about BugBug →
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}; 