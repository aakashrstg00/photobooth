import React, { useState } from 'react';
import type { CroppedImage, DesignConfigs } from '../types';
import { getContrastPatternColor, getContrastPatternColorStrong } from '../utils/colorUtils';

interface CollagePreviewProps {
  images: CroppedImage[];
  configs: DesignConfigs;
  onReorder?: (newImages: CroppedImage[]) => void;
}

const CollagePreview: React.FC<CollagePreviewProps> = ({ images, configs, onReorder }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const patternColor = getContrastPatternColor(configs.backgroundColor || '#ffffff');
  const patternColorStrong = getContrastPatternColorStrong(configs.backgroundColor || '#ffffff');

  return (
    <div
      className={`collage-container pattern-${configs.pattern}`}
      style={{
        backgroundColor: configs.backgroundColor,
        padding: `${configs.borderThickness}px`,
        // We'll set the background size dynamically based on scale
        backgroundSize: configs.pattern !== 'none' ? `${configs.patternScale}px ${configs.patternScale}px` : undefined,
        // @ts-ignore
        '--pattern-color': patternColor,
        '--pattern-color-strong': patternColorStrong,
      }}
    >
      <div
        className="images-grid"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${configs.borderThickness}px`,
          width: '100%',
        }}
      >
        {images.map((img, index) => (
          <div
            key={img.id}
            className="collage-image-wrapper"
            draggable={!!onReorder}
            onDragStart={(e) => {
              if (onReorder) {
                setDraggedIndex(index);
                e.dataTransfer.effectAllowed = "move";
              }
            }}
            onDragOver={(e) => {
              if (onReorder) {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }
            }}
            onDrop={(e) => {
              if (!onReorder || draggedIndex === null || draggedIndex === index) return;
              e.preventDefault();
              const newImages = [...images];
              const temp = newImages[draggedIndex];
              newImages[draggedIndex] = newImages[index];
              newImages[index] = temp;
              onReorder(newImages);
              setDraggedIndex(null);
            }}
            onDragEnd={() => setDraggedIndex(null)}
            style={{
              opacity: draggedIndex === index ? 0.4 : 1,
              cursor: onReorder ? 'grab' : 'default',
              transition: 'opacity 0.2s',
            }}
          >
            <img src={img.url} alt={`Cropped ${index}`} draggable={false} />
          </div>
        ))}
      </div>

      <div
        className={`text-overlay position-${configs.text.position}`}
        style={{
          fontSize: `${configs.text.fontSize}px`,
          color: configs.text.color,
          padding: `${configs.borderThickness / 2}px`,
          minHeight: `${(configs.text.fontSize * 1.2) + configs.borderThickness}px`, // Fixed height: line-height + total padding
        }}
      >
        {configs.text.content || '\u00A0'}
      </div>

      <style>{`
        .collage-container {
          position: relative;
          width: 100%;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .images-grid {
          width: 100%;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .collage-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 100%; /* Keeps aspect ratio based on width */
          flex-shrink: 0;
        }

        .collage-image-wrapper img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .text-overlay {
          width: 100%;
          text-align: center;
          font-weight: 600;
          font-family: ${configs.text.fontFamily || 'var(--font-display)'};
          line-height: 1.2;
          box-sizing: border-box;
          flex-shrink: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-overlay.position-top {
          order: -1;
        }
        
        .text-overlay.position-bottom {
          order: 1;
        }

        /* Patterns */
        /* Note: background-size is overridden inline by patternScale */
        .pattern-dots {
          background-image: radial-gradient(var(--pattern-color) 1.5px, transparent 1.5px);
        }
        .pattern-lines {
          background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 0, transparent 50%);
          /* Override to make lignes work with standard background-size if needed, but linear-gradient is tricky with size. 
             Let's use a simple repeating gradient that scales with background-size implicitly or just use the size for spacing. 
             Actually, for lines, a simple repeating-linear-gradient is best controlled by the gradient definition itself, 
             but we can also use background-size with a fixed gradient tile. */
           background-image: linear-gradient(45deg, var(--pattern-color) 25%, transparent 25%, transparent 50%, var(--pattern-color) 50%, var(--pattern-color) 75%, transparent 75%, transparent);
        }
        .pattern-grid {
          background-image: 
            linear-gradient(var(--pattern-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px);
        }
        .pattern-checkers {
          background-image: 
            linear-gradient(45deg, var(--pattern-color-strong) 25%, transparent 25%), 
            linear-gradient(-45deg, var(--pattern-color-strong) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, var(--pattern-color-strong) 75%), 
            linear-gradient(-45deg, transparent 75%, var(--pattern-color-strong) 75%);
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px; 
          /* The background-position logic for checkers is dependent on size, so dynamic scaling might break the perfect checkboard if not careful.
             But let's try to make it work. Ideally size/2. */
        }

      `}</style>
    </div>
  );
};

export default CollagePreview;
