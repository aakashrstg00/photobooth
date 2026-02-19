import React from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
    return (
        <header className="app-header glass">
            <div className="header-content container">
                <div className="logo">
                    <Camera size={28} strokeWidth={2.5} />
                    <h1>PhotoBooth</h1>
                </div>
                {showReset && (
                    <button className="btn-reset" onClick={onReset} title="Start Over">
                        <RefreshCw size={18} />
                        <span>Reset</span>
                    </button>
                )}
            </div>
            <style>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          height: 72px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo h1 {
          font-size: 1.5rem;
          margin: 0;
        }
        .btn-reset {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.875rem;
          padding: 8px 16px;
          border-radius: 20px;
        }
        .btn-reset:hover {
          background: rgba(0,0,0,0.05);
          color: var(--text-primary);
        }
      `}</style>
        </header>
    );
};

export default Header;
