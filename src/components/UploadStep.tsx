import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import type { RawImage } from '../types';
import { processImage } from '../utils/imageProcessing';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadStepProps {
    onUpload: (images: RawImage[]) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ onUpload }) => {
    const [images, setImages] = useState<RawImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (images.length + files.length > 3) {
            setError('You can only upload up to 3 images.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const newImages: RawImage[] = [];
            for (const file of files) {
                const url = await processImage(file);
                newImages.push({
                    id: Math.random().toString(36).substring(7),
                    url,
                    name: file.name,
                    type: file.type,
                });
            }
            setImages((prev) => [...prev, ...newImages]);
        } catch (err) {
            console.error(err);
            setError('Failed to process one or more images. Please use JPG or PNG.');
        } finally {
            setIsProcessing(false);
        }
    }, [images]);

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const isValid = images.length === 2 || images.length === 3;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card upload-section"
        >
            <h2 className="section-title">Upload your memories</h2>
            <p className="section-subtitle">Select 2 or 3 images to create your photobooth collage.</p>

            <div className="upload-grid">
                <label className={`upload-box ${images.length >= 3 ? 'disabled' : ''}`}>
                    <input
                        type="file"
                        multiple
                        accept="image/*,.heic"
                        onChange={onFileChange}
                        disabled={images.length >= 3 || isProcessing}
                        style={{ display: 'none' }}
                    />
                    <div className="upload-box-content">
                        <Upload size={40} className="upload-icon" />
                        <span>{isProcessing ? 'Processing...' : 'Click or Drag Images'}</span>
                        <small>JPG, PNG, HEIC</small>
                    </div>
                </label>

                <AnimatePresence>
                    {images.map((img) => (
                        <motion.div
                            key={img.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="preview-item"
                        >
                            <img src={img.url} alt={img.name} />
                            <button className="remove-btn" onClick={() => removeImage(img.id)}>
                                <X size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="action-bar">
                <button
                    className="btn btn-primary"
                    disabled={!isValid || isProcessing}
                    onClick={() => onUpload(images)}
                >
                    <span>Continue to Crop</span>
                </button>
            </div>

            <style>{`
        .upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .upload-box {
          aspect-ratio: 1;
          border: 2px dashed var(--border-color);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafafa;
        }
        .upload-box:hover:not(.disabled) {
          border-color: var(--accent-color);
          background: #f0f0f0;
        }
        .upload-box.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .upload-box-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }
        .upload-icon {
          color: var(--border-color);
          margin-bottom: 8px;
        }
        .preview-item {
          aspect-ratio: 1;
          border-radius: var(--border-radius);
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
        }
        .preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.5);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .remove-btn:hover {
          background: rgba(0,0,0,0.8);
        }
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          background: #fee2e2;
          padding: 12px;
          border-radius: var(--border-radius);
          margin-bottom: 24px;
        }
        .action-bar {
          display: flex;
          justify-content: center;
        }
      `}</style>
        </motion.div>
    );
};

export default UploadStep;
