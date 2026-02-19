import { jsPDF } from 'jspdf';
import type { CroppedImage, DesignConfigs } from '../types';
import { createImage } from './imageProcessing';
import { getContrastPatternColor, getContrastPatternColorStrong } from './colorUtils';

export const renderCollageToCanvas = async (
    images: CroppedImage[],
    configs: DesignConfigs,
    scale: number = 2
): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const numImgs = images.length;
    const border = configs.borderThickness * scale;
    const gridGap = border;

    const baseWidth = 400;
    const totalWidth = baseWidth * scale;

    const cellWidth = totalWidth - (border * 2);
    const cellHeight = cellWidth;

    const fontSize = configs.text.fontSize * scale;
    const textHeight = fontSize * 2;

    const totalHeight = (border * 2) + (numImgs * cellHeight) + ((numImgs - 1) * gridGap) + textHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // 1. Draw Background
    ctx.fillStyle = configs.backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // 2. Draw Pattern
    /* 
       Logic for patternScale:
       - We treat patternScale roughly as the 'spacing' or 'size' parameter.
       - The user sees 10-100 on the slider.
       - We multiply by scale to keep it consistent with canvas resolution.
    */
    const drawPattern = () => {
        if (configs.pattern === 'none') return;

        ctx.save();
        const s = configs.patternScale * scale;
        // Ensure minimum meaningful size/gap to avoid infinite loops or density overload
        const spacing = Math.max(s, 5 * scale);

        // Calculate dynamic colors
        const patternColor = getContrastPatternColor(configs.backgroundColor);
        const patternColorStrong = getContrastPatternColorStrong(configs.backgroundColor);

        if (configs.pattern === 'dots') {
            ctx.fillStyle = patternColor;
            for (let x = 0; x < totalWidth; x += spacing) {
                for (let y = 0; y < totalHeight; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (configs.pattern === 'lines') {
            ctx.strokeStyle = patternColor;
            ctx.lineWidth = 1 * scale;
            // For lines, spacing controls the gap between diagonal lines
            // We iterate safely
            for (let i = -totalWidth; i < totalWidth + totalHeight; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + totalHeight, totalHeight);
                ctx.stroke();
            }
        } else if (configs.pattern === 'grid') {
            ctx.strokeStyle = patternColor;
            ctx.lineWidth = 0.5 * scale;
            for (let x = 0; x < totalWidth; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, totalHeight);
                ctx.stroke();
            }
            for (let y = 0; y < totalHeight; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(totalWidth, y);
                ctx.stroke();
            }
        } else if (configs.pattern === 'checkers') {
            ctx.fillStyle = patternColorStrong;
            // Spacing acts as the size of one checker square
            for (let x = 0; x < totalWidth; x += spacing * 2) {
                for (let y = 0; y < totalHeight; y += spacing * 2) {
                    ctx.fillRect(x, y, spacing, spacing);
                    ctx.fillRect(x + spacing, y + spacing, spacing, spacing);
                }
            }
        }

        ctx.restore();
    };
    drawPattern();

    // 3. Draw Content
    let currentY = border;

    // Draw Top Text Space
    if (configs.text.position === 'top') {
        if (configs.text.content) {
            const textY = border + fontSize;
            ctx.font = `600 ${fontSize}px ${configs.text.fontFamily || 'Inter, sans-serif'}`;
            ctx.fillStyle = configs.text.color;
            ctx.textAlign = 'center';
            ctx.fillText(configs.text.content, totalWidth / 2, textY);
        }
        currentY += textHeight;
    }

    // Draw Images
    for (let i = 0; i < numImgs; i++) {
        const imgElement = await createImage(images[i].url);
        const x = border;
        const y = currentY + i * (cellHeight + gridGap);
        ctx.drawImage(imgElement, x, y, cellWidth, cellHeight);
    }

    // Draw Bottom Text Space
    if (configs.text.position === 'bottom') {
        if (configs.text.content) {
            const textY = totalHeight - border - (fontSize * 0.2);
            ctx.font = `600 ${fontSize}px ${configs.text.fontFamily || 'Inter, sans-serif'}`;
            ctx.fillStyle = configs.text.color;
            ctx.textAlign = 'center';
            ctx.fillText(configs.text.content, totalWidth / 2, textY);
        }
    }

    return canvas;
};

export const downloadImage = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
};

export const downloadPDF = (canvas: HTMLCanvasElement, filename: string) => {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
};
