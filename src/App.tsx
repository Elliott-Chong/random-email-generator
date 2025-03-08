import React, { useState, useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

type EmailRecord = {
  id: string;
  email: string;
  createdAt: number;
}

function App() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  // Filter emails based on search term
  const filteredEmails = emails.filter(email =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Random Email Generator</h1>
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

        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h2 className="font-semibold">Keyboard Shortcuts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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

          {statusMessage && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 animate-pulse">
              {statusMessage}
            </div>
          )}
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

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Your Generated Emails
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search emails..."
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <p className="mb-2">No emails generated yet</p>
              <button
                onClick={generateRandomEmail}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Generate your first email
              </button>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <p>No emails match your search</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredEmails.map((emailRecord) => (
                <li key={emailRecord.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                    <div>
                      <p className="font-medium text-indigo-600 break-all mb-1">{emailRecord.email}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(emailRecord.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(emailRecord.email)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEmailInbox(emailRecord.email)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                        title="Open inbox"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteEmail(emailRecord.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Random Email Generator • Powered by bugbug-inbox.com</p>
        </div>
      </div>
    </div>
  )
}

export default App
