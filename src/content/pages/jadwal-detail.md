---
type: page
pubDate: 2026-11-13T09:01:00Z
updatedDate: 2026-11-13T09:16:00Z
slug: jadwal-detail
title: Template Halaman Jadwal Pelatihan
description: Konfigurasi block untuk halaman jadwal berdasarkan kelas dan bulan.
draft: false
blocks:
  - type: hero
    eyebrow: Jadwal & Pendaftaran
    heading: Jadwal Pelatihan Damkar
    highlight: "{{periode}}."
    lead: "Pilih gelombang pelatihan yang sesuai, lalu daftar langsung melalui WhatsApp."
    breadcrumb:
      - label: Beranda
        href: /
      - label: Jadwal
        href: /jadwal/
    facts:
      - value: "0"
        label: Gelombang
      - value: "0"
        label: Aktif & mendatang
      - value: "0"
        label: Jenjang kelas
    actions:
      - label: Daftar Sekarang
        href: /
        className: btn btn-black btn-lg
        target: _blank
        rel: noopener
      - label: Semua Jadwal
        href: /jadwal/
        className: btn btn-outline btn-lg
    media:
      type: photo
      photo:
        src: /images/damkar-pemadaman-tradisional.webp
        w: 1200
        h: 1600
        alt: Peserta Pelatihan Damkar Kemnaker RI saat praktik pemadaman api

  - type: content-container
    blocks:
      - type: schedule-list
        id: jadwal
        title: Gelombang Pelatihan
        lede: Pilih jadwal yang sesuai, lalu daftar melalui WhatsApp.

  - type: contact-band
---
