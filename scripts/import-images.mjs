/**
 * Konversi foto mentah ke WebP + JPG untuk dipakai di situs.
 *
 *   node scripts/import-images.mjs --src images/raw/foto.jpg --name damkar-pemadaman
 *
 * Output:
 *   public/images/<name>.webp  -> <img> di halaman (maks 1600px, kualitas 82)
 *   public/images/<name>.jpg   -> og:image / twitter:image (maks 1200px, kualitas 80)
 *
 * Tambah --delete setelah yakin file hasil tidak perlu diulang (sumber dihapus).
 */
import sharp from 'sharp';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? undefined : args[i + 1];
};

const src = get('--src');
const name = get('--name');
if (!src || !name) {
  console.error('Pakai: node scripts/import-images.mjs --src <file> --name <output-name> [--delete]');
  process.exit(1);
}

const abs = path.resolve(src);
const outWebp = path.resolve(`public/images/${name}.webp`);
const outJpg = path.resolve(`public/images/${name}.jpg`);

await sharp(abs).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 75 }).toFile(outWebp);
await sharp(abs).rotate().resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(outJpg);

console.log(`OK  ${outWebp}`);
console.log(`OK  ${outJpg}`);

if (args.includes('--delete')) {
  await rm(abs, { force: true });
  console.log(`DEL ${abs}`);
}