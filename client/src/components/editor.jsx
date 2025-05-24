// import React, { useState } from 'react'
// import TextEditor from './ui/draft'

// const RichTextEditor = () => {
//   const [savedContent, setSavedContent] = useState(null)

//   const handleSave = (content) => {
//     setSavedContent(content)
//     console.log('Content saved:', content)
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-5">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Text Editor</h1>
      
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-3 text-gray-700">Editor</h2>
//         <TextEditor onSave={handleSave} />
//       </div>
      
//       {savedContent && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-3 text-gray-700">Preview</h2>
//           <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
//             <TextEditor initialContent={savedContent} readOnly={true} />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default RichTextEditor;
import React, { useState, useEffect } from 'react'
import TextEditor from './ui/draft'

const CleanRichTextEditor = ({ defaultContent = '<p>Start typing to create your document...</p>' }) => {
  const [savedContent, setSavedContent] = useState(
    localStorage.getItem('editor-content') || defaultContent
  )
  const [lastSaved, setLastSaved] = useState(null)
  const [isInFullScreen, setIsInFullScreen] = useState(false)
  
  // Add event listener for Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (document.querySelector('.ProseMirror')) {
          handleSave(document.querySelector('.ProseMirror').innerHTML)
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  const toggleFullScreen = () => {
    setIsInFullScreen(!isInFullScreen)
  }
  
  const handleSave = (content) => {
    setSavedContent(content)
    setLastSaved(new Date())
    localStorage.setItem('editor-content', content)
    console.log('Content saved:', content)
  }
  
  const downloadContent = () => {
    const blob = new Blob([savedContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const containerClass = isInFullScreen 
    ? 'fixed inset-0 z-50 p-5 overflow-auto' 
    : 'max-w-4xl mx-auto p-5'
  
  return (
    <div className={`${containerClass}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Advanced Rich Text Editor
        </h1>
        
        <div className="flex gap-3">
          <button 
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-400 transition-colors"
            aria-label={isInFullScreen ? 'Exit full screen' : 'Enter full screen'}
            title={isInFullScreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isInFullScreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
              </svg>
            )}
          </button>
          
          <button 
            onClick={downloadContent}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-400 transition-colors"
            aria-label="Download document"
            title="Download document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="rounded-lg shadow-lg mb-8">
        <TextEditor 
          onSave={handleSave} 
          initialContent={savedContent}
          placeholder="Start writing your document..."
        />
      </div>
      
      {lastSaved && (
        <div className="text-sm text-gray-500 mb-3">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
      
      {savedContent && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">
              Document Preview
            </h2>
            <span className="text-sm text-gray-500">
              Read-only view
            </span>
          </div>
          <div className="rounded-lg p-5">
            <TextEditor initialContent={savedContent} readOnly={true} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CleanRichTextEditor;