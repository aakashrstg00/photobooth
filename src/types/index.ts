export type Step = 'UPLOAD' | 'CROP' | 'DESIGN' | 'EXPORT';

export interface RawImage {
  id: string;
  url: string;
  name: string;
  type: string;
}

export interface CroppedImage {
  id: string;
  url: string;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type LayoutType = 'SIDE_BY_SIDE' | 'VERTICAL' | 'GRID' | 'STACKED';

export interface DesignConfigs {
  borderThickness: number;
  backgroundColor: string;
  pattern: 'none' | 'dots' | 'lines' | 'grid' | 'checkers';
  patternScale: number; // For controlling spacing/size of patterns
  text: {
    content: string;
    fontSize: number;
    color: string;
    position: 'top' | 'bottom';
    fontFamily: string;
  };
  theme?: 'wedding' | 'birthday' | 'corporate' | 'modern';
}
