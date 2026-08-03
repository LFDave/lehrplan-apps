// data.js — Lehrplan-Kompass Inhaltsdaten.
//
// Struktur, Codes und Bereichstitel folgen dem Lehrplan 21, Ausgabe Kanton
// Bern (be.lehrplan.ch, Gesamtausgabe PDF). Die Kompetenztexte sind eigene,
// kindgerechte Umschreibungen der offiziellen Kompetenzbeschreibungen,
// keine Originaltexte. Massgebend bleibt der offizielle Lehrplan.
//
// Jede Kompetenz: { code, text }. Der Code ist der offizielle
// Lehrplan-21-Code und zugleich die stabile ID für die Speicherung.
// v1 ist einsprachig Deutsch; weitere Sprachen kämen als eigene Textfelder
// pro Eintrag dazu, nie als Ersatz.

export const CYCLES = [1, 2, 3];

export const SUBJECTS = [
  {
    id: 'D',
    name: 'Deutsch',
    icon: 'book-open',
    cycles: [1, 2, 3],
    areas: [
      { id: 'D.1', title: 'Hören', competencies: [
        { code: 'D.1.A.1', text: 'Ich höre genau hin und erkenne Laute, Silben, Stimmen und Geräusche.' },
        { code: 'D.1.B.1', text: 'Ich verstehe das Wichtigste, wenn ich etwas höre, zum Beispiel eine Geschichte.' },
        { code: 'D.1.C.1', text: 'Ich kann in einem Gespräch gut zuhören und zeige, dass ich dabei bin.' },
        { code: 'D.1.D.1', text: 'Ich denke darüber nach, was und wie ich gerne höre.' },
      ]},
      { id: 'D.2', title: 'Lesen', competencies: [
        { code: 'D.2.A.1', text: 'Ich kann flüssig lesen und verstehe Wörter schnell.' },
        { code: 'D.2.B.1', text: 'Ich finde die wichtigsten Informationen in einem Sachtext.' },
        { code: 'D.2.C.1', text: 'Ich kann Geschichten und Gedichte lesen und verstehen.' },
        { code: 'D.2.D.1', text: 'Ich denke darüber nach, was und wie ich gerne lese.' },
      ]},
      { id: 'D.3', title: 'Sprechen', competencies: [
        { code: 'D.3.A.1', text: 'Ich spreche deutlich und flüssig.' },
        { code: 'D.3.B.1', text: 'Ich kann etwas verständlich erzählen oder vortragen.' },
        { code: 'D.3.C.1', text: 'Ich rede in Gesprächen mit und gehe auf andere ein.' },
        { code: 'D.3.D.1', text: 'Ich denke darüber nach, wie ich spreche, erzähle und Gespräche führe.' },
      ]},
      { id: 'D.4', title: 'Schreiben', competencies: [
        { code: 'D.4.A.1', text: 'Ich schreibe leserlich von Hand und kann mit der Tastatur schreiben.' },
        { code: 'D.4.B.1', text: 'Ich kenne verschiedene Textsorten und nutze sie für eigene Texte.' },
        { code: 'D.4.C.1', text: 'Ich finde Ideen für Texte und plane, was ich schreiben will.' },
        { code: 'D.4.D.1', text: 'Ich bringe meine Gedanken beim Schreiben in eine gute Reihenfolge.' },
        { code: 'D.4.E.1', text: 'Ich überarbeite meine Texte, damit sie besser werden.' },
      ]},
      { id: 'D.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'D.5.A.1', text: 'Ich erforsche Sprache und vergleiche verschiedene Sprachen.' },
        { code: 'D.5.B.1', text: 'Ich untersuche, wie Sprache gebraucht wird und was sie bewirkt.' },
        { code: 'D.5.C.1', text: 'Ich untersuche, wie Wörter und Sätze aufgebaut sind.' },
        { code: 'D.5.D.1', text: 'Ich kenne Grammatikbegriffe wie Nomen und Verb und wende sie an.' },
        { code: 'D.5.E.1', text: 'Ich kenne Rechtschreiberegeln und wende sie in Übungen an.' },
      ]},
      { id: 'D.6', title: 'Literatur im Fokus', competencies: [
        { code: 'D.6.A.1', text: 'Ich gehe spielerisch und kreativ mit Geschichten und Gedichten um.' },
        { code: 'D.6.A.2', text: 'Ich rede mit anderen darüber, wie ich einen Text verstehe und wie er auf mich wirkt.' },
        { code: 'D.6.B.1', text: 'Ich kenne einige Autorinnen und Autoren und lese Texte aus verschiedenen Kulturen.' },
        { code: 'D.6.C.1', text: 'Ich erkenne, wie Geschichten und Gedichte gemacht sind, und kenne Merkmale von Textarten.' },
      ]},
    ],
  },
  {
    id: 'FS1F',
    name: 'Französisch',
    icon: 'message-circle',
    cycles: [2, 3],
    areas: [
      { id: 'FS1F.1', title: 'Hören', competencies: [
        { code: 'FS1F.1.A.1', text: 'Ich verstehe Gespräche und Hörtexte auf Französisch.' },
        { code: 'FS1F.1.A.2', text: 'Ich entdecke, was mir an französischen Liedern, Versen und Geschichten gefällt.' },
        { code: 'FS1F.1.B.1', text: 'Ich nutze Tricks, um beim Zuhören mehr zu verstehen.' },
        { code: 'FS1F.1.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Französisch gehört habe.' },
      ]},
      { id: 'FS1F.2', title: 'Lesen', competencies: [
        { code: 'FS1F.2.A.1', text: 'Ich kann französische Texte lesen und verstehen.' },
        { code: 'FS1F.2.A.2', text: 'Ich entdecke, was mir an französischen Texten gefällt.' },
        { code: 'FS1F.2.B.1', text: 'Ich nutze Tricks, um beim Lesen mehr zu verstehen.' },
        { code: 'FS1F.2.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Französisch gelesen habe.' },
      ]},
      { id: 'FS1F.3', title: 'Sprechen', competencies: [
        { code: 'FS1F.3.A.1', text: 'Ich kann bei Gesprächen auf Französisch mitreden.' },
        { code: 'FS1F.3.B.1', text: 'Ich kann auf Französisch etwas erzählen oder berichten.' },
        { code: 'FS1F.3.B.2', text: 'Ich kann französische Texte lebendig vortragen.' },
        { code: 'FS1F.3.C.1', text: 'Ich nutze Tricks, damit das Sprechen auf Französisch besser klappt.' },
        { code: 'FS1F.3.D.1', text: 'Ich kann etwas Deutsches sinngemäss auf Französisch weitergeben.' },
      ]},
      { id: 'FS1F.4', title: 'Schreiben', competencies: [
        { code: 'FS1F.4.A.1', text: 'Ich kann kurze Texte auf Französisch schreiben.' },
        { code: 'FS1F.4.A.2', text: 'Ich gestalte eigene französische Texte kreativ.' },
        { code: 'FS1F.4.B.1', text: 'Ich nutze Hilfen und Tricks beim Schreiben auf Französisch.' },
        { code: 'FS1F.4.C.1', text: 'Ich kann etwas Deutsches sinngemäss auf Französisch aufschreiben.' },
      ]},
      { id: 'FS1F.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS1F.5.A.1', text: 'Ich achte darauf, welche Sprachen um mich herum gesprochen werden.' },
        { code: 'FS1F.5.A.2', text: 'Ich achte darauf, wie die französische Sprache funktioniert.' },
        { code: 'FS1F.5.B.1', text: 'Ich kenne genug französische Wörter, um mich auszudrücken.' },
        { code: 'FS1F.5.B.2', text: 'Ich kenne Tricks, um neue Wörter zu lernen und zu behalten.' },
        { code: 'FS1F.5.C.1', text: 'Ich spreche Französisch klar und verständlich aus.' },
        { code: 'FS1F.5.C.2', text: 'Ich kenne typische Regeln der französischen Aussprache.' },
        { code: 'FS1F.5.D.1', text: 'Ich erkenne französische Grammatik in Texten und wende sie an.' },
        { code: 'FS1F.5.D.2', text: 'Ich verstehe französische Grammatik und vergleiche sie mit anderen Sprachen.' },
        { code: 'FS1F.5.E.1', text: 'Ich schreibe Französisch ziemlich korrekt.' },
        { code: 'FS1F.5.E.2', text: 'Ich verstehe wichtige Rechtschreiberegeln des Französischen.' },
      ]},
      { id: 'FS1F.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS1F.6.A.1', text: 'Ich kenne Besonderheiten der französischsprachigen Welt.' },
        { code: 'FS1F.6.B.1', text: 'Ich denke darüber nach, wie ich die französischsprachige Welt und andere Kulturen sehe.' },
        { code: 'FS1F.6.C.1', text: 'Ich begegne Menschen und Dingen aus der französischsprachigen Welt.' },
      ]},
    ],
  },
  {
    id: 'FS2E',
    name: 'Englisch',
    icon: 'globe',
    cycles: [2, 3],
    areas: [
      { id: 'FS2E.1', title: 'Hören', competencies: [
        { code: 'FS2E.1.A.1', text: 'Ich verstehe Gespräche und Hörtexte auf Englisch.' },
        { code: 'FS2E.1.A.2', text: 'Ich entdecke, was mir an englischen Liedern, Versen und Geschichten gefällt.' },
        { code: 'FS2E.1.B.1', text: 'Ich nutze Tricks, um beim Zuhören mehr zu verstehen.' },
        { code: 'FS2E.1.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Englisch gehört habe.' },
      ]},
      { id: 'FS2E.2', title: 'Lesen', competencies: [
        { code: 'FS2E.2.A.1', text: 'Ich kann englische Texte lesen und verstehen.' },
        { code: 'FS2E.2.A.2', text: 'Ich entdecke, was mir an englischen Texten gefällt.' },
        { code: 'FS2E.2.B.1', text: 'Ich nutze Tricks, um beim Lesen mehr zu verstehen.' },
        { code: 'FS2E.2.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Englisch gelesen habe.' },
      ]},
      { id: 'FS2E.3', title: 'Sprechen', competencies: [
        { code: 'FS2E.3.A.1', text: 'Ich kann bei Gesprächen auf Englisch mitreden.' },
        { code: 'FS2E.3.B.1', text: 'Ich kann auf Englisch etwas erzählen oder berichten.' },
        { code: 'FS2E.3.B.2', text: 'Ich kann englische Texte lebendig vortragen.' },
        { code: 'FS2E.3.C.1', text: 'Ich nutze Tricks, damit das Sprechen auf Englisch besser klappt.' },
        { code: 'FS2E.3.D.1', text: 'Ich kann etwas Deutsches sinngemäss auf Englisch weitergeben.' },
      ]},
      { id: 'FS2E.4', title: 'Schreiben', competencies: [
        { code: 'FS2E.4.A.1', text: 'Ich kann kurze Texte auf Englisch schreiben.' },
        { code: 'FS2E.4.A.2', text: 'Ich gestalte eigene englische Texte kreativ.' },
        { code: 'FS2E.4.B.1', text: 'Ich nutze Hilfen und Tricks beim Schreiben auf Englisch.' },
        { code: 'FS2E.4.C.1', text: 'Ich kann etwas Deutsches sinngemäss auf Englisch aufschreiben.' },
      ]},
      { id: 'FS2E.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS2E.5.A.1', text: 'Ich achte darauf, welche Sprachen um mich herum gesprochen werden.' },
        { code: 'FS2E.5.A.2', text: 'Ich achte darauf, wie die englische Sprache funktioniert.' },
        { code: 'FS2E.5.B.1', text: 'Ich kenne genug englische Wörter, um mich auszudrücken.' },
        { code: 'FS2E.5.B.2', text: 'Ich kenne Tricks, um neue Wörter zu lernen und zu behalten.' },
        { code: 'FS2E.5.C.1', text: 'Ich spreche Englisch klar und verständlich aus.' },
        { code: 'FS2E.5.C.2', text: 'Ich kenne typische Regeln der englischen Aussprache.' },
        { code: 'FS2E.5.D.1', text: 'Ich erkenne englische Grammatik in Texten und wende sie an.' },
        { code: 'FS2E.5.D.2', text: 'Ich verstehe englische Grammatik und vergleiche sie mit anderen Sprachen.' },
        { code: 'FS2E.5.E.1', text: 'Ich schreibe Englisch ziemlich korrekt.' },
        { code: 'FS2E.5.E.2', text: 'Ich verstehe wichtige Rechtschreiberegeln des Englischen.' },
      ]},
      { id: 'FS2E.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS2E.6.A.1', text: 'Ich kenne Besonderheiten der englischsprachigen Welt.' },
        { code: 'FS2E.6.B.1', text: 'Ich denke darüber nach, wie ich die englischsprachige Welt und andere Kulturen sehe.' },
        { code: 'FS2E.6.C.1', text: 'Ich begegne Menschen und Dingen aus der englischsprachigen Welt.' },
      ]},
    ],
  },
  {
    id: 'FS3I',
    name: 'Italienisch',
    tag: 'Freifach',
    icon: 'message-square',
    cycles: [3],
    areas: [
      { id: 'FS3I.1', title: 'Hören', competencies: [
        { code: 'FS3I.1.A.1', text: 'Ich verstehe Gespräche und Hörtexte auf Italienisch.' },
        { code: 'FS3I.1.A.2', text: 'Ich entdecke, was mir an italienischen Liedern, Versen und Geschichten gefällt.' },
        { code: 'FS3I.1.B.1', text: 'Ich nutze Tricks, um beim Zuhören mehr zu verstehen.' },
        { code: 'FS3I.1.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Italienisch gehört habe.' },
      ]},
      { id: 'FS3I.2', title: 'Lesen', competencies: [
        { code: 'FS3I.2.A.1', text: 'Ich kann italienische Texte lesen und verstehen.' },
        { code: 'FS3I.2.A.2', text: 'Ich entdecke, was mir an italienischen Texten gefällt.' },
        { code: 'FS3I.2.B.1', text: 'Ich nutze Tricks, um beim Lesen mehr zu verstehen.' },
        { code: 'FS3I.2.C.1', text: 'Ich kann auf Deutsch erklären, was ich auf Italienisch gelesen habe.' },
      ]},
      { id: 'FS3I.3', title: 'Sprechen', competencies: [
        { code: 'FS3I.3.A.1', text: 'Ich kann bei Gesprächen auf Italienisch mitreden.' },
        { code: 'FS3I.3.B.1', text: 'Ich kann auf Italienisch etwas erzählen oder berichten.' },
        { code: 'FS3I.3.B.2', text: 'Ich kann italienische Texte lebendig vortragen.' },
        { code: 'FS3I.3.C.1', text: 'Ich nutze Tricks, damit das Sprechen auf Italienisch besser klappt.' },
        { code: 'FS3I.3.D.1', text: 'Ich kann etwas Deutsches sinngemäss auf Italienisch weitergeben.' },
      ]},
      { id: 'FS3I.4', title: 'Schreiben', competencies: [
        { code: 'FS3I.4.A.1', text: 'Ich kann kurze Texte auf Italienisch schreiben.' },
        { code: 'FS3I.4.A.2', text: 'Ich gestalte eigene italienische Texte kreativ.' },
        { code: 'FS3I.4.B.1', text: 'Ich nutze Hilfen und Tricks beim Schreiben auf Italienisch.' },
        { code: 'FS3I.4.C.1', text: 'Ich kann etwas Deutsches sinngemäss auf Italienisch aufschreiben.' },
      ]},
      { id: 'FS3I.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS3I.5.A.1', text: 'Ich achte darauf, wie die italienische Sprache funktioniert.' },
        { code: 'FS3I.5.B.1', text: 'Ich kenne genug italienische Wörter, um mich auszudrücken.' },
        { code: 'FS3I.5.B.2', text: 'Ich kenne Tricks, um neue Wörter zu lernen und zu behalten.' },
        { code: 'FS3I.5.C.1', text: 'Ich spreche Italienisch klar und verständlich aus.' },
        { code: 'FS3I.5.C.2', text: 'Ich kenne typische Regeln der italienischen Aussprache.' },
        { code: 'FS3I.5.D.1', text: 'Ich erkenne italienische Grammatik in Texten und wende sie an.' },
        { code: 'FS3I.5.D.2', text: 'Ich verstehe italienische Grammatik und vergleiche sie mit anderen Sprachen.' },
        { code: 'FS3I.5.E.1', text: 'Ich schreibe Italienisch ziemlich korrekt.' },
        { code: 'FS3I.5.E.2', text: 'Ich verstehe wichtige Rechtschreiberegeln des Italienischen.' },
      ]},
      { id: 'FS3I.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS3I.6.A.1', text: 'Ich kenne Besonderheiten der italienischsprachigen Welt.' },
        { code: 'FS3I.6.B.1', text: 'Ich denke darüber nach, wie ich die italienischsprachige Welt und andere Kulturen sehe.' },
        { code: 'FS3I.6.C.1', text: 'Ich begegne Menschen und Dingen aus der italienischsprachigen Welt.' },
      ]},
    ],
  },
  {
    id: 'MA',
    name: 'Mathematik',
    icon: 'calculator',
    cycles: [1, 2, 3],
    areas: [
      { id: 'MA.1', title: 'Zahl und Variable', competencies: [
        { code: 'MA.1.A.1', text: 'Ich verstehe Rechenwörter und Zeichen wie plus und minus und kann Zahlen lesen und schreiben.' },
        { code: 'MA.1.A.2', text: 'Ich kann zählen, Zahlen der Grösse nach ordnen und Ergebnisse schätzen.' },
        { code: 'MA.1.A.3', text: 'Ich kann addieren, subtrahieren, multiplizieren und dividieren.' },
        { code: 'MA.1.A.4', text: 'Ich kann Terme umformen und Gleichungen lösen.' },
        { code: 'MA.1.B.1', text: 'Ich entdecke Muster in Zahlen und Rechnungen und tausche mich darüber aus.' },
        { code: 'MA.1.B.2', text: 'Ich überprüfe und begründe Aussagen über Zahlen.' },
        { code: 'MA.1.B.3', text: 'Ich nutze Hilfsmittel wie Rechner und Tabellen, um Zahlenmuster zu erforschen.' },
        { code: 'MA.1.C.1', text: 'Ich kann Rechenwege aufschreiben, erklären und nachvollziehen.' },
        { code: 'MA.1.C.2', text: 'Ich kann Anzahlen, Zahlenfolgen und Terme darstellen und beschreiben.' },
      ]},
      { id: 'MA.2', title: 'Form und Raum', competencies: [
        { code: 'MA.2.A.1', text: 'Ich verstehe Begriffe der Geometrie, zum Beispiel Dreieck, Winkel und parallel.' },
        { code: 'MA.2.A.2', text: 'Ich kann Figuren und Körper abbilden, zerlegen und zusammensetzen.' },
        { code: 'MA.2.A.3', text: 'Ich kann Längen, Flächen und Volumen bestimmen und berechnen.' },
        { code: 'MA.2.B.1', text: 'Ich erforsche Beziehungen zwischen Längen, Flächen und Volumen.' },
        { code: 'MA.2.B.2', text: 'Ich überprüfe und begründe Aussagen und Formeln der Geometrie.' },
        { code: 'MA.2.C.1', text: 'Ich kann Körper und räumliche Beziehungen darstellen.' },
        { code: 'MA.2.C.2', text: 'Ich kann Figuren falten, skizzieren, zeichnen und konstruieren.' },
        { code: 'MA.2.C.3', text: 'Ich kann mir Figuren und Körper im Kopf vorstellen und gedreht denken.' },
        { code: 'MA.2.C.4', text: 'Ich finde mich im Koordinatensystem zurecht und kann Pläne lesen und zeichnen.' },
      ]},
      { id: 'MA.3', title: 'Grössen, Funktionen, Daten und Zufall', competencies: [
        { code: 'MA.3.A.1', text: 'Ich verstehe Begriffe zu Grössen, Funktionen, Daten und Zufall.' },
        { code: 'MA.3.A.2', text: 'Ich kann Grössen wie Zeit, Geld und Länge schätzen, messen, umwandeln und damit rechnen.' },
        { code: 'MA.3.A.3', text: 'Ich kann Zusammenhänge beschreiben, zum Beispiel den Preis pro Stück, und Werte berechnen.' },
        { code: 'MA.3.B.1', text: 'Ich stelle Fragen zu Grössen und Zusammenhängen und erforsche sie.' },
        { code: 'MA.3.B.2', text: 'Ich erforsche Aufgaben zu Statistik, Kombinationen und Wahrscheinlichkeit.' },
        { code: 'MA.3.C.1', text: 'Ich kann Daten sammeln, ordnen, darstellen und auswerten.' },
        { code: 'MA.3.C.2', text: 'Ich kann Alltagssituationen in Mathematik übersetzen, berechnen und das Ergebnis prüfen.' },
        { code: 'MA.3.C.3', text: 'Ich kann mir zu Termen, Formeln und Tabellen passende Situationen vorstellen.' },
      ]},
    ],
  },
  {
    id: 'NMG',
    name: 'Natur, Mensch, Gesellschaft',
    icon: 'sprout',
    cycles: [1, 2],
    areas: [
      { id: 'NMG.1', title: 'Identität, Körper, Gesundheit', competencies: [
        { code: 'NMG.1.1', text: 'Ich kann beschreiben, was mich und andere ausmacht.' },
        { code: 'NMG.1.2', text: 'Ich weiss, was mir gut tut, und kann mich vor Gefahren schützen.' },
        { code: 'NMG.1.3', text: 'Ich verstehe, wie Essen und Wohlbefinden zusammenhängen.' },
        { code: 'NMG.1.4', text: 'Ich kenne den Aufbau des Körpers und weiss, was wichtige Organe tun.' },
        { code: 'NMG.1.5', text: 'Ich verstehe, wie der Körper wächst und sich entwickelt.' },
        { code: 'NMG.1.6', text: 'Ich denke darüber nach, was Geschlecht und Rollen bedeuten.' },
      ]},
      { id: 'NMG.2', title: 'Tiere, Pflanzen und Lebensräume', competencies: [
        { code: 'NMG.2.1', text: 'Ich erkunde Tiere und Pflanzen in ihren Lebensräumen.' },
        { code: 'NMG.2.2', text: 'Ich verstehe, warum Sonne, Luft, Wasser und Boden für Lebewesen wichtig sind.' },
        { code: 'NMG.2.3', text: 'Ich beobachte, wie Tiere und Pflanzen wachsen und sich fortpflanzen.' },
        { code: 'NMG.2.4', text: 'Ich erkenne die Vielfalt von Tieren und Pflanzen und kann sie ordnen.' },
        { code: 'NMG.2.5', text: 'Ich habe Vorstellungen davon, wie sich die Erde und das Leben entwickelt haben.' },
        { code: 'NMG.2.6', text: 'Ich denke darüber nach, wie der Mensch die Natur beeinflusst.' },
      ]},
      { id: 'NMG.3', title: 'Stoffe, Energie und Bewegungen', competencies: [
        { code: 'NMG.3.1', text: 'Ich beschreibe Erfahrungen mit Bewegungen und Kräften.' },
        { code: 'NMG.3.2', text: 'Ich erkenne, wo im Alltag Energie steckt und wie sie umgewandelt wird.' },
        { code: 'NMG.3.3', text: 'Ich untersuche Stoffe und ordne sie nach ihren Eigenschaften.' },
        { code: 'NMG.3.4', text: 'Ich kann Stoffe bearbeiten, verändern und nutzen.' },
      ]},
      { id: 'NMG.4', title: 'Phänomene der Natur', competencies: [
        { code: 'NMG.4.1', text: 'Ich erkenne, was unsere Sinne leisten.' },
        { code: 'NMG.4.2', text: 'Ich untersuche Töne und Geräusche.' },
        { code: 'NMG.4.3', text: 'Ich untersuche Licht, Schatten und Farben.' },
        { code: 'NMG.4.4', text: 'Ich beobachte das Wetter und kann Wetterphänomene erklären.' },
        { code: 'NMG.4.5', text: 'Ich beschreibe die Erde, die Sonne, den Mond und die Sterne.' },
      ]},
      { id: 'NMG.5', title: 'Technische Entwicklungen', competencies: [
        { code: 'NMG.5.1', text: 'Ich untersuche Alltagsgeräte und baue sie nach.' },
        { code: 'NMG.5.2', text: 'Ich untersuche Strom und Magnete und ihre Anwendungen.' },
        { code: 'NMG.5.3', text: 'Ich schätze ein, was technische Erfindungen für Mensch und Umwelt bedeuten.' },
      ]},
      { id: 'NMG.6', title: 'Arbeit, Produktion und Konsum', competencies: [
        { code: 'NMG.6.1', text: 'Ich erkunde verschiedene Arbeiten und Arbeitsplätze.' },
        { code: 'NMG.6.2', text: 'Ich erkunde Berufe und kann sie beschreiben.' },
        { code: 'NMG.6.3', text: 'Ich kann beschreiben, wie Güter hergestellt werden und zu uns kommen.' },
        { code: 'NMG.6.4', text: 'Ich verstehe einfache Regeln beim Kaufen, Tauschen und Verkaufen.' },
        { code: 'NMG.6.5', text: 'Ich denke über Wünsche, Bedürfnisse und Konsum nach.' },
      ]},
      { id: 'NMG.7', title: 'Lebensweisen und Lebensräume von Menschen', competencies: [
        { code: 'NMG.7.1', text: 'Ich beschreibe verschiedene Lebensweisen und was Herkunft bedeutet.' },
        { code: 'NMG.7.2', text: 'Ich vergleiche, wie Menschen in fernen Gebieten der Erde leben.' },
        { code: 'NMG.7.3', text: 'Ich erkunde, wie Menschen, Güter und Nachrichten unterwegs sind.' },
        { code: 'NMG.7.4', text: 'Ich verstehe, wie Lebensweise und Lebensraum zusammenhängen.' },
      ]},
      { id: 'NMG.8', title: 'Menschen nutzen Räume', competencies: [
        { code: 'NMG.8.1', text: 'Ich nehme wahr, wie meine Umgebung gebaut und gestaltet ist.' },
        { code: 'NMG.8.2', text: 'Ich vergleiche, wie Menschen Räume nutzen.' },
        { code: 'NMG.8.3', text: 'Ich erkenne, wie sich Orte verändern, und denke über die Zukunft nach.' },
        { code: 'NMG.8.4', text: 'Ich finde Orte auf Plänen und Karten und baue mir ein Bild der Welt auf.' },
        { code: 'NMG.8.5', text: 'Ich orientiere mich in meiner Umgebung und nutze Karten und Hilfsmittel.' },
      ]},
      { id: 'NMG.9', title: 'Zeit, Dauer und Wandel', competencies: [
        { code: 'NMG.9.1', text: 'Ich verstehe Zeitbegriffe und kann den Zeitstrahl nutzen.' },
        { code: 'NMG.9.2', text: 'Ich erkenne, was sich verändert und was bleibt, bei mir und um mich herum.' },
        { code: 'NMG.9.3', text: 'Ich verstehe, wie man herausfindet, was früher war.' },
        { code: 'NMG.9.4', text: 'Ich kann Geschichte und erfundene Geschichten unterscheiden.' },
      ]},
      { id: 'NMG.10', title: 'Gemeinschaft und Gesellschaft', competencies: [
        { code: 'NMG.10.1', text: 'Ich gehe auf andere ein und gestalte die Gemeinschaft mit.' },
        { code: 'NMG.10.2', text: 'Ich pflege Freundschaften und denke über Beziehungen nach.' },
        { code: 'NMG.10.3', text: 'Ich verstehe, wozu es Gemeinde, Polizei und andere Institutionen gibt.' },
        { code: 'NMG.10.4', text: 'Ich verstehe, wie Macht und Recht zusammenhängen, heute und früher.' },
        { code: 'NMG.10.5', text: 'Ich bringe meine Anliegen ein und erkenne, wie Entscheidungen entstehen.' },
      ]},
      { id: 'NMG.11', title: 'Grunderfahrungen, Werte und Normen', competencies: [
        { code: 'NMG.11.1', text: 'Ich denke über grosse Erfahrungen des Lebens nach, zum Beispiel Freude, Streit und Abschied.' },
        { code: 'NMG.11.2', text: 'Ich stelle philosophische Fragen und denke über sie nach.' },
        { code: 'NMG.11.3', text: 'Ich kann erklären, welche Werte und Regeln mir wichtig sind.' },
        { code: 'NMG.11.4', text: 'Ich beurteile Situationen und begründe meinen Standpunkt.' },
      ]},
      { id: 'NMG.12', title: 'Religionen und Weltsichten', competencies: [
        { code: 'NMG.12.1', text: 'Ich erkenne Spuren von Religionen in meiner Umgebung.' },
        { code: 'NMG.12.2', text: 'Ich kann etwas über religiöse Texte und ihren Gebrauch erzählen.' },
        { code: 'NMG.12.3', text: 'Ich kann religiöse Rituale und Bräuche beschreiben.' },
        { code: 'NMG.12.4', text: 'Ich kenne Feste verschiedener Religionen und Kulturen.' },
        { code: 'NMG.12.5', text: 'Ich begegne verschiedenen Überzeugungen mit Respekt.' },
      ]},
    ],
  },
  {
    id: 'NT',
    name: 'Natur und Technik',
    icon: 'flask-conical',
    cycles: [3],
    areas: [
      { id: 'NT.1', title: 'Naturwissenschaften und Technik verstehen', competencies: [
        { code: 'NT.1.1', text: 'Ich kann beschreiben, wie Forschende zu Erkenntnissen kommen.' },
        { code: 'NT.1.2', text: 'Ich kann Alltagsgeräte bedienen und erklären, wie sie funktionieren.' },
        { code: 'NT.1.3', text: 'Ich diskutiere, wie nachhaltig Technik und ihre Anwendungen sind.' },
      ]},
      { id: 'NT.2', title: 'Stoffe untersuchen und gewinnen', competencies: [
        { code: 'NT.2.1', text: 'Ich untersuche Stoffe und ordne sie nach ihren Eigenschaften.' },
        { code: 'NT.2.2', text: 'Ich kann Stoffgemische gezielt trennen.' },
      ]},
      { id: 'NT.3', title: 'Chemische Reaktionen erforschen', competencies: [
        { code: 'NT.3.1', text: 'Ich untersuche, wie sich Stoffe bei chemischen Reaktionen verwandeln.' },
        { code: 'NT.3.2', text: 'Ich kann chemische Reaktionen mit Modellen und dem Periodensystem erklären.' },
        { code: 'NT.3.3', text: 'Ich verstehe Stoffkreisläufe und gehe sorgsam mit Ressourcen um.' },
      ]},
      { id: 'NT.4', title: 'Energie', competencies: [
        { code: 'NT.4.1', text: 'Ich kann Energieformen und ihre Umwandlungen analysieren.' },
        { code: 'NT.4.2', text: 'Ich verstehe, wie Energie gespeichert und transportiert wird.' },
      ]},
      { id: 'NT.5', title: 'Mechanik und Elektrizität', competencies: [
        { code: 'NT.5.1', text: 'Ich analysiere Bewegungen und die Wirkung von Kräften.' },
        { code: 'NT.5.2', text: 'Ich verstehe die Grundlagen der Elektrizität und wende sie an.' },
        { code: 'NT.5.3', text: 'Ich untersuche elektrische und elektronische Schaltungen.' },
      ]},
      { id: 'NT.6', title: 'Sinne und Signale', competencies: [
        { code: 'NT.6.1', text: 'Ich verstehe, wie Sinnesreize im Körper verarbeitet werden.' },
        { code: 'NT.6.2', text: 'Ich kann erklären, wie Hören und Sehen funktionieren.' },
        { code: 'NT.6.3', text: 'Ich untersuche Licht und optische Phänomene.' },
      ]},
      { id: 'NT.7', title: 'Körperfunktionen', competencies: [
        { code: 'NT.7.1', text: 'Ich kann Aufbau und Funktionen des Körpers erklären.' },
        { code: 'NT.7.2', text: 'Ich verstehe den Stoffwechsel und trage Sorge zu meinem Körper.' },
        { code: 'NT.7.3', text: 'Ich weiss Bescheid über Fortpflanzung, Verhütung und übertragbare Krankheiten.' },
        { code: 'NT.7.4', text: 'Ich kann Massnahmen gegen häufige Krankheiten beurteilen.' },
      ]},
      { id: 'NT.8', title: 'Fortpflanzung und Entwicklung', competencies: [
        { code: 'NT.8.1', text: 'Ich verstehe, wie die Artenvielfalt mit der Evolution zusammenhängt.' },
        { code: 'NT.8.2', text: 'Ich kann erklären, wie Lebewesen wachsen und sich entwickeln.' },
        { code: 'NT.8.3', text: 'Ich verstehe Grundlagen der Genetik.' },
      ]},
      { id: 'NT.9', title: 'Ökosysteme', competencies: [
        { code: 'NT.9.1', text: 'Ich untersuche Gewässer und ihre Lebenswelt.' },
        { code: 'NT.9.2', text: 'Ich erkenne, wie Ökosysteme zusammenwirken.' },
        { code: 'NT.9.3', text: 'Ich schätze ein, wie der Mensch Ökosysteme beeinflusst.' },
      ]},
    ],
  },
  {
    id: 'WAH',
    name: 'Wirtschaft, Arbeit, Haushalt',
    icon: 'shopping-basket',
    cycles: [3],
    areas: [
      { id: 'WAH.1', title: 'Produktions- und Arbeitswelten', competencies: [
        { code: 'WAH.1.1', text: 'Ich denke darüber nach, was Arbeit für Menschen und die Gesellschaft bedeutet.' },
        { code: 'WAH.1.2', text: 'Ich vergleiche Anforderungen in verschiedenen Arbeitswelten.' },
        { code: 'WAH.1.3', text: 'Ich vergleiche, wie Güter und Dienstleistungen hergestellt werden.' },
      ]},
      { id: 'WAH.2', title: 'Märkte, Handel und Geld', competencies: [
        { code: 'WAH.2.1', text: 'Ich kann Grundprinzipien der Marktwirtschaft aufzeigen, zum Beispiel Angebot und Nachfrage.' },
        { code: 'WAH.2.2', text: 'Ich kann erklären, warum Handel Güter verfügbar macht.' },
        { code: 'WAH.2.3', text: 'Ich gehe verantwortungsvoll mit Geld um.' },
      ]},
      { id: 'WAH.3', title: 'Konsum gestalten', competencies: [
        { code: 'WAH.3.1', text: 'Ich erkenne, was mein Einkaufen beeinflusst, zum Beispiel Werbung.' },
        { code: 'WAH.3.2', text: 'Ich analysiere, welche Folgen mein Konsum hat.' },
        { code: 'WAH.3.3', text: 'Ich treffe überlegte Konsumentscheidungen.' },
      ]},
      { id: 'WAH.4', title: 'Ernährung und Gesundheit', competencies: [
        { code: 'WAH.4.1', text: 'Ich weiss, was die Gesundheit beeinflusst, und gestalte meinen Alltag gesund.' },
        { code: 'WAH.4.2', text: 'Ich gestalte Essen und Trinken passend zur Situation.' },
        { code: 'WAH.4.3', text: 'Ich wähle Nahrungsmittel bewusst aus.' },
        { code: 'WAH.4.4', text: 'Ich kann gesunde Mahlzeiten zubereiten.' },
        { code: 'WAH.4.5', text: 'Ich verstehe globale Herausforderungen der Ernährung.' },
      ]},
      { id: 'WAH.5', title: 'Haushalten und Zusammenleben', competencies: [
        { code: 'WAH.5.1', text: 'Ich plane Alltagsarbeiten und führe sie zielgerichtet aus.' },
        { code: 'WAH.5.2', text: 'Ich kann mich über soziale, rechtliche und finanzielle Fragen des Alltags informieren.' },
      ]},
    ],
  },
  {
    id: 'RZG',
    name: 'Räume, Zeiten, Gesellschaften',
    icon: 'map',
    cycles: [3],
    areas: [
      { id: 'RZG.1', title: 'Natürliche Grundlagen der Erde', competencies: [
        { code: 'RZG.1.1', text: 'Ich kann die Erde als Planeten beschreiben.' },
        { code: 'RZG.1.2', text: 'Ich kann Wetter und Klima analysieren.' },
        { code: 'RZG.1.3', text: 'Ich kann Naturereignisse wie Erdbeben und Vulkane erklären.' },
        { code: 'RZG.1.4', text: 'Ich untersuche Rohstoffe und Energieträger.' },
      ]},
      { id: 'RZG.2', title: 'Lebensweisen und Lebensräume', competencies: [
        { code: 'RZG.2.1', text: 'Ich verstehe, wie sich die Bevölkerung entwickelt und warum Menschen auswandern.' },
        { code: 'RZG.2.2', text: 'Ich vergleiche, wie Menschen in verschiedenen Lebensräumen leben.' },
        { code: 'RZG.2.3', text: 'Ich analysiere, wie sich Städte und ländliche Gebiete verändern.' },
        { code: 'RZG.2.4', text: 'Ich untersuche Mobilität und Verkehr.' },
        { code: 'RZG.2.5', text: 'Ich schätze die Bedeutung des Tourismus ein.' },
      ]},
      { id: 'RZG.3', title: 'Mensch und Umwelt', competencies: [
        { code: 'RZG.3.1', text: 'Ich erforsche natürliche Systeme und wie der Mensch sie nutzt.' },
        { code: 'RZG.3.2', text: 'Ich untersuche Wirtschaft und Globalisierung.' },
        { code: 'RZG.3.3', text: 'Ich verstehe, wie Raumplanung funktioniert.' },
      ]},
      { id: 'RZG.4', title: 'Sich in Räumen orientieren', competencies: [
        { code: 'RZG.4.1', text: 'Ich finde Orte, Länder und Gebirge auf der Karte.' },
        { code: 'RZG.4.2', text: 'Ich kann Karten und Orientierungsmittel auswerten.' },
        { code: 'RZG.4.3', text: 'Ich orientiere mich draussen im Gelände.' },
      ]},
      { id: 'RZG.5', title: 'Schweiz in Tradition und Wandel', competencies: [
        { code: 'RZG.5.1', text: 'Ich kann erklären, wie die Schweiz entstanden ist und sich entwickelt hat.' },
        { code: 'RZG.5.2', text: 'Ich zeige auf, wie wirtschaftlicher Wandel die Menschen in der Schweiz prägt.' },
        { code: 'RZG.5.3', text: 'Ich vergleiche den Alltag in der Schweiz in verschiedenen Jahrhunderten.' },
      ]},
      { id: 'RZG.6', title: 'Weltgeschichte', competencies: [
        { code: 'RZG.6.1', text: 'Ich kann Geschichte von der Neuzeit bis heute erzählen.' },
        { code: 'RZG.6.2', text: 'Ich beschreibe wichtige Entwicklungen und Umbrüche des 19. Jahrhunderts.' },
        { code: 'RZG.6.3', text: 'Ich analysiere Ereignisse des 20. und 21. Jahrhunderts und ihre Bedeutung für heute.' },
      ]},
      { id: 'RZG.7', title: 'Geschichtskultur', competencies: [
        { code: 'RZG.7.1', text: 'Ich lerne an Orten wie Museen, Burgen und Denkmälern.' },
        { code: 'RZG.7.2', text: 'Ich nutze Geschichte in Filmen, Büchern und Spielen, zum Lernen und zur Unterhaltung.' },
        { code: 'RZG.7.3', text: 'Ich gewinne aus Gesprächen mit Zeitzeugen Erkenntnisse über früher.' },
      ]},
      { id: 'RZG.8', title: 'Demokratie und Menschenrechte', competencies: [
        { code: 'RZG.8.1', text: 'Ich kann die Schweizer Demokratie erklären und mit anderen Systemen vergleichen.' },
        { code: 'RZG.8.2', text: 'Ich kann erklären, warum Menschenrechte wichtig sind und wie sie bedroht werden.' },
        { code: 'RZG.8.3', text: 'Ich beurteile die Rolle der Schweiz in Europa und der Welt.' },
      ]},
    ],
  },
  {
    id: 'ERG',
    name: 'Ethik, Religionen, Gemeinschaft',
    icon: 'scale',
    cycles: [3],
    areas: [
      { id: 'ERG.1', title: 'Existentielle Grunderfahrungen', competencies: [
        { code: 'ERG.1.1', text: 'Ich denke über grosse Erfahrungen des Lebens nach.' },
        { code: 'ERG.1.2', text: 'Ich stelle philosophische Fragen und denke über sie nach.' },
      ]},
      { id: 'ERG.2', title: 'Werte und Normen', competencies: [
        { code: 'ERG.2.1', text: 'Ich kann Werte und Normen erklären, prüfen und vertreten.' },
        { code: 'ERG.2.2', text: 'Ich hinterfrage Regeln und Handlungen und begründe meinen Standpunkt.' },
      ]},
      { id: 'ERG.3', title: 'Religionen in Kultur und Gesellschaft', competencies: [
        { code: 'ERG.3.1', text: 'Ich erkenne religiöse Motive im Alltag und in den Medien.' },
        { code: 'ERG.3.2', text: 'Ich schätze ein, welche Rolle Religionen in der Gesellschaft spielen.' },
      ]},
      { id: 'ERG.4', title: 'Religionen und Weltsichten', competencies: [
        { code: 'ERG.4.1', text: 'Ich kann erklären, wie religiöse Texte überliefert und verwendet werden.' },
        { code: 'ERG.4.2', text: 'Ich kann religiöse Rituale im Alltag erklären.' },
        { code: 'ERG.4.3', text: 'Ich kenne Festtraditionen und kann sie einordnen.' },
        { code: 'ERG.4.4', text: 'Ich orientiere mich in der Vielfalt der Religionen und begegne Überzeugungen mit Respekt.' },
        { code: 'ERG.4.5', text: 'Ich denke über Weltbilder nach, über Glauben und Wissen.' },
      ]},
      { id: 'ERG.5', title: 'Ich und die Gemeinschaft', competencies: [
        { code: 'ERG.5.1', text: 'Ich kenne meine Stärken und bringe sie ein.' },
        { code: 'ERG.5.2', text: 'Ich denke über Geschlecht und Rollen nach.' },
        { code: 'ERG.5.3', text: 'Ich denke über Beziehungen, Liebe und Sexualität nach und kenne meine Verantwortung.' },
        { code: 'ERG.5.4', text: 'Ich gestalte die Gemeinschaft aktiv mit.' },
        { code: 'ERG.5.5', text: 'Ich erkunde und respektiere verschiedene Lebenswelten.' },
        { code: 'ERG.5.6', text: 'Ich bringe Anliegen ein und suche bei Konflikten nach Lösungen.' },
      ]},
    ],
  },
  {
    id: 'BG',
    name: 'Bildnerisches Gestalten',
    icon: 'palette',
    cycles: [1, 2, 3],
    areas: [
      { id: 'BG.1', title: 'Wahrnehmung und Kommunikation', competencies: [
        { code: 'BG.1.A.1', text: 'Ich baue eigene Bildideen und Vorstellungen auf und rede darüber.' },
        { code: 'BG.1.A.2', text: 'Ich schaue Bilder genau an und denke über sie nach.' },
        { code: 'BG.1.A.3', text: 'Ich bilde mir ein Urteil über Bilder und begründe es.' },
        { code: 'BG.1.B.1', text: 'Ich dokumentiere und präsentiere meine Bilder und Arbeiten.' },
      ]},
      { id: 'BG.2', title: 'Prozesse und Produkte', competencies: [
        { code: 'BG.2.A.1', text: 'Ich entwickle eigene Bildideen zu verschiedenen Themen.' },
        { code: 'BG.2.A.2', text: 'Ich setze bildnerische Vorhaben um und erweitere meine Bildsprache.' },
        { code: 'BG.2.B.1', text: 'Ich untersuche, wie Punkte, Linien, Formen und Farben wirken, und nutze das für meine Bilder.' },
        { code: 'BG.2.C.1', text: 'Ich nutze Verfahren wie Zeichnen, Malen und Drucken für meine Bildideen.' },
        { code: 'BG.2.C.2', text: 'Ich wende Methoden aus der Kunst an.' },
        { code: 'BG.2.D.1', text: 'Ich probiere Materialien und Werkzeuge aus und setze sie gezielt ein.' },
      ]},
      { id: 'BG.3', title: 'Kontexte und Orientierung', competencies: [
        { code: 'BG.3.A.1', text: 'Ich betrachte Kunstwerke aus verschiedenen Kulturen und Zeiten und vergleiche sie.' },
        { code: 'BG.3.B.1', text: 'Ich erkenne, wie Kunstwerke und Bilder wirken und wozu sie dienen.' },
      ]},
    ],
  },
  {
    id: 'TTG',
    name: 'Textiles und Technisches Gestalten',
    icon: 'scissors',
    cycles: [1, 2, 3],
    areas: [
      { id: 'TTG.1', title: 'Wahrnehmung und Kommunikation', competencies: [
        { code: 'TTG.1.A.1', text: 'Ich nehme wahr, wie Gegenstände gestaltet sind und funktionieren.' },
        { code: 'TTG.1.B.1', text: 'Ich begutachte meine Arbeiten und entwickle sie weiter.' },
        { code: 'TTG.1.B.2', text: 'Ich dokumentiere und präsentiere meine Arbeiten.' },
      ]},
      { id: 'TTG.2', title: 'Prozesse und Produkte', competencies: [
        { code: 'TTG.2.A.1', text: 'Ich erfasse eine Gestaltungsaufgabe und sammle Ideen dazu.' },
        { code: 'TTG.2.A.2', text: 'Ich experimentiere und entwickle daraus eigene Produktideen.' },
        { code: 'TTG.2.A.3', text: 'Ich plane eigene Produkte und stelle sie her.' },
        { code: 'TTG.2.B.1', text: 'Ich verstehe Funktionen und entwickle eigene Konstruktionen, zum Beispiel für Spiel, Kleidung oder Transport.' },
        { code: 'TTG.2.C.1', text: 'Ich setze Material, Oberfläche, Form und Farbe bewusst ein.' },
        { code: 'TTG.2.D.1', text: 'Ich beherrsche handwerkliche Verfahren wie Schneiden, Nähen und Bohren und setze sie gezielt ein.' },
        { code: 'TTG.2.E.1', text: 'Ich kenne Materialien, Werkzeuge und Maschinen und setze sie sachgerecht ein.' },
      ]},
      { id: 'TTG.3', title: 'Kontexte und Orientierung', competencies: [
        { code: 'TTG.3.A.1', text: 'Ich erkenne, was Gegenstände über Kulturen und Zeiten erzählen.' },
        { code: 'TTG.3.A.2', text: 'Ich verstehe technische Erfindungen und ihre Bedeutung für den Alltag.' },
        { code: 'TTG.3.B.1', text: 'Ich erkenne beim Kaufen und Nutzen von Produkten Zusammenhänge mit Umwelt und Gesellschaft.' },
        { code: 'TTG.3.B.2', text: 'Ich weiss, wie Materialien hergestellt und richtig entsorgt werden.' },
        { code: 'TTG.3.B.3', text: 'Ich vergleiche handwerkliche und industrielle Herstellung.' },
        { code: 'TTG.3.B.4', text: 'Ich nehme technische Geräte in Betrieb und nutze dazu Anleitungen.' },
      ]},
    ],
  },
  {
    id: 'MU',
    name: 'Musik',
    icon: 'music',
    cycles: [1, 2, 3],
    areas: [
      { id: 'MU.1', title: 'Singen und Sprechen', competencies: [
        { code: 'MU.1.A.1', text: 'Ich singe in der Gruppe und setze meine Stimme im Chor ein.' },
        { code: 'MU.1.B.1', text: 'Ich entwickle meine Stimme und forme ihren Klang.' },
        { code: 'MU.1.C.1', text: 'Ich singe Lieder aus verschiedenen Zeiten, Stilen und Kulturen.' },
      ]},
      { id: 'MU.2', title: 'Hören und Sich-Orientieren', competencies: [
        { code: 'MU.2.A.1', text: 'Ich höre genau hin und beschreibe, was ich in Musik höre.' },
        { code: 'MU.2.B.1', text: 'Ich erkenne Musik aus verschiedenen Zeiten, Stilen und Kulturen.' },
        { code: 'MU.2.C.1', text: 'Ich verstehe, wie Musik wirkt und wozu sie gebraucht wird.' },
      ]},
      { id: 'MU.3', title: 'Bewegen und Tanzen', competencies: [
        { code: 'MU.3.A.1', text: 'Ich nehme meinen Körper wahr und bewege mich passend zur Musik.' },
        { code: 'MU.3.B.1', text: 'Ich drücke mich mit Bewegung zu Musik aus, auch mit Materialien und in der Gruppe.' },
        { code: 'MU.3.C.1', text: 'Ich passe meine Bewegungen der Musik an und kenne Tänze aus verschiedenen Kulturen.' },
      ]},
      { id: 'MU.4', title: 'Musizieren', competencies: [
        { code: 'MU.4.A.1', text: 'Ich musiziere im Ensemble, mit Instrumenten und Körperperkussion.' },
        { code: 'MU.4.B.1', text: 'Ich erkunde Instrumente und Klänge, improvisiere und spiele nach Vorlagen.' },
        { code: 'MU.4.C.1', text: 'Ich kenne verschiedene Instrumente und weiss, wie sie Klang erzeugen.' },
      ]},
      { id: 'MU.5', title: 'Gestaltungsprozesse', competencies: [
        { code: 'MU.5.A.1', text: 'Ich mache aus Themen und Eindrücken eine eigene Musik.' },
        { code: 'MU.5.B.1', text: 'Ich entwickle zu Musik eigene Darstellungsformen, zum Beispiel Bilder oder Szenen.' },
        { code: 'MU.5.C.1', text: 'Ich präsentiere, was ich musikalisch kann.' },
      ]},
      { id: 'MU.6', title: 'Praxis des musikalischen Wissens', competencies: [
        { code: 'MU.6.A.1', text: 'Ich erkenne und benenne Rhythmen, Melodien und Harmonien und wende sie an.' },
        { code: 'MU.6.B.1', text: 'Ich kann Noten lesen und schreiben.' },
      ]},
    ],
  },
  {
    id: 'BS',
    name: 'Bewegung und Sport',
    icon: 'bike',
    cycles: [1, 2, 3],
    areas: [
      { id: 'BS.1', title: 'Laufen, Springen, Werfen', competencies: [
        { code: 'BS.1.A.1', text: 'Ich kann schnell, ausdauernd und über Hindernisse laufen.' },
        { code: 'BS.1.B.1', text: 'Ich kann vielseitig weit und hoch springen.' },
        { code: 'BS.1.C.1', text: 'Ich kann Gegenstände weit werfen, stossen und schleudern.' },
      ]},
      { id: 'BS.2', title: 'Bewegen an Geräten', competencies: [
        { code: 'BS.2.A.1', text: 'Ich turne an Geräten, zum Beispiel balancieren, rollen, schaukeln und klettern, und helfe und sichere andere.' },
        { code: 'BS.2.B.1', text: 'Ich baue Körperspannung auf und trainiere Kraft und Beweglichkeit.' },
      ]},
      { id: 'BS.3', title: 'Darstellen und Tanzen', competencies: [
        { code: 'BS.3.A.1', text: 'Ich nehme meinen Körper wahr und steuere meine Bewegungen gezielt.' },
        { code: 'BS.3.B.1', text: 'Ich drücke mich mit Bewegung aus und präsentiere eine Bewegungsfolge.' },
        { code: 'BS.3.C.1', text: 'Ich gestalte Bewegungen und Tänze im Takt der Musik.' },
      ]},
      { id: 'BS.4', title: 'Spielen', competencies: [
        { code: 'BS.4.A.1', text: 'Ich spiele Spiele, entwickle sie weiter und erfinde eigene.' },
        { code: 'BS.4.B.1', text: 'Ich wende Technik und Taktik in Sportspielen an und spiele fair.' },
        { code: 'BS.4.C.1', text: 'Ich kämpfe gewandt, mit Strategie und fair.' },
      ]},
      { id: 'BS.5', title: 'Gleiten, Rollen, Fahren', competencies: [
        { code: 'BS.5.1', text: 'Ich gleite, rolle und fahre sicher, zum Beispiel auf Schnee, Eis oder Rädern.' },
      ]},
      { id: 'BS.6', title: 'Bewegen im Wasser', competencies: [
        { code: 'BS.6.A.1', text: 'Ich schwimme sicher und kenne verschiedene Schwimmtechniken.' },
        { code: 'BS.6.B.1', text: 'Ich springe ins Wasser und tauche.' },
        { code: 'BS.6.C.1', text: 'Ich schätze Gefahren im und am Wasser ein und handle verantwortungsvoll.' },
      ]},
    ],
  },
  {
    id: 'MI',
    name: 'Medien und Informatik',
    tag: 'Modul',
    icon: 'monitor-smartphone',
    cycles: [1, 2, 3],
    areas: [
      { id: 'MI.1', title: 'Medien', competencies: [
        { code: 'MI.1.1', text: 'Ich orientiere mich in der Medienwelt und verhalte mich dort verantwortungsvoll.' },
        { code: 'MI.1.2', text: 'Ich verstehe Medienbeiträge und hinterfrage sie.' },
        { code: 'MI.1.3', text: 'Ich erstelle eigene Medienbeiträge und veröffentliche sie überlegt.' },
        { code: 'MI.1.4', text: 'Ich kommuniziere und arbeite mit Medien zusammen.' },
      ]},
      { id: 'MI.2', title: 'Informatik', competencies: [
        { code: 'MI.2.1', text: 'Ich kann Daten darstellen, ordnen und auswerten.' },
        { code: 'MI.2.2', text: 'Ich analysiere Probleme und setze Lösungswege in Programmen um.' },
        { code: 'MI.2.3', text: 'Ich verstehe, wie Computer und Netzwerke funktionieren, und schütze meine Daten.' },
      ]},
    ],
  },
  {
    id: 'BO',
    name: 'Berufliche Orientierung',
    tag: 'Modul',
    icon: 'briefcase',
    cycles: [3],
    areas: [
      { id: 'BO.1', title: 'Persönlichkeitsprofil', competencies: [
        { code: 'BO.1.1', text: 'Ich kenne meine Stärken und Interessen und nutze sie für die Berufswahl.' },
      ]},
      { id: 'BO.2', title: 'Bildungswege, Berufs- und Arbeitswelt', competencies: [
        { code: 'BO.2.1', text: 'Ich verschaffe mir einen Überblick über das Schweizer Bildungssystem.' },
        { code: 'BO.2.2', text: 'Ich stelle einen Bezug zur Arbeitswelt her und ziehe Schlüsse für meine Berufswahl.' },
      ]},
      { id: 'BO.3', title: 'Entscheidung und Umgang mit Schwierigkeiten', competencies: [
        { code: 'BO.3.1', text: 'Ich setze Prioritäten, entscheide mich und bleibe offen für Alternativen.' },
        { code: 'BO.3.2', text: 'Ich erkenne Schwierigkeiten bei der Berufswahl und entwickle Lösungen.' },
      ]},
      { id: 'BO.4', title: 'Planung, Umsetzung und Dokumentation', competencies: [
        { code: 'BO.4.1', text: 'Ich setze mir Ziele und plane meine Bewerbungen.' },
        { code: 'BO.4.2', text: 'Ich setze meine geplanten Schritte um und bereite den Übergang vor.' },
        { code: 'BO.4.3', text: 'Ich dokumentiere meine Berufswahl und stelle meine Bewerbungsunterlagen zusammen.' },
      ]},
    ],
  },
];

export function subjectsForCycle(cycle) {
  return SUBJECTS.filter((s) => s.cycles.includes(cycle));
}

export function subjectById(id) {
  return SUBJECTS.find((s) => s.id === id) || null;
}

export function competencyCount(subject) {
  return subject.areas.reduce((n, a) => n + a.competencies.length, 0);
}
