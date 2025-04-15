import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import WebFont from 'webfontloader';

const IframePreview = ({ children, width = '100%', height = '100%', title = 'Preview', fontStyle = 'Poppins' }) => {
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
            <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
            <script>
              WebFont.load({
                google: {
                  families: ['${fontStyle}']
                }
              });
            </script>
            <style>
              body { 
                margin: 0; 
                overflow-x: hidden;
                font-family: '${fontStyle}', sans-serif;
              }
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
  }, [title, fontStyle]);

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