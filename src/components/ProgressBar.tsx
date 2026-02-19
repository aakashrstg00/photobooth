import React from 'react';
import type { Step } from '../types';

interface ProgressBarProps {
    currentStep: Step;
}

const steps: { key: Step; label: string }[] = [
    { key: 'UPLOAD', label: 'Upload' },
    { key: 'CROP', label: 'Crop' },
    { key: 'DESIGN', label: 'Design' },
    { key: 'EXPORT', label: 'Export' },
];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
        <div className="progress-bar-container">
            <div className="progress-steps container">
                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <React.Fragment key={step.key}>
                            <div className={`step-item ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="step-number">{index + 1}</div>
                                <div className="step-label">{step.label}</div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`step-line ${index < currentIndex ? 'active' : ''}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <style>{`
        .progress-bar-container {
          background: var(--surface-color);
          padding: 20px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 600px;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          background: var(--surface-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }
        .step-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .step-item.active .step-number {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }
        .step-item.current .step-number {
          background: var(--accent-color);
          color: white;
        }
        .step-item.current .step-label {
          color: var(--accent-color);
          font-weight: 600;
        }
        .step-line {
          flex: 1;
          height: 2px;
          background: var(--border-color);
          margin: 0 12px;
          margin-bottom: 24px;
        }
        .step-line.active {
          background: var(--accent-color);
        }
      `}</style>
        </div>
    );
};

export default ProgressBar;
