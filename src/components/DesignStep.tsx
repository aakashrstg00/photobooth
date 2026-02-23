import React from 'react';
import type { CroppedImage, DesignConfigs } from '../types';
import CollagePreview from './CollagePreview';
import { Palette, Type, Layout, ChevronRight, ChevronLeft, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesignStepProps {
  images: CroppedImage[];
  setImages: React.Dispatch<React.SetStateAction<CroppedImage[]>>;
  configs: DesignConfigs;
  setConfigs: React.Dispatch<React.SetStateAction<DesignConfigs>>;
  onNext: () => void;
  onBack: () => void;
}

const DesignStep: React.FC<DesignStepProps> = ({ images, setImages, configs, setConfigs, onNext, onBack }) => {
  const updateConfig = (key: keyof DesignConfigs | 'text', value: any) => {
    if (key === 'text') {
      setConfigs(prev => ({ ...prev, text: { ...prev.text, ...value } }));
    } else {
      setConfigs(prev => ({ ...prev, [key]: value }));
    }
  };

  const patterns: DesignConfigs['pattern'][] = ['none', 'dots', 'lines', 'grid', 'checkers'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="design-step"
    >
      <div className="design-layout">
        <div className="preview-panel">
          <CollagePreview images={images} configs={configs} onReorder={setImages} />
        </div>

        <div className="controls-panel card">
          <h2 className="section-title" style={{ fontSize: '1.5rem', textAlign: 'left' }}>Customize Design</h2>

          <div className="control-groups">
            {/* Background Color */}
            <div className="control-group">
              <label><Palette size={18} /> Background Color</label>
              <input
                type="color"
                value={configs.backgroundColor}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                className="color-picker"
              />
            </div>

            {/* Patterns */}
            <div className="control-group">
              <label><Layout size={18} /> Background Pattern</label>
              <div className="pattern-options">
                {patterns.map(p => (
                  <button
                    key={p}
                    className={`pattern-btn ${configs.pattern === p ? 'active' : ''}`}
                    onClick={() => updateConfig('pattern', p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Scale - Only show if pattern is not none */}
            {configs.pattern !== 'none' && (
              <div className="control-group">
                <label><ZoomIn size={18} /> Pattern Spacing</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={configs.patternScale}
                  onChange={(e) => updateConfig('patternScale', parseInt(e.target.value))}
                  className="slider"
                />
              </div>
            )}

            <hr className="divider" />

            {/* Text Overlay */}
            <div className="control-group">
              <label><Type size={18} /> Text Overlay</label>
              <input
                type="text"
                placeholder="Message... (max 10 chars)"
                maxLength={20}
                value={configs.text.content}
                onChange={(e) => updateConfig('text', { content: e.target.value })}
                className="text-input"
              />
            </div>

            <div className="control-group">
              <label>Font Style</label>
              <select
                className="text-input"
                value={configs.text.fontFamily || 'Inter, sans-serif'}
                onChange={(e) => updateConfig('text', { fontFamily: e.target.value })}
              >
                <option value="Inter, sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                <option value="'Dancing Script', cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>Dancing Script</option>
                <option value="'Great Vibes', cursive" style={{ fontFamily: "'Great Vibes', cursive" }}>Great Vibes</option>
                <option value="'Pacifico', cursive" style={{ fontFamily: "'Pacifico', cursive" }}>Pacifico</option>
                <option value="'Caveat', cursive" style={{ fontFamily: "'Caveat', cursive" }}>Caveat</option>
                <option value="'Satisfy', cursive" style={{ fontFamily: "'Satisfy', cursive" }}>Satisfy</option>
                <option value="'Amatic SC', cursive" style={{ fontFamily: "'Amatic SC', cursive" }}>Amatic SC</option>
                <option value="'Courgette', cursive" style={{ fontFamily: "'Courgette', cursive" }}>Courgette</option>
                <option value="'Kaushan Script', cursive" style={{ fontFamily: "'Kaushan Script', cursive" }}>Kaushan Script</option>
                <option value="'Permanent Marker', cursive" style={{ fontFamily: "'Permanent Marker', cursive" }}>Permanent Marker</option>
                <option value="'Sacramento', cursive" style={{ fontFamily: "'Sacramento', cursive" }}>Sacramento</option>
              </select>
            </div>

            <div className="control-row">
              <div className="control-group half">
                <label>Font Size</label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={configs.text.fontSize}
                  onChange={(e) => updateConfig('text', { fontSize: parseInt(e.target.value) })}
                  className="number-input"
                />
              </div>
              <div className="control-group half">
                <label>Text Color</label>
                <input
                  type="color"
                  value={configs.text.color}
                  onChange={(e) => updateConfig('text', { color: e.target.value })}
                  className="color-picker"
                />
              </div>
            </div>

            <div className="control-group">
              <label>Position</label>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${configs.text.position === 'top' ? 'active' : ''}`}
                  onClick={() => updateConfig('text', { position: 'top' })}
                >
                  Top
                </button>
                <button
                  className={`toggle-btn ${configs.text.position === 'bottom' ? 'active' : ''}`}
                  onClick={() => updateConfig('text', { position: 'bottom' })}
                >
                  Bottom
                </button>
              </div>
            </div>
          </div>

          <div className="design-actions">
            <button className="btn btn-secondary" onClick={onBack}>
              <ChevronLeft size={18} /> Back
            </button>
            <button className="btn btn-primary" onClick={onNext}>
              Finish Design <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .design-step {
          width: 100%;
        }
        .design-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .design-layout {
             grid-template-columns: 1fr;
             gap: 24px;
          }
        }
        .preview-panel {
          position: sticky;
          top: 80px;
          max-width: 500px;
          margin: 0 auto;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        @media (max-width: 900px) {
          .preview-panel {
            position: relative;
            top: 0;
            max-height: none;
            overflow: visible;
          }
        }
        .preview-panel::-webkit-scrollbar {
          display: none;
        }
        .controls-panel {
          padding: 24px;
        }
        @media (max-width: 480px) {
          .controls-panel {
            padding: 16px;
          }
        }
        .control-groups {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 24px;
        }
        .control-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .control-row {
          display: flex;
          gap: 16px;
        }
        .half {
          flex: 1;
        }
        .color-picker {
          width: 100%;
          height: 40px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2px;
          background: white;
          cursor: pointer;
        }
        .text-input, .number-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.95rem;
        }
        .slider {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          outline: none;
        }
        .pattern-options, .toggle-group {
          display: flex;
          gap: 8px;
          background: #f1f1f1;
          padding: 4px;
          border-radius: 10px;
          flex-wrap: wrap;
        }
        .pattern-btn, .toggle-btn {
          flex: 1;
          min-width: 80px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .pattern-btn.active, .toggle-btn.active {
          background: white;
          color: var(--accent-color);
          box-shadow: var(--shadow-sm);
        }
        .divider {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 8px 0;
        }
        .design-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 32px;
        }
        @media (max-width: 480px) {
          .design-actions {
             grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default DesignStep;
