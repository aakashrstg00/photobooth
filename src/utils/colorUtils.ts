export const getContrastPatternColor = (hexColor: string): string => {
    // Remove hash if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (perceived brightness)
    // Using standard formula: 0.299R + 0.587G + 0.114B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // If background is light (> 0.5), use dark pattern. Else use light pattern.
    return luminance > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
};

export const getContrastPatternColorStrong = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
};
