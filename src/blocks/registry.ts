import BenefitsBlock from '../components/content/BenefitsBlock.astro';
import DetailTabs from '../components/content/DetailTabs.astro';
import FaqBlock from '../components/content/FaqBlock.astro';
import GalleryBlock from '../components/content/GalleryBlock.astro';
import Nearest from '../components/content/Nearest.astro';
import ProgramGrid from '../components/content/ProgramGrid.astro';
import ReasonsBlock from '../components/content/ReasonsBlock.astro';
import ContactBandBlock from './ContactBandBlock.astro';
import HeroBlock from './HeroBlock.astro';
import ScheduleListBlock from './ScheduleListBlock.astro';
import type { BlockType } from './types';

/**
 * Registry block yang sudah memiliki komponen produksi.
 *
 * Komponen yang dipakai halaman .astro lama tetap menjadi sumber markup dan interaksi.
 * Registry ini hanya menjadi adapter untuk renderer; tidak mengubah pemakaian lama.
 */
export const blockRegistry = {
  hero: HeroBlock,
  reasons: ReasonsBlock,
  benefits: BenefitsBlock,
  faq: FaqBlock,
  'program-grid': ProgramGrid,
  gallery: GalleryBlock,
  'class-tabs': DetailTabs,
  'nearest-schedule': Nearest,
  'schedule-list': ScheduleListBlock,
  'contact-band': ContactBandBlock,
} satisfies Record<BlockType, unknown>;
