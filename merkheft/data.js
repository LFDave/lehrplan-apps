// data.js — Merkheft-Inhalte. Ein Merkblatt pro Konzept: kurze,
// eigene Erklärtexte (keine Originaltexte aus Lehrmitteln), eine
// Illustration oder ein interaktives Bild aus illustrations.js,
// kleine Fakten und die Verbindungen zu den Übungs-Apps und den
// offiziellen Lehrplan-21-Codes (Ausgabe Kanton Bern, Stand
// 01.08.2022).

export const PAGES = [
  {
    id: 'wasserkreislauf',
    title: 'Der Wasserkreislauf',
    gruppe: 'Natur und Technik',
    intro: [
      'Die Sonne erwärmt das Wasser in Seen, Flüssen und im Meer. Ein Teil davon verdunstet: Es steigt als unsichtbarer Wasserdampf in die Luft.',
      'Oben ist die Luft kälter. Der Wasserdampf wird wieder zu winzigen Tröpfchen, die sich zu Wolken sammeln. Das nennt man Kondensieren.',
      'Werden die Tropfen zu schwer, fallen sie als Regen, Schnee oder Hagel zu Boden. Das Wasser sammelt sich in Bächen und Flüssen und fliesst zurück in Seen und Meere. Dann beginnt der Kreislauf von vorne.',
    ],
    fakten: [
      ['Verdunsten', 'Wasser wird zu unsichtbarem Dampf'],
      ['Kondensieren', 'Dampf wird zu Tröpfchen, Wolken entstehen'],
      ['Niederschlag', 'Regen, Schnee oder Hagel fallen zu Boden'],
    ],
    ueben: [{ name: 'Wetterwarte', href: '../wetterwarte/', stufe: '1g' }],
    codes: ['NMG.4.4.1g'],
  },
  {
    id: 'mondphasen',
    title: 'Die Mondphasen',
    gruppe: 'Himmel und Weltall',
    intro: [
      'Der Mond leuchtet nicht selbst: Die Sonne strahlt ihn an. Hell sehen wir nur die Seite, die gerade von der Sonne beleuchtet wird.',
      'Während der Mond die Erde umrundet, schauen wir mal auf die helle, mal auf die dunkle Seite. Bei Neumond ist die beleuchtete Seite von uns abgewandt: Wir sehen den Mond nicht. Danach nimmt er zu, bis wir bei Vollmond die ganze helle Seite sehen. Dann nimmt er wieder ab.',
      'Von Vollmond zu Vollmond dauert es ungefähr einen Monat, genauer rund 29,5 Tage.',
    ],
    fakten: [
      ['Neumond', 'Der Mond ist nicht zu sehen'],
      ['Vollmond', 'Die ganze helle Seite zeigt zu uns'],
      ['Ein Umlauf', 'ungefähr ein Monat (rund 29,5 Tage)'],
    ],
    ueben: [{ name: 'Sternwarte', href: '../sternwarte/', stufe: 'd' }],
    codes: ['NMG.4.5.d'],
  },
  {
    id: 'schaltungen',
    title: 'Serie- und Parallelschaltung',
    gruppe: 'Natur und Technik',
    intro: [
      'Strom fliesst nur, wenn der Kreis geschlossen ist: von der Stromquelle durch die Leitungen und wieder zurück. Ein offener Schalter unterbricht den Kreis.',
      'In der Serieschaltung fliesst der Strom durch alle Lampen nacheinander. Fällt eine Lampe aus, ist der Kreis unterbrochen und alle sind dunkel.',
      'In der Parallelschaltung hat jede Lampe ihren eigenen Zweig. Fällt eine aus, leuchten die anderen weiter. Zu Hause sind die Lampen darum parallel geschaltet.',
      'Probiere es aus:',
    ],
    fakten: [
      ['Serie', 'Eine defekte Lampe unterbricht alles'],
      ['Parallel', 'Jede Lampe hat ihren eigenen Zweig'],
      ['Zu Hause', 'Lampen sind parallel geschaltet'],
    ],
    ueben: [{ name: 'Stromkreis', href: '../stromkreis/', stufe: 'b' }],
    codes: ['NT.5.2.b'],
  },
  {
    id: 'gradnetz',
    title: 'Das Gradnetz der Erde',
    gruppe: 'Raum und Erde',
    intro: [
      'Damit man jeden Ort der Erde genau angeben kann, legt man ein Netz aus gedachten Linien über den Globus.',
      'Die Breitengrade verlaufen parallel zum Äquator. Der Äquator selbst teilt die Erde in Nord- und Südhalbkugel.',
      'Die Längengrade, auch Meridiane genannt, verlaufen von Pol zu Pol. Der Nullmeridian läuft durch Greenwich bei London.',
      'Drehe den Globus:',
    ],
    fakten: [
      ['Äquator', 'teilt die Erde in Nord- und Südhalbkugel'],
      ['Breitengrade', 'verlaufen parallel zum Äquator'],
      ['Längengrade', 'verlaufen von Pol zu Pol'],
    ],
    ueben: [{ name: 'Weltatlas', href: '../weltatlas/', stufe: 'c' }],
    codes: ['RZG.4.1.c'],
  },
  {
    id: 'sonnensystem',
    title: 'Das Sonnensystem',
    gruppe: 'Himmel und Weltall',
    intro: [
      'Im Zentrum unseres Sonnensystems steht die Sonne. Sie ist ein Stern und gibt Licht und Wärme.',
      'Acht Planeten kreisen um die Sonne, von innen nach aussen: Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus und Neptun.',
      'Je weiter aussen ein Planet kreist, desto länger braucht er für eine Runde: Merkur nur rund 88 Tage, die Erde ein Jahr, der ferne Neptun etwa 165 Jahre.',
      'Starte das Modell:',
    ],
    fakten: [
      ['Die Sonne', 'ist ein Stern im Zentrum'],
      ['Acht Planeten', 'kreisen um die Sonne'],
      ['Weiter aussen', 'heisst langsamer unterwegs'],
    ],
    ueben: [{ name: 'Sternwarte', href: '../sternwarte/', stufe: 'e' }],
    codes: ['NMG.4.5.e'],
  },
];

export function pageById(id) {
  return PAGES.find((p) => p.id === id) || null;
}

export const GRUPPEN = [...new Set(PAGES.map((p) => p.gruppe))];
