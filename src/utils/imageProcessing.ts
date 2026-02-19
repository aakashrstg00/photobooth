import heic2any from 'heic2any';

export const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string));
        reader.addEventListener('error', (error) => reject(error));
        reader.readAsDataURL(file);
    });
};

export const processImage = async (file: File): Promise<string> => {
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const blob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8,
        });
        const result = Array.isArray(blob) ? blob[0] : blob;
        return readFile(new File([result], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' }));
    }
    return readFile(file);
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return '';
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.95);
};
