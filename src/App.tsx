import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { EmailRecord } from './types'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { EmailList } from './components/EmailList'
import { AboutApp } from './components/AboutApp'
import { BugBugInfo } from './components/BugBugInfo'
import { AutoGenerateEmail } from './components/AutoGenerateEmail'
import { copyEmailToClipboard, openInBugBugInbox, updateStoredEmails } from './utils'

function AppContent() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false)
  const [isBugBugExpanded, setIsBugBugExpanded] = useState<boolean>(false)
  const [isShortcutsExpanded, setIsShortcutsExpanded] = useState<boolean>(false)
  const navigate = useNavigate()

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
        navigate('/new')
        setTimeout(() => setStatusMessage(null), 2000)
      }

      // Ctrl+L or Cmd+L to open latest email
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        if (emails.length > 0) {
          setStatusMessage('Opening latest email inbox...')
          openInBugBugInbox(emails[0].email)
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
  }, [emails, searchTerm, navigate])

  const generateRandomEmail = () => {
    navigate('/new')
  }

  const openEmailInbox = async (email: string) => {
    await copyEmailToClipboard(email)
    openInBugBugInbox(email)
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
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">Random Email Generator</h1>

        <KeyboardShortcuts
          isExpanded={isShortcutsExpanded}
          onToggle={() => setIsShortcutsExpanded(!isShortcutsExpanded)}
        />

        {/* Main Email Generation UI */}
        <div className="mb-8">
          <div className="flex justify-end mb-8">
            <div className="flex gap-3">
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                onClick={generateRandomEmail}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
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

          {statusMessage && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 animate-pulse mb-6">
              {statusMessage}
            </div>
          )}

          <EmailList
            emails={emails}
            searchTerm={searchTerm}
            onCopyToClipboard={copyEmailToClipboard}
            onOpenInbox={openEmailInbox}
            onDelete={deleteEmail}
            onGenerateEmail={generateRandomEmail}
            searchInputRef={searchInputRef}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onClearSearch={() => setSearchTerm('')}
          />
        </div>

        <AboutApp
          isExpanded={isAboutExpanded}
          onToggle={() => setIsAboutExpanded(!isAboutExpanded)}
        />

        <BugBugInfo
          isExpanded={isBugBugExpanded}
          onToggle={() => setIsBugBugExpanded(!isBugBugExpanded)}
        />

        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Random Email Generator • Powered by bugbug-inbox.com</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/new" element={<AutoGenerateEmail onEmailGenerated={(email) => {
          updateStoredEmails(email)
        }} />} />
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  )
}

export default App
