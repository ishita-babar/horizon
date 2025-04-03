"use client";
import { useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import "./ideate.css";

export default function Ideate() {
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [content, setContent] = useState("");
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const fonts = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Calibri"
  ];

  const fontSizes = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px"
  ];

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const applyBulletPoints = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const newContent = content.replace(
        selectedText,
        selectedText.split('\n').map(line => `• ${line}`).join('\n')
      );
      setContent(newContent);
    } else {
      setContent(prevContent => prevContent + "\n• ");
    }
  };

  const handleTableCreate = () => {
    setShowTableModal(true);
  };

  const generateTable = () => {
    let tableHTML = "\n<table>\n";
    
    
    tableHTML += "  <tr>\n";
    for (let j = 0; j < tableCols; j++) {
      tableHTML += `    <th>Header ${j + 1}</th>\n`;
    }
    tableHTML += "  </tr>\n";
    
  
    for (let i = 0; i < tableRows - 1; i++) {
      tableHTML += "  <tr>\n";
      for (let j = 0; j < tableCols; j++) {
        tableHTML += `    <td>Row ${i + 1}, Col ${j + 1}</td>\n`;
      }
      tableHTML += "  </tr>\n";
    }
    
    tableHTML += "</table>\n";
    
    setContent(prevContent => prevContent + tableHTML);
    setShowTableModal(false);
  };

  const exportToPDF = () => {

    let printContent = '';
    let title = 'Ideate Notes';
    
    if (isDrawingMode && canvasRef.current) {
      title = 'Ideate Drawing';
      const dataUrl = canvasRef.current.toDataURL('image/png');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: ${fontFamily};
                margin: 20px;
                color: #235055;
              }
              .export-header {
                margin-bottom: 20px;
                border-bottom: 1px solid #235055;
                padding-bottom: 10px;
              }
              img {
                max-width: 100%;
                border: 1px solid #235055;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .print-button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="export-header">
              <h1>${title}</h1>
              <p>Exported on ${new Date().toLocaleString()}</p>
            </div>
            <img src="${dataUrl}" alt="Drawing" />
            <div class="print-button" style="margin-top: 20px;">
              <button onclick="window.print(); setTimeout(() => window.close(), 500);">
                Save as PDF
              </button>
            </div>
            <script>
              setTimeout(() => window.print(), 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      const styledContent = content.replace(/\n/g, '<br>');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: ${fontFamily};
                font-size: ${fontSize};
                margin: 20px;
                color: #235055;
              }
              .content {
                text-align: ${textAlign};
                font-weight: ${isBold ? 'bold' : 'normal'};
                font-style: ${isItalic ? 'italic' : 'normal'};
                text-decoration: ${isUnderline ? 'underline' : 'none'};
                line-height: 1.5;
              }
              .export-header {
                margin-bottom: 20px;
                border-bottom: 1px solid #235055;
                padding-bottom: 10px;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 15px 0;
              }
              th {
                background-color: #235055;
                color: white;
                padding: 8px;
                text-align: left;
                border: 1px solid #235055;
              }
              td {
                padding: 8px;
                border: 1px solid #235055;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .print-button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="export-header">
              <h1>${title}</h1>
              <p>Exported on ${new Date().toLocaleString()}</p>
            </div>
            <div class="content">${styledContent}</div>
            <div class="print-button" style="margin-top: 20px;">
              <button onclick="window.print(); setTimeout(() => window.close(), 500);">
                Save as PDF
              </button>
            </div>
            <script>
              setTimeout(() => window.print(), 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
    if (!isDrawingMode) {
      setTimeout(() => {
        initCanvas();
      }, 0);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#235055';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawing(true);
    setLastPos({ x, y });
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  return (
    <div className="ideate-container">
      <Sidebar />
      <div className="ideate-content">
        <h1 className="ideate-title">Ideate</h1>
        
        <div className="toolbar">
          <div className="toolbar-section">
            <select 
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value)}
              className="toolbar-select"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            
            <select 
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value)}
              className="toolbar-select"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="toolbar-section">
            <button 
              className={`toolbar-button ${isBold ? 'active' : ''}`}
              onClick={() => setIsBold(!isBold)}
            >
              B
            </button>
            <button 
              className={`toolbar-button ${isItalic ? 'active' : ''}`}
              onClick={() => setIsItalic(!isItalic)}
            >
              I
            </button>
            <button 
              className={`toolbar-button ${isUnderline ? 'active' : ''}`}
              onClick={() => setIsUnderline(!isUnderline)}
            >
              U
            </button>
          </div>
          
          <div className="toolbar-section">
            <button 
              className="toolbar-button"
              onClick={() => setTextAlign('left')}
            >
              ⇧
            </button>
            <button 
              className="toolbar-button"
              onClick={() => setTextAlign('center')}
            >
              ⋯
            </button>
            <button 
              className="toolbar-button"
              onClick={() => setTextAlign('right')}
            >
              ⇨
            </button>
          </div>
          
          <div className="toolbar-section">
            <button 
              className="toolbar-button"
              onClick={applyBulletPoints}
            >
              •
            </button>
            <button 
              className="toolbar-button action-button"
              onClick={handleTableCreate}
            >
              Table
            </button>
          </div>
          
          <div className="toolbar-section">
            <button 
              className="toolbar-button action-button export-button"
              onClick={exportToPDF}
            >
              Export PDF
            </button>
            <button 
              className={`toolbar-button action-button ${isDrawingMode ? 'active' : ''}`}
              onClick={toggleDrawingMode}
            >
              Draw
            </button>
          </div>
        </div>
        
        {isDrawingMode ? (
          <div className="drawing-container">
            <canvas 
              ref={canvasRef}
              className="drawing-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            ></canvas>
            <div className="drawing-controls">
              <button className="toolbar-button" onClick={toggleDrawingMode}>
                Back to Editor
              </button>
              <button className="toolbar-button export-button" onClick={exportToPDF}>
                Export Drawing
              </button>
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <textarea
              ref={editorRef}
              className="editor"
              value={content}
              onChange={handleContentChange}
              style={{
                fontFamily,
                fontSize,
                textAlign,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none'
              }}
              placeholder="Start taking notes here..."
            />
          </div>
        )}
        
        {showTableModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Insert Table</h3>
              <div className="modal-content">
                <div className="input-group">
                  <label htmlFor="table-rows">Rows:</label>
                  <input 
                    type="number" 
                    id="table-rows" 
                    min="1" 
                    max="20" 
                    value={tableRows} 
                    onChange={(e) => setTableRows(parseInt(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="table-cols">Columns:</label>
                  <input 
                    type="number" 
                    id="table-cols" 
                    min="1" 
                    max="10" 
                    value={tableCols} 
                    onChange={(e) => setTableCols(parseInt(e.target.value))}
                  />
                </div>
                <div className="table-preview">
                  {Array(Math.min(tableRows, 5)).fill().map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="preview-row">
                      {Array(Math.min(tableCols, 5)).fill().map((_, colIndex) => (
                        <div 
                          key={`cell-${rowIndex}-${colIndex}`} 
                          className={`preview-cell ${rowIndex === 0 ? 'header-cell' : ''}`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowTableModal(false)}>Cancel</button>
                <button onClick={generateTable}>Insert</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}