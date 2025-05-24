
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import Highlight from '@tiptap/extension-highlight'
// import TextStyle from '@tiptap/extension-text-style'
// import FontSize from 'tiptap-extension-font-size'

// const TextEditor = ({ initialContent = '', onSave = () => {}, readOnly = false }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Highlight.configure({ multicolor: true }),
//       TextStyle,
//       FontSize,
//     ],
//     content: initialContent,
//     editable: !readOnly,
//   })

//   const onSaveContent = () => {
//     if (editor) {
//       onSave(editor.getHTML())
//     }
//   }

//   if (!editor) {
//     return null
//   }

//   return (
//     <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm max-w-4xl mx-auto">
//       {!readOnly && (
//         <div className="flex flex-wrap gap-2 mb-4 items-center">
//           <button
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={`p-2 rounded hover:bg-gray-100 ${
//               editor.isActive('bold') ? 'bg-gray-200' : ''
//             }`}
//             title="Bold"
//           >
//             <b>B</b>
//           </button>
//           <button
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             className={`p-2 rounded hover:bg-gray-100 ${
//               editor.isActive('italic') ? 'bg-gray-200' : ''
//             }`}
//             title="Italic"
//           >
//             <i>I</i>
//           </button>
//           <button
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             className={`p-2 rounded hover:bg-gray-100 ${
//               editor.isActive('underline') ? 'bg-gray-200' : ''
//             }`}
//             title="Underline"
//           >
//             <u>U</u>
//           </button>
//           <button
//             onClick={() => editor.chain().focus().toggleHighlight().run()}
//             className={`p-2 rounded hover:bg-gray-100 ${
//               editor.isActive('highlight') ? 'bg-gray-200' : ''
//             }`}
//             title="Highlight"
//           >
//             <span className="px-1 bg-yellow-300">H</span>
//           </button>
          
//           <select
//             onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
//             className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//             title="Font Size"
//           >
//             <option value="12px">12px</option>
//             <option value="14px">14px</option>
//             <option value="16px" selected>16px</option>
//             <option value="18px">18px</option>
//             <option value="20px">20px</option>
//             <option value="24px">24px</option>
//           </select>

//           <button
//             onClick={onSaveContent}
//             className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//           >
//             Save
//           </button>
//         </div>
//       )}
      
//       <div className={`min-h-[200px] p-4 border border-gray-300 rounded ${
//         readOnly ? 'border-none p-0' : ''
//       }`}>
//         <EditorContent editor={editor} className="prose max-w-none" />
//       </div>
//     </div>
//   )
// }

// export default TextEditor
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-color'
import { useCallback, useState,useEffect } from 'react'

const CleanTextEditor = ({ 
  initialContent = '', 
  onChange, 
  readOnly = false,
  placeholder = 'Write something amazing...' 
}) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [selectionRange, setSelectionRange] = useState(null)
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight.configure({ 
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 rounded px-1',
        }
      }),
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline decoration-blue-500 hover:text-blue-700 transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Color,
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: 'end',
    onSelectionUpdate({ editor }) {
      if (editor.isActive('link')) {
        setLinkUrl(editor.getAttributes('link').href || '')
      }
    },
  })

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const handleLinkSave = useCallback(() => {
    if (!linkUrl || !editor) return
    
    if (selectionRange) {
      editor.chain().focus().setTextSelection(selectionRange).run()
    }
    
    // Update or remove link based on URL content
    if (linkUrl === '') {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    
    setShowLinkMenu(false)
  }, [editor, linkUrl, selectionRange])

  const onSetLink = useCallback(() => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    
    // Store current selection to restore later
    if (editor.state.selection) {
      setSelectionRange(editor.state.selection)
    }
    
    setShowLinkMenu(true)
  }, [editor])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && showLinkMenu) {
      e.preventDefault()
      handleLinkSave()
    }
  }, [showLinkMenu, handleLinkSave])

  const onSaveContent = () => {
    if (editor) {
      onSave(editor.getHTML())
    }
  }

  if (!editor) {
    return <div className="h-60 w-full animate-pulse"></div>
  }

  const insertHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  const getButtonClass = (isActive) => {
    return `p-2 rounded hover:bg-gray-100 ${
      isActive ? 'text-blue-600' : 'text-gray-700'
    } transition-colors duration-150 ease-in-out`
  }

  // Calculate word count manually since we aren't using characterCount extension
  const calculateWordCount = () => {
    if (!editor) return 0;
    const text = editor.getText();
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).length;
  };

  // Calculate character count manually
  const calculateCharCount = () => {
    if (!editor) return 0;
    return editor.getText().length;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!readOnly && (
        <div>
          <div className="flex flex-wrap gap-1 p-2 items-center">
            <div className="flex gap-1 pr-2 mr-1">
              <button
                onClick={() => insertHeading(1)}
                className={getButtonClass(editor.isActive('heading', { level: 1 }))}
                title="Heading 1"
              >
                <span className="font-bold text-lg">H1</span>
              </button>
              <button
                onClick={() => insertHeading(2)}
                className={getButtonClass(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
              >
                <span className="font-bold">H2</span>
              </button>
              <button
                onClick={() => insertHeading(3)}
                className={getButtonClass(editor.isActive('heading', { level: 3 }))}
                title="Heading 3"
              >
                <span className="font-semibold text-sm">H3</span>
              </button>
            </div>
            
            <div className="flex gap-1 pr-2 mr-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={getButtonClass(editor.isActive('bold'))}
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={getButtonClass(editor.isActive('italic'))}
                title="Italic"
              >
                <i>I</i>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={getButtonClass(editor.isActive('underline'))}
                title="Underline"
              >
                <u>U</u>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={getButtonClass(editor.isActive('highlight'))}
                title="Highlight"
              >
                <span className="px-1 bg-yellow-300 rounded">H</span>
              </button>
            </div>
            
            <div className="flex gap-1 pr-2 mr-1">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={getButtonClass(editor.isActive('bulletList'))}
                title="Bullet List"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={getButtonClass(editor.isActive('orderedList'))}
                title="Numbered List"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4"></path>
                  <path d="M4 10h2"></path>
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex gap-1 pr-2 mr-1">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
                title="Align Left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
                title="Align Center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="18" y1="12" x2="6" y2="12"></line>
                  <line x1="19" y1="18" x2="5" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
                title="Align Right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                  <line x1="21" y1="18" x2="7" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="flex gap-1 pr-2 mr-1">
              <button
                onClick={onSetLink}
                className={getButtonClass(editor.isActive('link'))}
                title="Insert Link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex gap-1 items-center pr-2 mr-1">
              <label htmlFor="textColor" className="sr-only">Text Color</label>
              <input
                type="color"
                id="textColor"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-6 h-6 rounded cursor-pointer border-0"
                title="Text Color"
              />
              
              <select
                onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                className="p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                title="Font Size"
                value={editor.getAttributes('textStyle').fontSize || '16px'}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
              </select>
            </div>
            
            {/* <button
              type="button"
              onClick={onSaveContent}
              className="ml-auto px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150 ease-in-out flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button> */}
          </div>
          
          {/* Link popup */}
          {showLinkMenu && (
            <div className="flex p-2 items-center gap-2">
              <span className="text-sm text-gray-600">Link URL:</span>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="flex-1 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleLinkSave}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Apply
              </button>
              <button
                onClick={() => setShowLinkMenu(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
     
      <div className={`${readOnly ? 'p-0 overflow-auto' : 'min-h-[250px] p-4'}`}>
        <EditorContent 
          editor={editor} 
          className="prose  border-0 focus:outline-none focus:ring-0 focus:border-0  rounded-lg " 
        />
      </div>
      
      {!readOnly && (
        <div className="p-2 flex justify-between items-center text-xs text-gray-500">
          <div>
            {calculateCharCount()} characters
            {calculateWordCount() > 0 && (
              <> • {calculateWordCount()} words</>
            )}
          </div>
          <div>
            Press <kbd className="px-1.5 py-0.5 rounded text-gray-700 text-xs mx-1">Ctrl+S</kbd> to save
          </div>
        </div>
      )}
    </div>
  )
}

export default CleanTextEditor;