import React, { useState } from 'react';
import type { Step, RawImage, CroppedImage, DesignConfigs } from './types';
import UploadStep from './components/UploadStep';
import CropStep from './components/CropStep';
import DesignStep from './components/DesignStep';
import ExportStep from './components/ExportStep';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import './App.css';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('UPLOAD');
  const [rawImages, setRawImages] = useState<RawImage[]>([]);
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [designConfigs, setDesignConfigs] = useState<DesignConfigs>({
    borderThickness: 24,
    backgroundColor: '#ffffff',
    pattern: 'dots',
    patternScale: 20,
    text: {
      content: '',
      fontSize: 24,
      color: '#000000',
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
    },
  });

  const handleImagesUploaded = (images: RawImage[]) => {
    setRawImages(images);
    setCurrentStep('CROP');
  };

  const handleCropped = (images: CroppedImage[]) => {
    setCroppedImages(images);
    setCurrentStep('DESIGN');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to start over?')) {
      setRawImages([]);
      setCroppedImages([]);
      setCurrentStep('UPLOAD');
    }
  };

  return (
    <div className="app-container">
      <Header onReset={handleReset} showReset={currentStep !== 'UPLOAD'} />
      <ProgressBar currentStep={currentStep} />

      <main className="main-content">
        {currentStep === 'UPLOAD' && (
          <UploadStep onUpload={handleImagesUploaded} />
        )}

        {currentStep === 'CROP' && (
          <CropStep
            rawImages={rawImages}
            onComplete={handleCropped}
            onBack={() => setCurrentStep('UPLOAD')}
          />
        )}

        {currentStep === 'DESIGN' && (
          <DesignStep
            images={croppedImages}
            setImages={setCroppedImages}
            configs={designConfigs}
            setConfigs={setDesignConfigs}
            onNext={() => setCurrentStep('EXPORT')}
            onBack={() => setCurrentStep('CROP')}
          />
        )}

        {currentStep === 'EXPORT' && (
          <ExportStep
            images={croppedImages}
            configs={designConfigs}
            onBack={() => setCurrentStep('DESIGN')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 PhotoBooth Studio. By <a target='_blank' href="https://github.com/aakashrstg00">aakashrstg00</a>.</p>
      </footer>
    </div>
  );
};

export default App;
