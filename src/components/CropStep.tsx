import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import type { RawImage, CroppedImage } from '../types';
import { getCroppedImg } from '../utils/imageProcessing';
import { Check, ArrowLeft, Crop as CropIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CropStepProps {
    rawImages: RawImage[];
    onComplete: (images: CroppedImage[]) => void;
    onBack: () => void;
}

const CropStep: React.FC<CropStepProps> = ({ rawImages, onComplete, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [finishedImages, setFinishedImages] = useState<CroppedImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const currentImage = rawImages[currentIndex];

    const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleNext = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedUrl = await getCroppedImg(currentImage.url, croppedAreaPixels);
            const newFinished = [
                ...finishedImages,
                {
                    id: currentImage.id,
                    url: croppedUrl,
                    crop: croppedAreaPixels,
                },
            ];

            if (currentIndex < rawImages.length - 1) {
                setFinishedImages(newFinished);
                setCurrentIndex(currentIndex + 1);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
            } else {
                onComplete(newFinished);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card crop-section"
        >
            <div className="crop-header">
                <button className="btn-back" onClick={onBack}>
                    <ArrowLeft size={18} />
                    <span>Back</span>
                </button>
                <div className="crop-progress">
                    Image {currentIndex + 1} of {rawImages.length}
                </div>
            </div>

            <h2 className="section-title">Perfect your shots</h2>
            <p className="section-subtitle">Crop each image to a square for the best layout.</p>

            <div className="cropper-container">
                <Cropper
                    image={currentImage.url}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="cropper-controls">
                <div className="zoom-slider">
                    <span>Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e: any) => setZoom(e.target.value)}
                        className="slider"
                    />
                </div>

                <button
                    className="btn btn-primary btn-crop"
                    onClick={handleNext}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Saving...' : (
                        <>
                            {currentIndex < rawImages.length - 1 ? 'Next' : 'Finish Cropping'}
                            {currentIndex < rawImages.length - 1 ? <Check size={18} /> : <CropIcon size={18} />}
                        </>
                    )}
                </button>
            </div>

            <style>{`
        .crop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .crop-progress {
          font-weight: 600;
          color: var(--accent-color);
          background: #eee;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
        }
        .cropper-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: #333;
          border-radius: var(--border-radius);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .cropper-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .zoom-slider {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 400px;
        }
        .zoom-slider span {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .slider {
          flex: 1;
          height: 6px;
          -webkit-appearance: none;
          background: var(--border-color);
          border-radius: 3px;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
        }
        .btn-crop {
          width: 100%;
          max-width: 300px;
        }
      `}</style>
        </motion.div>
    );
};

export default CropStep;
