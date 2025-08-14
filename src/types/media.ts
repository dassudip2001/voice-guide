export interface Artifact {
  id: string;
  title: string;
  accessionNumber: string;
  category: string;
  thumbnail?: File | string;
  description: string;
  mediaFiles: MediaFile[];
  createdAt: Date;
  qrCode?: string;
}

export interface MediaFile {
  id: string;
  type: 'text' | 'audio' | 'video' | 'image';
  content: string | File;
  caption?: string;
}

export const CATEGORIES = [
  'Archaeological',
  'Art & Sculpture',
  'Historical Documents',
  'Textiles & Clothing',
  'Scientific Instruments',
  'Natural History',
  'Cultural Heritage',
  'Manuscripts',
  'Photographs',
  'Decorative Arts',
  'Other'
];