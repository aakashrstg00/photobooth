import React, { useState, useEffect } from 'react';
import type { CroppedImage, DesignConfigs } from '../types';
import CollagePreview from './CollagePreview';
import { Download, FileText, Share2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { renderCollageToCanvas, downloadImage, downloadPDF } from '../utils/exportHelpers';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface ExportStepProps {
    images: CroppedImage[];
    configs: DesignConfigs;
    onBack: () => void;
}

const ExportStep: React.FC<ExportStepProps> = ({ images, configs, onBack }) => {
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#000000', '#666666', '#ffffff']
        });
    }, []);

    const handleExportImage = async () => {
        setIsExporting(true);
        try {
            const canvas = await renderCollageToCanvas(images, configs, 4);
            downloadImage(canvas, 'photobooth-collage.png');
        } catch (e) {
            console.error(e);
            alert('Failed to export image.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const canvas = await renderCollageToCanvas(images, configs, 4);
            downloadPDF(canvas, 'photobooth-collage.pdf');
        } catch (e) {
            console.error(e);
            alert('Failed to export PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="export-step"
        >
            <div className="export-layout">
                <div className="preview-container card">
                    <CollagePreview images={images} configs={configs} />
                </div>

                <div className="info-panel card">
                    <div className="success-header">
                        <CheckCircle2 size={48} className="success-icon" />
                        <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.5rem' }}>Ready for the World!</h2>
                        <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: '24px' }}>Your photobooth masterpiece is complete.</p>
                    </div>

                    <div className="export-actions">
                        <div className="action-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={handleExportImage}
                                disabled={isExporting}
                            >
                                <Download size={20} />
                                {isExporting ? 'Generating...' : 'Download PNG'}
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                <FileText size={20} />
                                {isExporting ? 'Generating...' : 'Save as PDF'}
                            </button>
                        </div>

                        <div className="share-section">
                            <button className="btn-share" onClick={() => alert('Sharing coming soon!')}>
                                <Share2 size={18} />
                                <span>Share to Social</span>
                            </button>
                            <button className="btn-back-design" onClick={onBack}>
                                <ArrowLeft size={16} />
                                <span>Back to Editor</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .export-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .export-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .preview-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
        }
        .info-panel {
          padding: 32px;
        }
        @media (max-width: 480px) {
          .info-panel {
            padding: 20px;
          }
          .preview-container {
            padding: 16px;
          }
        }
        .success-icon {
          color: #10b981;
          margin-bottom: 20px;
        }
        .export-actions {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 480px) {
           .action-buttons {
              grid-template-columns: 1fr;
           }
        }
        .share-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }
        .btn-share {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-color);
          font-weight: 600;
          font-size: 0.875rem;
        }
        .btn-back-design {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
        </motion.div>
    );
};

export default ExportStep;
