/**
 * Kontrak konfigurasi block untuk halaman berbasis Markdown.
 *
 * Kontrak ini hanya mendeskripsikan block yang sudah punya adapter/komponen nyata.
 * Jangan menambahkan tipe sebelum implementasi dan parity check tersedia.
 */
export interface BlockImage {
  src: string;
  w: number;
  h: number;
  alt: string;
}

export interface ReasonItem {
  title: string;
  text: string;
  image?: BlockImage;
}

export interface BenefitItem {
  title: string;
  text: string;
  icon: import('../utils/icons').IconName;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GalleryItem extends BlockImage {
  cap: string;
}

export type BlockConfig =
  | {
      type: 'reasons';
      title: string;
      lede?: string;
      intro?: string;
      items?: ReasonItem[];
    }
  | { type: 'benefits'; title?: string; lede?: string; items?: BenefitItem[] }
  | { type: 'faq'; title?: string; lede?: string; items?: FaqItem[] }
  | { type: 'gallery'; title?: string; lede?: string; items?: GalleryItem[] }
  | { type: 'program-grid'; title?: string; lede?: string }
  | { type: 'class-tabs'; title?: string; lede?: string }
  | { type: 'nearest-schedule'; kelas?: 'D' | 'C' | 'B' | 'A'; limit?: number }
  | {
      type: 'schedule-list';
      id?: string;
      title: string;
      lede?: string;
      kelas?: 'D' | 'C' | 'B' | 'A';
      bulan?: string;
      chips?: boolean;
    };

export type BlockType = BlockConfig['type'];
