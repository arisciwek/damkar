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

export type BlockConfig =
  | {
      type: 'reasons';
      title: string;
      lede?: string;
      intro?: string;
      items?: ReasonItem[];
    }
  | { type: 'benefits'; title?: string }
  | { type: 'faq'; title?: string; lede?: string }
  | { type: 'program-grid' }
  | { type: 'gallery' }
  | { type: 'class-tabs' }
  | { type: 'nearest-schedule'; kelas?: 'D' | 'C' | 'B' | 'A'; limit?: number }
  | { type: 'schedule-list'; kelas?: 'D' | 'C' | 'B' | 'A'; bulan?: string; chips?: boolean };

/** Bentuk minimal agar renderer dapat memeriksa konfigurasi sebelum render. */
export type BlockType = BlockConfig['type'];
