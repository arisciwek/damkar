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

export interface ClassDetailBlockConfig {
  type: 'class-detail';
  name: string;
  role: string;
  description: string;
  mode: string;
  modeNote: string;
  step: number;
  materi: readonly string[];
  requirement: string;
  location: string;
  photos: readonly [BlockImage, BlockImage, BlockImage];
}

export interface OtherProgramItem {
  key: string;
  step: number;
  name: string;
  role: string;
  href: string;
}

export interface SidebarLink {
  id: string;
  label: string;
  icon: import('../utils/icons').IconName;
}

export interface HeroCrumb {
  label: string;
  href?: string;
}

export interface HeroFact {
  value: string;
  label: string;
}

export interface HeroAction {
  label: string;
  href: string;
  className: string;
  target?: string;
  rel?: string;
}

export type HeroMedia =
  | { type: 'slider' }
  | { type: 'photo'; photo: BlockImage; letter?: string };

export interface HeroBlockConfig {
  type: 'hero';
  eyebrow: string;
  heading: string;
  highlight?: string;
  lead: string;
  breadcrumb?: HeroCrumb[];
  nearest?: { kelas?: 'D' | 'C' | 'B' | 'A'; limit?: number };
  facts: HeroFact[];
  actions: HeroAction[];
  media: HeroMedia;
}

export type BlockConfig =
  | HeroBlockConfig
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
    }
  | { type: 'contact-band'; id?: string; heading?: string; kicker?: string }
  | ClassDetailBlockConfig
  | { type: 'other-programs'; title?: string; lede?: string; items: readonly OtherProgramItem[] };

export type BlockType = BlockConfig['type'];


/**
 * Struktur layout halaman. Ini bukan block konten yang dapat dipindah bebas:
 * wrapper harus mengikuti DOM halaman asal agar grid dan sidebar tetap identik.
 */
export interface ContentLayoutBlock {
  type: 'content-layout';
  ctaMsg: string;
  links: SidebarLink[];
  blocks: BlockConfig[];
}

export interface ContentContainerBlock {
  type: 'content-container';
  blocks: BlockConfig[];
}

export type PageBlockConfig = BlockConfig | ContentLayoutBlock | ContentContainerBlock;
