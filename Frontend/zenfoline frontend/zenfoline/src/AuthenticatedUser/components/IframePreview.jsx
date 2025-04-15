import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const IframePreview = ({ children, width = '100%', height = '100%', title = 'Preview' }) => {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; overflow-x: hidden; }
            </style>
          </head>
          <body>
            <div id="iframe-root"></div>
          </body>
        </html>
      `);
      iframeDoc.close();
      setMountNode(iframeDoc.getElementById('iframe-root'));
    }
  }, [title]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      style={{
        width: width,
        height: height,
        border: 'none',
        transition: 'width 0.3s ease-in-out'
      }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

export default IframePreview; 