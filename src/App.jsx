import React, { useState, useRef, useEffect } from 'react';
import domtoimage from 'dom-to-image-more';
import { Download, ImagePlus, Layout, Trash2 } from 'lucide-react';
import './App.css';

const CANVAS_SIZES = [
  { id: 'square', name: 'Square (1:1)', ratio: '1 / 1' },
  { id: 'portrait45', name: 'Instagram Portrait (4:5)', ratio: '4 / 5' },
  { id: 'story', name: 'Story / Reel (9:16)', ratio: '9 / 16' },
  { id: 'landscape', name: 'Facebook / Twitter (16:9)', ratio: '16 / 9' },
  { id: 'a4-portrait', name: 'A4 Poster (1:1.414)', ratio: '1 / 1.414' },
  { id: 'a4-landscape', name: 'A4 Landscape (1.414:1)', ratio: '1.414 / 1' }
];

const TEMPLATES = [
  {
    id: 'split-v',
    icon: 't-split-v',
    name: 'Vertical Split',
    slots: 2,
    layout: [
      { left: 0, top: 0, width: '50%', height: '100%' },
      { left: '50%', top: 0, width: '50%', height: '100%' }
    ]
  },
  {
    id: 'split-h',
    icon: 't-split-h',
    name: 'Horizontal Split',
    slots: 2,
    layout: [
      { left: 0, top: 0, width: '100%', height: '50%' },
      { left: 0, top: '50%', width: '100%', height: '50%' }
    ]
  },
  {
    id: 'grid-3',
    icon: 't-grid-3',
    name: 'Three Grid',
    slots: 3,
    layout: [
      { left: 0, top: 0, width: '50%', height: '100%' },
      { left: '50%', top: 0, width: '50%', height: '50%' },
      { left: '50%', top: '50%', width: '50%', height: '50%' }
    ]
  },
  {
    id: 'grid-4',
    icon: 't-grid-4',
    name: 'Quad Grid',
    slots: 4,
    layout: [
      { left: 0, top: 0, width: '50%', height: '50%' },
      { left: '50%', top: 0, width: '50%', height: '50%' },
      { left: 0, top: '50%', width: '50%', height: '50%' },
      { left: '50%', top: '50%', width: '50%', height: '50%' }
    ]
  },
  {
    id: 'grid-5',
    icon: 't-grid-4',
    name: '5 Photos',
    slots: 5,
    layout: [
      { left: 0, top: 0, width: '50%', height: '50%' },
      { left: '50%', top: 0, width: '50%', height: '50%' },
      { left: 0, top: '50%', width: '33.33%', height: '50%' },
      { left: '33.33%', top: '50%', width: '33.34%', height: '50%' },
      { left: '66.67%', top: '50%', width: '33.33%', height: '50%' }
    ]
  },
  {
    id: 'grid-6',
    icon: 't-grid-4',
    name: '6 Photos',
    slots: 6,
    layout: [
      { left: 0, top: 0, width: '33.33%', height: '50%' },
      { left: '33.33%', top: 0, width: '33.34%', height: '50%' },
      { left: '66.67%', top: 0, width: '33.33%', height: '50%' },
      { left: 0, top: '50%', width: '33.33%', height: '50%' },
      { left: '33.33%', top: '50%', width: '33.34%', height: '50%' },
      { left: '66.67%', top: '50%', width: '33.33%', height: '50%' }
    ]
  },
  {
    id: 'grid-7',
    icon: 't-grid-4',
    name: '7 Photos',
    slots: 7,
    layout: [
      { left: 0, top: 0, width: '33.33%', height: '50%' },
      { left: '33.33%', top: 0, width: '33.34%', height: '50%' },
      { left: '66.67%', top: 0, width: '33.33%', height: '50%' },
      { left: 0, top: '50%', width: '25%', height: '50%' },
      { left: '25%', top: '50%', width: '25%', height: '50%' },
      { left: '50%', top: '50%', width: '25%', height: '50%' },
      { left: '75%', top: '50%', width: '25%', height: '50%' }
    ]
  },
  {
    id: 'grid-8',
    icon: 't-grid-4',
    name: '8 Photos',
    slots: 8,
    layout: [
      { left: 0, top: 0, width: '25%', height: '50%' },
      { left: '25%', top: 0, width: '25%', height: '50%' },
      { left: '50%', top: 0, width: '25%', height: '50%' },
      { left: '75%', top: 0, width: '25%', height: '50%' },
      { left: 0, top: '50%', width: '25%', height: '50%' },
      { left: '25%', top: '50%', width: '25%', height: '50%' },
      { left: '50%', top: '50%', width: '25%', height: '50%' },
      { left: '75%', top: '50%', width: '25%', height: '50%' }
    ]
  },
  {
    id: 'grid-9',
    icon: 't-grid-4',
    name: '9 Photos',
    slots: 9,
    layout: [
      { left: 0, top: 0, width: '33.33%', height: '33.33%' },
      { left: '33.33%', top: 0, width: '33.34%', height: '33.33%' },
      { left: '66.67%', top: 0, width: '33.33%', height: '33.33%' },
      { left: 0, top: '33.33%', width: '33.33%', height: '33.34%' },
      { left: '33.33%', top: '33.33%', width: '33.34%', height: '33.34%' },
      { left: '66.67%', top: '33.33%', width: '33.33%', height: '33.34%' },
      { left: 0, top: '66.67%', width: '33.33%', height: '33.33%' },
      { left: '33.33%', top: '66.67%', width: '33.34%', height: '33.33%' },
      { left: '66.67%', top: '66.67%', width: '33.33%', height: '33.33%' }
    ]
  }
];

function App() {
  const [images, setImages] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('grid-4');
  const [canvasSize, setCanvasSize] = useState(CANVAS_SIZES[0]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Dynamic Header State
  const [showHeader, setShowHeader] = useState(true);
  const [headerBanner, setHeaderBanner] = useState('/collage-header.png');
  const [eventName, setEventName] = useState('Enter Event Title');
  const [eventDate, setEventDate] = useState('Enter the Date of the Event');

  // Photo Adjustments State
  const [imagePositions, setImagePositions] = useState({}); // { imageId: {x, y} }
  
  const moveImage = (imageId, dx, dy) => {
    setImagePositions(prev => {
      const pos = prev[imageId] || { x: 50, y: 50 };
      return {
        ...prev,
        [imageId]: {
          x: Math.max(0, Math.min(100, pos.x + dx)),
          y: Math.max(0, Math.min(100, pos.y + dy))
        }
      };
    });
  };

  const fileInputRef = useRef(null);
  const frameInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const collageRef = useRef(null);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
      if (headerBanner) URL.revokeObjectURL(headerBanner);
    };
  }, [images, headerBanner]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Convert to Base64 to strictly ensure the exporter can draw them
    const newImages = await Promise.all(files.map(async file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result,
            file
          });
        };
        reader.readAsDataURL(file);
      });
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    const newImages = await Promise.all(files.map(async file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result,
            file
          });
        };
        reader.readAsDataURL(file);
      });
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idToRemove) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
    setImagePositions(prev => {
      const newPos = { ...prev };
      delete newPos[idToRemove];
      return newPos;
    });
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeaderBanner(reader.result);
      if (logoInputRef.current) logoInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Duplicate removeImage removed to fix syntax error

  const handleExport = async () => {
    if (!collageRef.current) return;
    
    setIsExporting(true);
    try {
      // Let React complete the state update (removes hover controls)
      await new Promise(r => setTimeout(r, 200));

      const node = collageRef.current;
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const dataUrl = await domtoimage.toPng(node, {
        bgcolor: '#ffffff',
        width: width,
        height: height,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        },
        scale: 2
      });
      
      // Convert Data URL to Blob for robust downloading
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `PhotoCollage-${Date.now()}.png`;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Delay revocation so the browser has time to capture the filename
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.error('Failed to export collage', err);
      alert('Failed to generate collage. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <Layout className="h-6 w-6 text-blue-500" />
          REC Photo Collage Maker
        </h1>
        <button 
          className="primary-btn" 
          onClick={handleExport}
          disabled={isExporting || images.length === 0}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Generating...' : 'Download Collage'}
        </button>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          {/* Template Selection */}
          <div className="sidebar-section">
            <h2><Layout className="w-4 h-4" /> Layout Templates</h2>
            <div className="template-grid">
              {TEMPLATES.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplateId === template.id ? 'active' : ''}`}
                  onClick={() => setSelectedTemplateId(template.id)}
                  title={template.name}
                >
                  <div className="template-icon" style={{ position: 'relative', background: 'transparent' }}>
                    {template.layout.map((slot, i) => (
                      <div key={i} style={{ 
                        position: 'absolute',
                        left: slot.left,
                        top: slot.top,
                        width: slot.width,
                        height: slot.height,
                        backgroundColor: 'var(--border-color)',
                        border: '1px solid var(--surface-color)',
                        boxSizing: 'border-box'
                      }}></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Size Selection */}
          <div className="sidebar-section">
            <h2><Layout className="w-4 h-4" /> Collage Size</h2>
            <select 
              className="text-input" 
              value={canvasSize.id} 
              onChange={e => setCanvasSize(CANVAS_SIZES.find(s => s.id === e.target.value))}
              style={{ padding: '0.75rem', width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
            >
              {CANVAS_SIZES.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Choose a format tailored for social media or print.
            </p>
          </div>

          {/* Dynamic College Header Builder */}
          <div className="sidebar-section bg-surface-alt">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2><Layout className="w-4 h-4" /> Header Section</h2>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input 
                  type="checkbox" 
                  checked={showHeader} 
                  onChange={(e) => setShowHeader(e.target.checked)} 
                /> Show
              </label>
            </div>
            
            {showHeader && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    id="banner-upload" 
                    ref={logoInputRef} 
                    onChange={handleBannerUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="banner-upload" className="secondary-btn" style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: 'var(--accent-color)', color: 'white', borderRadius: '4px', fontSize: '0.875rem', flex: 1, textAlign: 'center' }}>
                    {headerBanner ? 'Change Banner Image' : 'Upload Banner Image'}
                  </label>
                  {headerBanner && (
                    <button onClick={() => setHeaderBanner(null)} className="delete-btn-inline">Remove</button>
                  )}
                </div>

                <input 
                  type="text" 
                  className="text-input" 
                  value={eventName} 
                  onChange={e => setEventName(e.target.value)} 
                  placeholder="Event Name"
                />
                <input 
                  type="text" 
                  className="text-input" 
                  value={eventDate} 
                  onChange={e => setEventDate(e.target.value)} 
                  placeholder="Date or Subtitle"
                />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="sidebar-section">
            <h2><ImagePlus className="w-4 h-4" /> Event Photos</h2>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="uploader">
              <ImagePlus className="w-8 h-8 mb-2" />
              <p>Click or Drag images here</p>
              <span className="text-xs opacity-70">Supports JPG, PNG</span>
            </label>

            {/* Gallery */}
            {images.length > 0 && (
              <div className="image-gallery">
                {images.map(img => (
                  <div key={img.id} className="gallery-item">
                    <img src={img.url} alt="Uploaded" />
                    <button 
                      className="delete-btn"
                      onClick={() => removeImage(img.id)}
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {images.length > 0 && (
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {images.length} {images.length === 1 ? 'image' : 'images'} uploaded. 
                The collage automatically uses up to {selectedTemplate.slots} images.
              </p>
            )}
          </div>
        </aside>

        <section className="workspace">
          {/* The Collage Output Area */}
          <div className="canvas-wrapper" style={{ aspectRatio: canvasSize.ratio }}>
            <div className="collage-container" ref={collageRef}>
              
              {/* Dynamic Header */}
              {showHeader && (
                <div className="dynamic-header-banner" style={{ flexDirection: 'column', gap: '0', padding: '0.25rem 0.5rem' }}>
                  {headerBanner && (
                    <img 
                      src={headerBanner} 
                      alt="Banner" 
                      style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} 
                    />
                  )}
                  {eventName && <h3 className="banner-event" style={{ marginTop: '0.25rem', fontSize: '1.25rem' }}>{eventName}</h3>}
                  {eventDate && <p className="banner-sub" style={{ textTransform: 'none', color: '#64748b', fontSize: '0.875rem' }}>{eventDate}</p>}
                </div>
              )}

              {/* Photo Area */}
              <div className="collage-grid-wrapper">
                {/* Photo Slots */}
                {selectedTemplate.layout.map((slotStyle, index) => {
                  const image = images[index]; // Autofill based on order
                  const pos = image ? (imagePositions[image.id] || { x: 50, y: 50 }) : { x: 50, y: 50 };

                  return (
                    <div 
                      key={index} 
                      className="collage-slot"
                      style={slotStyle}
                    >
                      {image ? (
                        <>
                          <img 
                            src={image.url} 
                            alt={`Slot ${index + 1}`} 
                            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
                          />
                          {!isExporting && (
                            <div className="adjust-controls">
                              <button onClick={() => moveImage(image.id, 0, -5)} title="Move Up">▲</button>
                              <div className="adjust-row">
                                <button onClick={() => moveImage(image.id, -5, 0)} title="Move Left">◀</button>
                                <button onClick={() => moveImage(image.id, 5, 0)} title="Move Right">▶</button>
                              </div>
                              <button onClick={() => moveImage(image.id, 0, 5)} title="Move Down">▼</button>
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ opacity: 0.5, fontSize: '0.875rem' }}>Img {index + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
            Images are automatically placed into the template slots. <br/>
            Upload more images or change the template layout to see different results.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
