import React, { useState, useEffect, useRef } from 'react'
import { toast, Toaster } from 'sonner'

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

      // Fetch random words from an API
      const response = await fetch('https://random-word-api.herokuapp.com/word?number=20')

      if (!response.ok) {
        throw new Error('Failed to fetch random words')
      }

      const words = await response.json()

      // Select 4 random words from the fetched words
      const selectedWords: string[] = []
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * words.length)
        selectedWords.push(words[randomIndex])
        // Remove the selected word to avoid duplicates
        words.splice(randomIndex, 1)
      }

      // Join the words to create a random email
      const generatedEmail = selectedWords.join('')

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
    window.open(`https://bugbug-inbox.com/${email}`, '_blank')
  }

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email)
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
    return new Date(timestamp).toLocaleString()
  }

  // Filter emails based on search term
  const filteredEmails = emails.filter(email =>
    email.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Random Email Generator</h1>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              onClick={generateRandomEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              Generate New Email (Ctrl+N)
            </button>
            {emails.length > 0 && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={clearAllEmails}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">
            <p><strong>Keyboard Shortcuts:</strong></p>
            <p>• <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+N</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">⌘+N</kbd>: Generate new email</p>
            <p>• <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+L</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">⌘+L</kbd>: Open latest email inbox</p>
            <p>• <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+F</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded">⌘+F</kbd>: Focus search</p>
            <p>• <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>: Clear search</p>
          </div>

          {statusMessage && (
            <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded text-sm">
              {statusMessage}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold">Your Generated Emails</h2>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search emails..."
                className="px-3 py-1 border border-gray-300 rounded text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No emails generated yet. Click "Generate New Email" to create one.</p>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No emails match your search.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredEmails.map((emailRecord) => (
                <li key={emailRecord.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-600 break-all">{emailRecord.email}</p>
                      <p className="text-sm text-gray-500">{formatDate(emailRecord.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(emailRecord.email)}
                        className="p-2 text-gray-500 hover:text-blue-500"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEmailInbox(emailRecord.email)}
                        className="p-2 text-gray-500 hover:text-green-500"
                        title="Open inbox"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteEmail(emailRecord.id)}
                        className="p-2 text-gray-500 hover:text-red-500"
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
      </div>
    </div>
  )
}

export default App
