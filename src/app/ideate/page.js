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
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
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
    
    // Add header row
    tableHTML += "  <tr>\n";
    for (let j = 0; j < tableCols; j++) {
      tableHTML += `    <th>Header ${j + 1}</th>\n`;
    }
    tableHTML += "  </tr>\n";
    
    // Add data rows
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would process the PDF here
      alert(`File "${file.name}" selected. PDF import functionality would be implemented here.`);
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
    
    // Adjust canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get mouse position relative to canvas
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
    
    // Get current mouse position
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
            <label className="toolbar-button action-button">
              <span>Import PDF</span>
              <input 
                type="file" 
                accept=".pdf" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
            </label>
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
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <textarea
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