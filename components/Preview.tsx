'use client';

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div className='preview-container'>
      {/* STYLES FOR VISIBILITY */}
      <style>{`
        .preview-content h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
        .preview-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; }
        .preview-content h3 { font-size: 1.25rem; font-weight: 600; }
        .preview-content h4 { font-size: 1.1rem; font-weight: 600; }
        .preview-content h5 { font-size: 1rem; font-weight: 600; font-style: italic; }
        .preview-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
        .preview-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
        .preview-content table { border-collapse: collapse; width: 100%; border: 1px solid #ddd; margin: 1rem 0; }
        .preview-content td, .preview-content th { border: 1px solid #ddd; padding: 8px; min-width: 50px; }
        .preview-content th { background-color: #f8fafc; text-align: left; font-weight: bold; }
        
        /* UPDATED LINK LOGIC: Force links to be clickable even if parents are not */
        .preview-content a { 
          color: #0ea5e9; 
          text-decoration: underline; 
          position: relative;
          z-index: 10;
          pointer-events: auto !important; 
        }

        .preview-content mark { background-color: #fef08a; padding: 0 0.2rem; border-radius: 0.2rem; }
        .preview-content blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; font-style: italic; color: #64748b; }

        /* Task list styling */
        .preview-content ul[data-type="taskList"] { list-style: none !important; padding: 0 !important; }
        .preview-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
        
        /* FIXED: Block all mouse interactions with the checkbox specifically */
        .preview-content input[type="checkbox"] { 
          margin-top: 0.25rem; 
          pointer-events: none !important; 
          user-select: none !important;
        }
        
        /* Extra safety: prevent toggling via the label/list item */
        .preview-content ul[data-type="taskList"] li {
          pointer-events: none;
        }
        
        /* Re-enable links inside the disabled list items */
        .preview-content ul[data-type="taskList"] li a {
          pointer-events: auto !important;
        }
      `}</style>

      <div
        className='preview-content prose prose-sm max-w-none'
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};
