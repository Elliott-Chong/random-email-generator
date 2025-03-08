import React, { useState, useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'
import { EmailRecord } from './types'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { EmailList } from './components/EmailList'
import { AboutApp } from './components/AboutApp'
import { BugBugInfo } from './components/BugBugInfo'

function App() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false)
  const [isBugBugExpanded, setIsBugBugExpanded] = useState<boolean>(false)
  const [isShortcutsExpanded, setIsShortcutsExpanded] = useState<boolean>(false)

  // Load emails from localStorage on initial render
  useEffect(() => {
    const storedEmails = localStorage.getItem('randomEmails')
    if (storedEmails) {
      try {
        setEmails(JSON.parse(storedEmails))
      } catch (err) {
        console.error('Error parsing stored emails:', err)
        localStorage.removeItem('randomEmails')
      }
    }
  }, [])

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N or Cmd+N to generate new email
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setStatusMessage('Generating new email...')
        generateRandomEmail()
        setTimeout(() => setStatusMessage(null), 2000)
      }

      // Ctrl+L or Cmd+L to open latest email
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        if (emails.length > 0) {
          setStatusMessage('Opening latest email inbox...')
          openEmailInbox(emails[0].email)
          setTimeout(() => setStatusMessage(null), 2000)
        } else {
          toast.error('No emails generated yet')
        }
      }

      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
          setStatusMessage('Search mode activated')
          setTimeout(() => setStatusMessage(null), 2000)
        }
      }

      // Escape to clear search
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('')
        setStatusMessage('Search cleared')
        setTimeout(() => setStatusMessage(null), 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [emails, searchTerm])

  const generateRandomEmail = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Options for generating email usernames
      const prefixes = [
        'cool', 'super', 'mega', 'ultra', 'hyper', 'cyber', 'tech', 'digi',
        'pixel', 'ninja', 'swift', 'buzz', 'star', 'pro', 'max', 'prime'
      ]

      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

      // Generate a random string of 5 characters
      let randomString = ''
      for (let i = 0; i < 5; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      // Pick a random prefix
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]

      // Create the email username: prefix + random string
      const generatedEmail = `${prefix}${randomString}`

      // Create a new email record
      const newEmail: EmailRecord = {
        id: Date.now().toString(),
        email: generatedEmail,
        createdAt: Date.now()
      }

      // Update state and localStorage
      const updatedEmails = [newEmail, ...emails]
      setEmails(updatedEmails)
      localStorage.setItem('randomEmails', JSON.stringify(updatedEmails))

      toast.success('New random email generated!')

      // Open the new email inbox
      openEmailInbox(generatedEmail)
    } catch (err) {
      console.error('Error generating random email:', err)
      setError('Failed to generate random email. Please try again.')
      toast.error('Failed to generate random email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const openEmailInbox = (email: string) => {
    // Copy the full email address to clipboard
    const fullEmail = `${email}@bugbug-inbox.com`
    navigator.clipboard.writeText(fullEmail)
      .then(() => {
        toast.success('Email copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
        toast.error('Failed to copy to clipboard')
      })

    // Open in current tab instead of new tab
    window.location.href = `https://bugbug-inbox.com/${email}`
  }

  const copyToClipboard = (email: string) => {
    const fullEmail = `${email}@bugbug-inbox.com`
    navigator.clipboard.writeText(fullEmail)
      .then(() => {
        toast.success('Email copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy:', err)
        toast.error('Failed to copy to clipboard')
      })
  }

  const deleteEmail = (id: string) => {
    const updatedEmails = emails.filter(email => email.id !== id)
    setEmails(updatedEmails)
    localStorage.setItem('randomEmails', JSON.stringify(updatedEmails))
    toast.success('Email deleted')
  }

  const clearAllEmails = () => {
    if (window.confirm('Are you sure you want to delete all emails? This cannot be undone.')) {
      setEmails([])
      localStorage.removeItem('randomEmails')
      toast.success('All emails cleared')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">


        {/* Main Email Generation UI */}
        <div className="mb-8">
          <div className="flex justify-between mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Random Email Generator</h1>
            <div className="flex gap-3">
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                onClick={generateRandomEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
                Generate New Email
              </button>
              {emails.length > 0 && (
                <button
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-medium"
                  onClick={clearAllEmails}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 animate-pulse mb-6">
              {statusMessage}
            </div>
          )}

          <EmailList
            emails={emails}
            searchTerm={searchTerm}
            onCopyToClipboard={copyToClipboard}
            onOpenInbox={openEmailInbox}
            onDelete={deleteEmail}
            onGenerateEmail={generateRandomEmail}
            searchInputRef={searchInputRef}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onClearSearch={() => setSearchTerm('')}
          />
        </div>


        <KeyboardShortcuts
          isExpanded={isShortcutsExpanded}
          onToggle={() => setIsShortcutsExpanded(!isShortcutsExpanded)}
        />

        <AboutApp
          isExpanded={isAboutExpanded}
          onToggle={() => setIsAboutExpanded(!isAboutExpanded)}
        />

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Random Email Generator • Powered by bugbug-inbox.com</p>
        </div>
      </div>
    </div>
  );
}

export default App
