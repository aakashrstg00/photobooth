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
            <div className="card export-card">
                <div className="success-header">
                    <CheckCircle2 size={48} className="success-icon" />
                    <h2 className="section-title">Ready for the World!</h2>
                    <p className="section-subtitle">Your photobooth masterpiece is complete.</p>
                </div>

                <div className="final-preview">
                    <CollagePreview images={images} configs={configs} />
                </div>

                <div className="export-actions">
                    <button
                        className="btn btn-primary export-btn"
                        onClick={handleExportImage}
                        disabled={isExporting}
                    >
                        <Download size={20} />
                        {isExporting ? 'Generating...' : 'Download PNG'}
                    </button>

                    <button
                        className="btn btn-secondary export-btn"
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

            <style>{`
        .export-card {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .success-icon {
          color: #10b981;
          margin-bottom: 16px;
        }
        .final-preview {
          margin: 32px auto;
          max-width: 320px;
        }
        .export-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
        }
        .export-btn {
          width: 100%;
          padding: 16px;
          font-size: 1.125rem;
        }
        .share-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
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
