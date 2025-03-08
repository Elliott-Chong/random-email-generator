import React from 'react';

type Props = {
    isExpanded: boolean;
    onToggle: () => void;
};

export const KeyboardShortcuts: React.FC<Props> = ({ isExpanded, onToggle }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
            <div
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={onToggle}
            >
                <div className="flex items-center gap-2 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h2 className="font-semibold">Keyboard Shortcuts</h2>
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
                <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">Ctrl+N</kbd>
                        <span>or</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">⌘+N</kbd>
                        <span>Generate new email</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">Ctrl+L</kbd>
                        <span>or</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">⌘+L</kbd>
                        <span>Open latest email inbox</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">Ctrl+F</kbd>
                        <span>or</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">⌘+F</kbd>
                        <span>Focus search</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-100 rounded-md shadow-sm border border-gray-200 text-xs">Esc</kbd>
                        <span>Clear search</span>
                    </div>
                </div>
            )}
        </div>
    );
}; 