/**
 * Pembentuk URL schedule kanonis.
 *
 * Bulan ditentukan dari bagian tanggal lokal ISO pada startDate (sebelum
 * offset timezone), bukan dari waktu build atau pubDate/updatedDate.
 */

export interface ScheduleRouteIdentity {
  slug: string;
  startDate: string;
}

/** Mengambil YYYY-MM dari tanggal ISO date-only atau datetime ber-offset. */
export function scheduleMonth(startDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(startDate);
  if (!match) {
    throw new Error(`startDate bukan tanggal ISO yang valid: ${startDate}`);
  }

  const [, year, month, day] = match;
  const monthNumber = Number(month);
  const date = new Date(Date.UTC(Number(year), monthNumber - 1, Number(day)));

  if (
    monthNumber < 1 ||
    monthNumber > 12 ||
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== monthNumber - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`startDate bukan tanggal kalender yang valid: ${startDate}`);
  }

  return `${year}-${month}`;
}

/** URL arsip bulanan. */
export function scheduleArchivePath(month: string): string {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error(`Bulan schedule harus berformat YYYY-MM: ${month}`);
  }
  return `/jadwal/${month}/`;
}

/** URL detail relatif kanonis untuk satu schedule. */
export function scheduleDetailPath(schedule: ScheduleRouteIdentity): string {
  if (!schedule.slug || schedule.slug.includes('/') || schedule.slug === '.' || schedule.slug === '..') {
    throw new Error(`Slug schedule tidak valid: ${schedule.slug}`);
  }
  return `${scheduleArchivePath(scheduleMonth(schedule.startDate))}${encodeURIComponent(schedule.slug)}/`;
}

/** URL absolut bila base URL situs tersedia. */
export function scheduleDetailUrl(schedule: ScheduleRouteIdentity, siteUrl: string): string {
  return new URL(scheduleDetailPath(schedule), siteUrl).toString();
}
