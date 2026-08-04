// data.js — Lehrplan-Kompass Inhaltsdaten.
//
// Struktur, Codes und Bereichstitel folgen dem Lehrplan 21, Ausgabe Kanton
// Bern (be.lehrplan.ch, Gesamtausgabe PDF). Die Kompetenztexte sind eigene,
// kindgerechte Umschreibungen pro Zyklus, orientiert am jeweiligen
// Kompetenzaufbau und Grundanspruch. Sie sind keine Originaltexte;
// massgebend bleibt der offizielle Lehrplan.
//
// Jede Kompetenz: { code, texts }. Der Code ist der offizielle
// Lehrplan-21-Code und zugleich die stabile ID für die Speicherung.
// texts enthält pro Zyklus, in dem die Kompetenz Kompetenzstufen hat,
// einen eigenen Text (Schlüssel 1, 2, 3). Fehlt ein Zyklus, wird die
// Kompetenz in diesem Zyklus nicht angezeigt.
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
        { code: 'D.1.A.1', texts: { 1: 'Ich höre Laute, Silben und Reime heraus und erkenne, wo im Wort ein Laut steht.', 2: 'Ich verstehe Wörter in verschiedenen Situationen und höre, wie sich jemand fühlt.', 3: 'Ich verstehe auch schwierige Wörter und erkenne, wie förmlich jemand spricht.' } },
        { code: 'D.1.B.1', texts: { 1: 'Ich verstehe Erklärungen und Aufträge und kann einer kurzen Geschichte folgen.', 2: 'Ich verstehe das Wichtigste in einem Hörtext und kann es wiedergeben.', 3: 'Ich verstehe mehrteilige Aufträge und folge längeren Filmen und Hörspielen.' } },
        { code: 'D.1.C.1', texts: { 1: 'Ich folge einem Gespräch und zeige mit Worten und Blicken, dass ich zuhöre.', 2: 'Ich folge auch längeren Gesprächen und beteilige mich aktiv.', 3: 'Ich folge Diskussionen und erkenne, was andere mit ihren Beiträgen bezwecken.' } },
        { code: 'D.1.D.1', texts: { 1: 'Ich tausche mich mit anderen über Gehörtes aus.', 2: 'Ich kann sagen, welche Tricks mir beim Zuhören helfen.', 3: 'Ich beurteile, wie gut ich etwas verstanden habe und was mir wichtig ist.' } },
      ]},
      { id: 'D.2', title: 'Lesen', competencies: [
        { code: 'D.2.A.1', texts: { 1: 'Ich erkenne vertraute Wörter auf einen Blick und lese kurze Texte.', 2: 'Ich lese flüssig und kann einen geübten Text vorlesen.', 3: 'Ich lese flüssig, betont und verständlich vor.' } },
        { code: 'D.2.B.1', texts: { 1: 'Ich verstehe kurze Sachtexte mit Bildern.', 2: 'Ich erkenne den Aufbau eines Sachtextes und finde Informationen darin.', 3: 'Ich hole mir Wissen aus Sachtexten, Grafiken und Tabellen.' } },
        { code: 'D.2.C.1', texts: { 1: 'Ich verstehe Geschichten und kenne ihre Figuren.', 2: 'Ich wähle Bücher aus, lese sie und versetze mich in die Figuren hinein.', 3: 'Ich lese selbstständig Bücher und bilde mir eine Meinung dazu.' } },
        { code: 'D.2.D.1', texts: { 1: 'Ich tausche mich mit anderen über Gelesenes aus.', 2: 'Ich kann sagen, welche Tricks mir beim Lesen helfen.', 3: 'Ich beschreibe, wie ich beim Lesen vorgehe und was mir schwerfällt.' } },
      ]},
      { id: 'D.3', title: 'Sprechen', competencies: [
        { code: 'D.3.A.1', texts: { 1: 'Ich spreche deutlich und laut genug, auch auf Hochdeutsch.', 2: 'Ich setze Stimme, Mimik und Gestik beim Sprechen passend ein.', 3: 'Ich spreche fliessend Hochdeutsch.' } },
        { code: 'D.3.B.1', texts: { 1: 'Ich erzähle von Erlebnissen, in Mundart und auf Hochdeutsch.', 2: 'Ich kann ein Buch oder einen Film auf Hochdeutsch vorstellen.', 3: 'Ich drücke mich beim Vortragen sicher auf Hochdeutsch aus.' } },
        { code: 'D.3.C.1', texts: { 1: 'Ich sage meine Gesprächsbeiträge laut und deutlich.', 2: 'Ich bereite Gespräche vor und bringe meine Beiträge zum richtigen Zeitpunkt ein.', 3: 'Ich kann ein Vorstellungsgespräch vorbereiten und Gespräche mitgestalten.' } },
        { code: 'D.3.D.1', texts: { 1: 'Ich rede mit anderen darüber, wie wir uns im Gespräch verhalten.', 2: 'Ich denke über Gesprächsregeln nach und beurteile Präsentationen mit Kriterien.', 3: 'Ich beschreibe, mit welchen Strategien ich spreche und präsentiere.' } },
      ]},
      { id: 'D.4', title: 'Schreiben', competencies: [
        { code: 'D.4.A.1', texts: { 1: 'Ich schreibe alle Buchstaben und Ziffern geläufig von Hand.', 2: 'Ich entwickle meine eigene Handschrift und schreibe flüssig, auch an der Tastatur.', 3: 'Ich schreibe schnell und sicher von Hand und mit der Tastatur.' } },
        { code: 'D.4.B.1', texts: { 1: 'Ich kenne das Muster eines persönlichen Briefs mit Anrede und Gruss.', 2: 'Ich kenne Erzählmuster und andere Textsorten für eigene Texte.', 3: 'Ich kenne viele Textsorten, auch Bewerbung und Lebenslauf, und nutze sie beim Schreiben.' } },
        { code: 'D.4.C.1', texts: { 1: 'Ich finde mit Hilfe Ideen für eigene Texte.', 2: 'Ich finde selbstständig Ideen für Geschichten und plane meine Texte.', 3: 'Ich nutze eigene Strategien, um auch längere Texte zu planen.' } },
        { code: 'D.4.D.1', texts: { 1: 'Ich bringe meine Ideen beim Schreiben in eine verständliche Reihenfolge.', 2: 'Ich schreibe im Fluss und verwende passende Wörter zum Thema.', 3: 'Ich formuliere Texte klar und baue sie gut auf.' } },
        { code: 'D.4.E.1', texts: { 1: 'Ich bespreche mit Hilfe, was in meinem Text noch unklar ist.', 2: 'Ich überarbeite meine Texte nach besprochenen Punkten.', 3: 'Ich überarbeite meine Texte selbstständig, auf Papier und am Computer.' } },
        { code: 'D.4.F.1', texts: { 1: 'Ich beachte beim Überarbeiten erste Regeln, zum Beispiel Namen grossschreiben.', 2: 'Ich lese meine Texte auf Fehler durch und entwickle ein Fehlergespür.', 3: 'Ich überarbeite meine Texte sprachformal und wende Rechtschreiberegeln an.' } },
        { code: 'D.4.G.1', texts: { 1: 'Ich bespreche meine Texte anhand von Leitfragen.', 2: 'Ich schätze meine Texte mit Kriterien ein und gewinne Abstand dazu.', 3: 'Ich reflektiere mein Schreiben und baue meine Schreibstrategien aus.' } },
      ]},
      { id: 'D.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'D.5.A.1', texts: { 1: 'Ich sammle und ordne Wörter nach vorgegebenen Merkmalen.', 2: 'Ich untersuche Sprachmaterial und vergleiche Sprachen.', 3: 'Ich untersuche Sätze mit grammatischen Proben, zum Beispiel Umstellen und Ersetzen.' } },
        { code: 'D.5.B.1', texts: { 1: 'Ich tausche mich über Gesprächsverhalten und Gesprächsregeln aus.', 2: 'Ich untersuche, wann wir Mundart und wann Hochdeutsch brauchen.', 3: 'Ich untersuche, wie Sprache gebraucht wird und was sie bewirkt.' } },
        { code: 'D.5.C.1', texts: { 1: 'Ich untersuche Laute, Silben und Reime, auch in meiner Erstsprache.', 2: 'Ich vergleiche Laute, Wörter und Sätze in verschiedenen Sprachen.', 3: 'Ich untersuche Wort- und Satzbau in Hochdeutsch und Mundart.' } },
        { code: 'D.5.D.1', texts: { 1: 'Ich lerne die Wortarten Nomen, Verb und Adjektiv kennen.', 2: 'Ich bestimme Nomen, Verb und Adjektiv und kenne Zeitformen wie Präsens und Perfekt.', 3: 'Ich bestimme Wortarten und Fälle wie Nominativ, Akkusativ und Dativ.' } },
        { code: 'D.5.E.1', texts: { 1: 'Ich schreibe Wörter so, wie ich sie höre, Laut für Laut.', 2: 'Ich nutze Rechtschreiberegeln wie die Stammregel und schlage Wörter nach.', 3: 'Ich wende Rechtschreiberegeln in Übungen sicher an.' } },
      ]},
      { id: 'D.6', title: 'Literatur im Fokus', competencies: [
        { code: 'D.6.A.1', texts: { 1: 'Ich spiele und gestalte Szenen aus Geschichten nach.', 2: 'Ich erschliesse Figuren, Orte und Handlungen einer Geschichte kreativ.', 3: 'Ich versetze mich in Figuren hinein und gestalte Texte kreativ um.' } },
        { code: 'D.6.A.2', texts: { 1: 'Ich erzähle anderen, was ich gelesen, gehört oder gesehen habe.', 2: 'Ich tausche mich über Bücher aus und vergleiche, wie andere sie verstehen.', 3: 'Ich rede über meine Art zu lesen und begründe, wie ich einen Text verstehe.' } },
        { code: 'D.6.B.1', texts: { 1: 'Ich lerne Geschichten aus verschiedenen Kulturen kennen.', 2: 'Ich kenne einzelne Autorinnen und Autoren von Kinderbüchern.', 3: 'Ich sammle Wissen über Autorinnen und Autoren und ihre Bücher.' } },
        { code: 'D.6.C.1', texts: { 1: 'Ich erkenne typische Merkmale bekannter Geschichtenarten.', 2: 'Ich kenne Merkmale von Erzählungen, Gedichten und Theaterstücken.', 3: 'Ich setze mich mit neuen literarischen Texten auseinander und erkenne ihre Machart.' } },
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
        { code: 'FS1F.1.A.1', texts: { 2: 'Ich verstehe kurze, einfache Hörtexte zu vertrauten Themen, wenn langsam gesprochen wird.', 3: 'Ich verstehe, worum es in Gesprächen und Beiträgen zu vertrauten Themen geht.' } },
        { code: 'FS1F.1.A.2', texts: { 2: 'Ich tauche in vorgelesene französische Texte ein.', 3: 'Ich entdecke, wie französische Hörtexte gestaltet sind, und beschreibe ihre Wirkung.' } },
        { code: 'FS1F.1.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, um beim Zuhören mehr zu verstehen.', 3: 'Ich weiss, welche Hörtricks mir helfen, und setze sie ein.' } },
        { code: 'FS1F.1.C.1', texts: { 2: 'Ich gebe die Hauptaussagen aus kurzen Mitteilungen auf Deutsch wieder.', 3: 'Ich übertrage Gehörtes sinngemäss ins Deutsche, auch aus Gesprächen.' } },
      ]},
      { id: 'FS1F.2', title: 'Lesen', competencies: [
        { code: 'FS1F.2.A.1', texts: { 2: 'Ich verstehe kurze, einfache Geschichten und Texte zu vertrauten Themen.', 3: 'Ich verstehe die Hauptinformationen in klar aufgebauten Texten.' } },
        { code: 'FS1F.2.A.2', texts: { 2: 'Ich entdecke in einfachen Texten, wie sie gestaltet sind.', 3: 'Ich entdecke Gestaltungsmittel in Texten und beschreibe ihre Wirkung.' } },
        { code: 'FS1F.2.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, um beim Lesen mehr zu verstehen.', 3: 'Ich weiss, welche Lesetricks mir helfen, und setze sie ein.' } },
        { code: 'FS1F.2.C.1', texts: { 2: 'Ich gebe die Hauptaussagen aus kurzen Texten auf Deutsch wieder.', 3: 'Ich übertrage Gelesenes sinngemäss ins Deutsche.' } },
      ]},
      { id: 'FS1F.3', title: 'Sprechen', competencies: [
        { code: 'FS1F.3.A.1', texts: { 2: 'Ich tausche im Alltag mit einfachen Worten Informationen aus.', 3: 'Ich rede über vertraute Themen mit und sage meine Meinung.' } },
        { code: 'FS1F.3.B.1', texts: { 2: 'Ich trage ein kurzes Gedicht vor und präsentiere ein vertrautes Thema.', 3: 'Ich erzähle kurze Geschichten und berichte über Erlebnisse.' } },
        { code: 'FS1F.3.B.2', texts: { 2: 'Ich probiere beim Vortragen spielerisch Gestaltungsmittel aus.', 3: 'Ich trage Texte kreativ vor und erziele eine Wirkung.' } },
        { code: 'FS1F.3.C.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, damit das Sprechen klappt.', 3: 'Ich setze Sprechtricks ein, damit meine Beiträge wirken.' } },
        { code: 'FS1F.3.D.1', texts: { 2: 'Ich gebe deutsche Mitteilungen sinngemäss auf Französisch wieder.', 3: 'Ich vermittle in Gesprächen zwischen Deutsch und Französisch.' } },
      ]},
      { id: 'FS1F.4', title: 'Schreiben', competencies: [
        { code: 'FS1F.4.A.1', texts: { 2: 'Ich beschrifte Bilder, führe Listen und halte das Wichtigste einer Geschichte fest.', 3: 'Ich schreibe kurze Geschichten und Berichte in einfachen Sätzen.' } },
        { code: 'FS1F.4.A.2', texts: { 2: 'Ich experimentiere beim Schreiben spielerisch mit Gestaltungsmitteln.', 3: 'Ich gestalte eigene Texte kreativ und erziele eine Wirkung.' } },
        { code: 'FS1F.4.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, die mir beim Schreiben helfen.', 3: 'Ich weiss, welche Schreibtricks mir helfen, und setze sie ein.' } },
        { code: 'FS1F.4.C.1', texts: { 2: 'Ich halte zu deutschen Texten Stichworte auf Französisch fest.', 3: 'Ich gebe deutsche Mitteilungen in kurzen Notizen auf Französisch wieder.' } },
      ]},
      { id: 'FS1F.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS1F.5.A.1', texts: { 2: 'Ich nehme wahr, wo um mich herum mehrere Sprachen gesprochen werden.', 3: 'Ich kenne die Sprachenvielfalt in der Schweiz, in Europa und der Welt.' } },
        { code: 'FS1F.5.A.2', texts: { 2: 'Ich entdecke Unterschiede und Ähnlichkeiten zwischen Sprachen.', 3: 'Ich nehme verschiedene Varianten des Französischen in der Welt wahr.' } },
        { code: 'FS1F.5.B.1', texts: { 2: 'Ich kenne häufige Wörter und Wendungen für den Alltag.', 3: 'Ich kenne genug Wörter, um über viele Themen zu reden und zu schreiben.' } },
        { code: 'FS1F.5.B.2', texts: { 2: 'Ich probiere Techniken aus, um neue Wörter zu lernen.', 3: 'Ich wähle die Lerntechniken aus, die zu mir passen.' } },
        { code: 'FS1F.5.C.1', texts: { 2: 'Ich spreche vertraute Wörter so aus, dass man mich versteht.', 3: 'Ich spreche verständlich, auch wenn man meinen Akzent hört.' } },
        { code: 'FS1F.5.C.2', texts: { 2: 'Ich erkenne typische französische Laute.', 3: 'Ich verbinde Schriftbilder mit der richtigen Aussprache und leite Regeln ab.' } },
        { code: 'FS1F.5.D.1', texts: { 2: 'Ich verwende einfache grammatische Strukturen, auch wenn noch Fehler passieren.', 3: 'Ich verwende einfache Grammatik zunehmend sicher beim Sprechen und Schreiben.' } },
        { code: 'FS1F.5.D.2', texts: { 2: 'Ich erforsche einzelne grammatische Strukturen und vergleiche sie mit anderen Sprachen.', 3: 'Ich untersuche auch komplexere Grammatik und leite Regeln ab.' } },
        { code: 'FS1F.5.E.1', texts: { 2: 'Ich schreibe Wendungen und kurze Sätze korrekt ab.', 3: 'Ich schreibe kürzere Texte zu vertrauten Themen ziemlich korrekt.' } },
        { code: 'FS1F.5.E.2', texts: { 2: 'Ich erforsche einfache Rechtschreiberegeln des Französischen.', 3: 'Ich leite häufige Rechtschreiberegeln ab und überprüfe meine Texte.' } },
        { code: 'FS1F.5.F.1', texts: { 2: 'Ich schätze mit Unterstützung meinen Lernstand ein und setze mir Ziele.', 3: 'Ich schätze meine Fortschritte ein und plane mein Sprachenlernen.' } },
      ]},
      { id: 'FS1F.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS1F.6.A.1', texts: { 2: 'Ich kenne Gemeinsamkeiten und Unterschiede zwischen meiner Kultur und der französischsprachigen Welt.', 3: 'Ich kenne kulturelle Eigenheiten und bekannte Werke der französischsprachigen Welt.' } },
        { code: 'FS1F.6.B.1', texts: { 2: 'Ich drücke aus, wie ich fremde Sprachen und Kulturen erlebe.', 3: 'Ich denke darüber nach, wozu mir Französisch nützt.' } },
        { code: 'FS1F.6.C.1', texts: { 2: 'Ich vergleiche den Alltag in der französischsprachigen Welt mit meinem.', 3: 'Ich begegne Menschen und Werken aus der französischsprachigen Welt und lerne daraus.' } },
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
        { code: 'FS2E.1.A.1', texts: { 2: 'Ich verstehe kurze, einfache Hörtexte zu vertrauten Themen, wenn langsam gesprochen wird.', 3: 'Ich verstehe, worum es in Gesprächen und Beiträgen zu vertrauten Themen geht.' } },
        { code: 'FS2E.1.A.2', texts: { 2: 'Ich tauche in vorgelesene englische Texte ein.', 3: 'Ich entdecke, wie englische Hörtexte gestaltet sind, und beschreibe ihre Wirkung.' } },
        { code: 'FS2E.1.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, um beim Zuhören mehr zu verstehen.', 3: 'Ich weiss, welche Hörtricks mir helfen, und setze sie ein.' } },
        { code: 'FS2E.1.C.1', texts: { 2: 'Ich gebe die Hauptaussagen aus kurzen Mitteilungen auf Deutsch wieder.', 3: 'Ich übertrage Gehörtes sinngemäss ins Deutsche, auch aus Gesprächen.' } },
      ]},
      { id: 'FS2E.2', title: 'Lesen', competencies: [
        { code: 'FS2E.2.A.1', texts: { 2: 'Ich verstehe kurze, einfache Geschichten und Texte zu vertrauten Themen.', 3: 'Ich verstehe die Hauptinformationen in klar aufgebauten Texten.' } },
        { code: 'FS2E.2.A.2', texts: { 2: 'Ich entdecke in einfachen Texten, wie sie gestaltet sind.', 3: 'Ich entdecke Gestaltungsmittel in Texten und beschreibe ihre Wirkung.' } },
        { code: 'FS2E.2.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, um beim Lesen mehr zu verstehen.', 3: 'Ich weiss, welche Lesetricks mir helfen, und setze sie ein.' } },
        { code: 'FS2E.2.C.1', texts: { 2: 'Ich gebe die Hauptaussagen aus kurzen Texten auf Deutsch wieder.', 3: 'Ich übertrage Gelesenes sinngemäss ins Deutsche.' } },
      ]},
      { id: 'FS2E.3', title: 'Sprechen', competencies: [
        { code: 'FS2E.3.A.1', texts: { 2: 'Ich tausche im Alltag mit einfachen Worten Informationen aus.', 3: 'Ich rede über vertraute Themen mit und sage meine Meinung.' } },
        { code: 'FS2E.3.B.1', texts: { 2: 'Ich trage ein kurzes Gedicht vor und präsentiere ein vertrautes Thema.', 3: 'Ich erzähle kurze Geschichten und berichte über Erlebnisse.' } },
        { code: 'FS2E.3.B.2', texts: { 2: 'Ich probiere beim Vortragen spielerisch Gestaltungsmittel aus.', 3: 'Ich trage Texte kreativ vor und erziele eine Wirkung.' } },
        { code: 'FS2E.3.C.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, damit das Sprechen klappt.', 3: 'Ich setze Sprechtricks ein, damit meine Beiträge wirken.' } },
        { code: 'FS2E.3.D.1', texts: { 2: 'Ich gebe deutsche Mitteilungen sinngemäss auf Englisch wieder.', 3: 'Ich vermittle in Gesprächen zwischen Deutsch und Englisch.' } },
      ]},
      { id: 'FS2E.4', title: 'Schreiben', competencies: [
        { code: 'FS2E.4.A.1', texts: { 2: 'Ich beschrifte Bilder, führe Listen und halte das Wichtigste einer Geschichte fest.', 3: 'Ich schreibe kurze Geschichten und Berichte in einfachen Sätzen.' } },
        { code: 'FS2E.4.A.2', texts: { 2: 'Ich experimentiere beim Schreiben spielerisch mit Gestaltungsmitteln.', 3: 'Ich gestalte eigene Texte kreativ und erziele eine Wirkung.' } },
        { code: 'FS2E.4.B.1', texts: { 2: 'Ich nutze mit Unterstützung Tricks, die mir beim Schreiben helfen.', 3: 'Ich weiss, welche Schreibtricks mir helfen, und setze sie ein.' } },
        { code: 'FS2E.4.C.1', texts: { 2: 'Ich halte zu deutschen Texten Stichworte auf Englisch fest.', 3: 'Ich gebe deutsche Mitteilungen in kurzen Notizen auf Englisch wieder.' } },
      ]},
      { id: 'FS2E.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS2E.5.A.1', texts: { 2: 'Ich nehme wahr, wo um mich herum mehrere Sprachen gesprochen werden.', 3: 'Ich kenne die Sprachenvielfalt in der Schweiz, in Europa und der Welt.' } },
        { code: 'FS2E.5.A.2', texts: { 2: 'Ich entdecke Unterschiede und Ähnlichkeiten zwischen Sprachen.', 3: 'Ich nehme verschiedene Varianten des Englischen in der Welt wahr.' } },
        { code: 'FS2E.5.B.1', texts: { 2: 'Ich kenne häufige Wörter und Wendungen für den Alltag.', 3: 'Ich kenne genug Wörter, um über viele Themen zu reden und zu schreiben.' } },
        { code: 'FS2E.5.B.2', texts: { 2: 'Ich probiere Techniken aus, um neue Wörter zu lernen.', 3: 'Ich wähle die Lerntechniken aus, die zu mir passen.' } },
        { code: 'FS2E.5.C.1', texts: { 2: 'Ich spreche vertraute Wörter so aus, dass man mich versteht.', 3: 'Ich spreche verständlich, auch wenn man meinen Akzent hört.' } },
        { code: 'FS2E.5.C.2', texts: { 2: 'Ich erkenne typische englische Laute.', 3: 'Ich verbinde Schriftbilder mit der richtigen Aussprache und leite Regeln ab.' } },
        { code: 'FS2E.5.D.1', texts: { 2: 'Ich verwende einfache grammatische Strukturen, auch wenn noch Fehler passieren.', 3: 'Ich verwende einfache Grammatik zunehmend sicher beim Sprechen und Schreiben.' } },
        { code: 'FS2E.5.D.2', texts: { 2: 'Ich erforsche einzelne grammatische Strukturen und vergleiche sie mit anderen Sprachen.', 3: 'Ich untersuche auch komplexere Grammatik und leite Regeln ab.' } },
        { code: 'FS2E.5.E.1', texts: { 2: 'Ich schreibe Wendungen und kurze Sätze korrekt ab.', 3: 'Ich schreibe kürzere Texte zu vertrauten Themen ziemlich korrekt.' } },
        { code: 'FS2E.5.E.2', texts: { 2: 'Ich erforsche einfache Rechtschreiberegeln des Englischen.', 3: 'Ich leite häufige Rechtschreiberegeln ab und überprüfe meine Texte.' } },
        { code: 'FS2E.5.F.1', texts: { 2: 'Ich schätze mit Unterstützung meinen Lernstand ein und setze mir Ziele.', 3: 'Ich schätze meine Fortschritte ein und plane mein Sprachenlernen selbst.' } },
      ]},
      { id: 'FS2E.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS2E.6.A.1', texts: { 2: 'Ich kenne Gemeinsamkeiten und Unterschiede zwischen meiner Kultur und der englischsprachigen Welt.', 3: 'Ich kenne kulturelle Eigenheiten und bekannte Werke der englischsprachigen Welt.' } },
        { code: 'FS2E.6.B.1', texts: { 2: 'Ich drücke aus, wie ich fremde Sprachen und Kulturen erlebe.', 3: 'Ich denke darüber nach, wozu mir Englisch nützt.' } },
        { code: 'FS2E.6.C.1', texts: { 2: 'Ich vergleiche den Alltag in der englischsprachigen Welt mit meinem.', 3: 'Ich begegne Menschen und Werken aus der englischsprachigen Welt und lerne daraus.' } },
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
        { code: 'FS3I.1.A.1', texts: { 3: 'Ich verstehe kurze, einfache Hörtexte zu vertrauten Themen, wenn langsam gesprochen wird.' } },
        { code: 'FS3I.1.A.2', texts: { 3: 'Ich tauche in italienische Hörtexte ein und entdecke, was mir gefällt.' } },
        { code: 'FS3I.1.B.1', texts: { 3: 'Ich nutze Tricks, um beim Zuhören mehr zu verstehen.' } },
        { code: 'FS3I.1.C.1', texts: { 3: 'Ich gebe die Hauptaussagen aus kurzen Mitteilungen auf Deutsch wieder.' } },
      ]},
      { id: 'FS3I.2', title: 'Lesen', competencies: [
        { code: 'FS3I.2.A.1', texts: { 3: 'Ich verstehe kurze, einfache Geschichten und Texte zu vertrauten Themen.' } },
        { code: 'FS3I.2.A.2', texts: { 3: 'Ich entdecke in einfachen italienischen Texten, wie sie gestaltet sind.' } },
        { code: 'FS3I.2.B.1', texts: { 3: 'Ich nutze Tricks, um beim Lesen mehr zu verstehen.' } },
        { code: 'FS3I.2.C.1', texts: { 3: 'Ich gebe die Hauptaussagen aus kurzen Texten auf Deutsch wieder.' } },
      ]},
      { id: 'FS3I.3', title: 'Sprechen', competencies: [
        { code: 'FS3I.3.A.1', texts: { 3: 'Ich tausche im Alltag mit einfachen Worten Informationen aus.' } },
        { code: 'FS3I.3.B.1', texts: { 3: 'Ich stelle mich vor und spreche mit einfachen Sätzen über vertraute Themen.' } },
        { code: 'FS3I.3.B.2', texts: { 3: 'Ich trage einfache Texte kreativ vor.' } },
        { code: 'FS3I.3.C.1', texts: { 3: 'Ich nutze Tricks, damit das Sprechen auf Italienisch klappt.' } },
        { code: 'FS3I.3.D.1', texts: { 3: 'Ich gebe deutsche Mitteilungen sinngemäss auf Italienisch wieder.' } },
      ]},
      { id: 'FS3I.4', title: 'Schreiben', competencies: [
        { code: 'FS3I.4.A.1', texts: { 3: 'Ich schreibe kurze, einfache Texte über mich und meinen Alltag.' } },
        { code: 'FS3I.4.A.2', texts: { 3: 'Ich experimentiere beim Schreiben spielerisch mit Gestaltungsmitteln.' } },
        { code: 'FS3I.4.B.1', texts: { 3: 'Ich nutze Tricks, die mir beim Schreiben helfen.' } },
        { code: 'FS3I.4.C.1', texts: { 3: 'Ich halte zu deutschen Texten Stichworte auf Italienisch fest.' } },
      ]},
      { id: 'FS3I.5', title: 'Sprache(n) im Fokus', competencies: [
        { code: 'FS3I.5.A.1', texts: { 3: 'Ich entdecke Unterschiede und Ähnlichkeiten zwischen Sprachen.' } },
        { code: 'FS3I.5.B.1', texts: { 3: 'Ich kenne häufige italienische Wörter und Wendungen für den Alltag.' } },
        { code: 'FS3I.5.B.2', texts: { 3: 'Ich probiere Techniken aus, um neue Wörter zu lernen.' } },
        { code: 'FS3I.5.C.1', texts: { 3: 'Ich spreche vertraute Wörter so aus, dass man mich versteht.' } },
        { code: 'FS3I.5.C.2', texts: { 3: 'Ich erkenne typische italienische Laute und Ausspracheregeln.' } },
        { code: 'FS3I.5.D.1', texts: { 3: 'Ich verwende einfache grammatische Strukturen, auch wenn noch Fehler passieren.' } },
        { code: 'FS3I.5.D.2', texts: { 3: 'Ich vergleiche italienische Grammatik mit anderen Sprachen.' } },
        { code: 'FS3I.5.E.1', texts: { 3: 'Ich schreibe Wendungen und kurze Sätze korrekt.' } },
        { code: 'FS3I.5.E.2', texts: { 3: 'Ich erforsche einfache Rechtschreiberegeln des Italienischen.' } },
        { code: 'FS3I.5.F.1', texts: { 3: 'Ich setze mir Ziele beim Italienischlernen und schätze meine Fortschritte ein.' } },
      ]},
      { id: 'FS3I.6', title: 'Kulturen im Fokus', competencies: [
        { code: 'FS3I.6.A.1', texts: { 3: 'Ich kenne Eigenheiten der italienischsprachigen Welt und der italienischen Schweiz.' } },
        { code: 'FS3I.6.B.1', texts: { 3: 'Ich denke darüber nach, wozu mir Italienisch nützt.' } },
        { code: 'FS3I.6.C.1', texts: { 3: 'Ich begegne Menschen und Werken aus der italienischsprachigen Welt.' } },
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
        { code: 'MA.1.A.1', texts: { 1: 'Ich verstehe plus, minus und mal und lese und schreibe Zahlen bis 100.', 2: 'Ich kenne Begriffe wie Summe, Produkt, Bruch und Prozent und lese Zahlen bis 1 Million.', 3: 'Ich verstehe Variablen, Potenzen und Wurzeln und lese sehr grosse Zahlen.' } },
        { code: 'MA.1.A.2', texts: { 1: 'Ich zähle vorwärts und rückwärts bis 100 und ordne Zahlen.', 2: 'Ich zähle in Schritten bis 1 Million, ordne Brüche und Dezimalzahlen und überschlage Ergebnisse.', 3: 'Ich ordne positive und negative Zahlen und überschlage auch mit Dezimalzahlen.' } },
        { code: 'MA.1.A.3', texts: { 1: 'Ich rechne plus und minus bis 100.', 2: 'Ich rechne schriftlich und im Kopf, auch mit Dezimalzahlen, und kenne das Einmaleins.', 3: 'Ich rechne mit rationalen Zahlen, Potenzen und Wurzeln, auch mit dem Rechner.' } },
        { code: 'MA.1.A.4', texts: { 1: 'Ich zerlege Zahlen und nutze Umkehraufgaben, zum Beispiel plus und minus.', 2: 'Ich erkenne teilbare Zahlen, runde und löse einfache Gleichungen.', 3: 'Ich forme Terme mit Variablen um und löse Gleichungen.' } },
        { code: 'MA.1.B.1', texts: { 1: 'Ich erforsche Muster in Plus- und Minusrechnungen bis 100.', 2: 'Ich probiere, suche Beispiele und untersuche Regelmässigkeiten in Zahlen.', 3: 'Ich erforsche Zusammenhänge in Zahlen und Termen und übertrage sie auf neue Beispiele.' } },
        { code: 'MA.1.B.2', texts: { 1: 'Ich überprüfe Rechnungen mit Material und Umkehraufgaben.', 2: 'Ich überprüfe Ergebnisse durch Überschlagen, Zerlegen und Umkehren.', 3: 'Ich überprüfe algebraische Aussagen, zum Beispiel durch Einsetzen von Zahlen.' } },
        { code: 'MA.1.B.3', texts: { 1: 'Ich nutze Punktefeld, Hunderter-Tafel und Zahlenstrahl zum Erforschen.', 2: 'Ich nutze Stellenwerttafel und Computer, um Zahlenmuster zu erforschen.', 3: 'Ich nutze Formelsammlung, Internet und Tabellenkalkulation für Zahlenaufgaben.' } },
        { code: 'MA.1.C.1', texts: { 1: 'Ich zeige und erkläre meine Rechenwege bei plus und minus.', 2: 'Ich stelle Rechenwege dar und vollziehe die Wege anderer nach, auch mit Dezimalzahlen.', 3: 'Ich stelle Operationen mit Zahlen und Variablen dar und verallgemeinere sie.' } },
        { code: 'MA.1.C.2', texts: { 1: 'Ich stelle Anzahlen und Rechnungen mit Bildern und Material dar.', 2: 'Ich veranschauliche Zahlenfolgen, Brüche und Gesetzmässigkeiten mit Beispielen.', 3: 'Ich übersetze Figurenfolgen in Terme und deute Terme geometrisch.' } },
      ]},
      { id: 'MA.2', title: 'Form und Raum', competencies: [
        { code: 'MA.2.A.1', texts: { 1: 'Ich kenne Kreis, Dreieck, Quadrat und Würfel und beschreibe Raumlagen wie neben und unter.', 2: 'Ich kenne Begriffe wie Seite, Radius, Flächeninhalt und parallel.', 3: 'Ich kenne Begriffe wie Winkelhalbierende, Prisma und Kongruenz.' } },
        { code: 'MA.2.A.2', texts: { 1: 'Ich zeichne Figuren nach, spiegle sie und lege Muster.', 2: 'Ich vergrössere, verkleinere und spiegle Figuren, auch mit dem Geodreieck.', 3: 'Ich drehe, spiegle, verschiebe und strecke Figuren, auch im Koordinatensystem.' } },
        { code: 'MA.2.A.3', texts: { 1: 'Ich vergleiche und messe Längen auf den Zentimeter genau.', 2: 'Ich berechne Umfang und Flächeninhalt von Rechtecken und das Volumen von Quadern.', 3: 'Ich berechne Kreise, Prismen und Pyramiden und nutze den Satz des Pythagoras.' } },
        { code: 'MA.2.B.1', texts: { 1: 'Ich entdecke Symmetrien mit dem Spiegel und an Figuren.', 2: 'Ich verändere Figuren systematisch und formuliere Vermutungen.', 3: 'Ich erforsche Beziehungen zwischen Winkeln, Längen und Flächen.' } },
        { code: 'MA.2.B.2', texts: { 1: 'Ich erforsche und beschreibe Eigenschaften von Figuren und Körpern.', 2: 'Ich überprüfe Aussagen und Formeln zu Quadrat, Rechteck und Kreis.', 3: 'Ich erkläre Formeln an Beispielen und begründe geometrische Aussagen.' } },
        { code: 'MA.2.C.1', texts: { 1: 'Ich baue vorgegebene Körper mit Bauklötzen nach.', 2: 'Ich skizziere Würfel und Quader und stelle ihre Netze her.', 3: 'Ich zeichne Körper im Schrägbild und in verschiedenen Ansichten.' } },
        { code: 'MA.2.C.2', texts: { 1: 'Ich falte Quadrate, Rechtecke und Kreise in gleich grosse Teile.', 2: 'Ich zeichne mit Raster, Zirkel und Geodreieck.', 3: 'Ich konstruiere Figuren mit Zirkel, Geodreieck oder Geometriesoftware.' } },
        { code: 'MA.2.C.3', texts: { 1: 'Ich zeichne oder baue Figuren aus der Erinnerung nach.', 2: 'Ich zerlege und verbinde Körper in der Vorstellung.', 3: 'Ich drehe und verschiebe Figuren und Körper im Kopf.' } },
        { code: 'MA.2.C.4', texts: { 1: 'Ich bestimme Positionen in einem Feld mit Koordinaten.', 2: 'Ich zeichne Figuren nach Koordinaten und lese Pläne.', 3: 'Ich arbeite im Koordinatensystem, auch mit negativen Zahlen und Massstab.' } },
      ]},
      { id: 'MA.3', title: 'Grössen, Funktionen, Daten und Zufall', competencies: [
        { code: 'MA.3.A.1', texts: { 1: 'Ich kenne Meter, Zentimeter, Stunden, Minuten, Franken und Rappen.', 2: 'Ich kenne Masseinheiten, Diagramme, Mittelwert und Proportionalität.', 3: 'Ich verstehe Begriffe wie Zins, Rabatt, Steigung und Häufigkeit.' } },
        { code: 'MA.3.A.2', texts: { 1: 'Ich schätze und messe Längen und rechne mit Geldbeträgen und Uhrzeiten.', 2: 'Ich schätze, messe, runde und rechne mit Geld, Längen, Gewichten und Zeiten.', 3: 'Ich nutze das Einheitensystem und rechne Grössen von einer Einheit in eine andere um.' } },
        { code: 'MA.3.A.3', texts: { 1: 'Ich führe Zahlenfolgen und Wertetabellen weiter.', 2: 'Ich erfasse Zusammenhänge in Wertetabellen und rechne mit Proportionen.', 3: 'Ich bestimme Funktionswerte aus Tabelle, Graph und Gleichung.' } },
        { code: 'MA.3.B.1', texts: { 1: 'Ich erforsche Anzahlen, Preise, Zeiten und Längen in Alltagssituationen.', 2: 'Ich stelle Fragen zu Grössen und überprüfe Zusammenhänge.', 3: 'Ich überprüfe funktionale Zusammenhänge mit Tabellen und Graphen.' } },
        { code: 'MA.3.B.2', texts: { 1: 'Ich probiere Anordnungen aus, ordne und notiere sie.', 2: 'Ich erforsche Kombinationen und schreibe alle Möglichkeiten systematisch auf.', 3: 'Ich überprüfe Wahrscheinlichkeiten und statistische Angaben.' } },
        { code: 'MA.3.C.1', texts: { 1: 'Ich sammle, ordne und deute Anzahlen, Längen und Preise.', 2: 'Ich stelle Daten in Tabellen und Diagrammen dar und bestimme Mittelwerte.', 3: 'Ich werte Daten aus, auch mit dem Computer, und führe Zufallsexperimente durch.' } },
        { code: 'MA.3.C.2', texts: { 1: 'Ich übersetze Rechengeschichten in Rechnungen und löse sie.', 2: 'Ich erkenne Proportionalität in Sachaufgaben und nutze Tabellen und Diagramme.', 3: 'Ich ordne Sachtexten Tabellen, Terme und Graphen zu und interpretiere sie.' } },
        { code: 'MA.3.C.3', texts: { 1: 'Ich erfinde zu Rechnungen passende Geschichten und Bilder.', 2: 'Ich gebe Termen und Tabellen eine Bedeutung aus dem Alltag.', 3: 'Ich verbinde Formeln und Funktionsgleichungen mit Alltagssituationen.' } },
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
        { code: 'NMG.1.1', texts: { 1: 'Ich beschreibe, was mich ausmacht, und benenne Gefühle und Interessen.', 2: 'Ich kenne meine Fähigkeiten und erzähle von meinem Leben und meinen Zukunftsplänen.' } },
        { code: 'NMG.1.2', texts: { 1: 'Ich schütze mich vor Gefahren und sage Nein bei unangenehmen Berührungen.', 2: 'Ich weiss, wie ich gesund bleibe, und erkenne Gefahren wie Sucht.' } },
        { code: 'NMG.1.3', texts: { 1: 'Ich untersuche Lebensmittel und helfe, eine Mahlzeit zuzubereiten.', 2: 'Ich weiss, woher Lebensmittel kommen und was zu einer ausgewogenen Ernährung gehört.' } },
        { code: 'NMG.1.4', texts: { 1: 'Ich benenne Körperteile und weiss, wozu sie dienen.', 2: 'Ich erkläre, wie Organe wie Herz, Lunge und Skelett zusammenspielen.' } },
        { code: 'NMG.1.5', texts: { 1: 'Ich beobachte, wie ich wachse und mich entwickle.', 2: 'Ich verstehe, was in der Pubertät geschieht, und weiss über Zeugung und Geburt Bescheid.' } },
        { code: 'NMG.1.6', texts: { 1: 'Ich beschreibe Rollen von Mädchen und Jungen und weiss, dass alle die gleichen Rechte haben.', 2: 'Ich hinterfrage Geschlechterrollen und erkenne Klischees im Alltag und in Medien.' } },
      ]},
      { id: 'NMG.2', title: 'Tiere, Pflanzen und Lebensräume', competencies: [
        { code: 'NMG.2.1', texts: { 1: 'Ich ordne Tiere und Pflanzen ihren Lebensräumen zu.', 2: 'Ich erkläre, wie Tiere und Pflanzen in ihren Lebensräumen voneinander abhängen.' } },
        { code: 'NMG.2.2', texts: { 1: 'Ich erkenne, dass Pflanzen und Tiere Sonne, Luft, Wasser und Boden brauchen.', 2: 'Ich erkläre, wie Licht, Wasser und Boden das Leben von Pflanzen und Tieren prägen.' } },
        { code: 'NMG.2.3', texts: { 1: 'Ich beobachte und zeichne, wie Pflanzen und Tiere wachsen.', 2: 'Ich beschreibe Fortpflanzung und Entwicklung von Tieren und Pflanzen, zum Beispiel bei Amphibien.' } },
        { code: 'NMG.2.4', texts: { 1: 'Ich ordne Tiere und Pflanzen nach ihren Merkmalen, zum Beispiel Laub- und Nadelbäume.', 2: 'Ich ordne Pflanzen, Pilze und Tiere und begründe meine Ordnung.' } },
        { code: 'NMG.2.5', texts: { 1: 'Ich erzähle meine Vorstellungen, wie Erde und Lebewesen entstanden sind.', 2: 'Ich ordne die Entwicklung der Erde und der Lebewesen zeitlich ein.' } },
        { code: 'NMG.2.6', texts: { 1: 'Ich vergleiche natürliche und vom Menschen gemachte Lebensräume.', 2: 'Ich beurteile, wie Menschen Pflanzen, Tiere und Lebensräume beeinflussen.' } },
      ]},
      { id: 'NMG.3', title: 'Stoffe, Energie und Bewegungen', competencies: [
        { code: 'NMG.3.1', texts: { 1: 'Ich probiere Kräfte und Gleichgewicht aus und beschreibe ihre Wirkung.', 2: 'Ich messe Zeiten und Strecken und vergleiche Geschwindigkeiten.' } },
        { code: 'NMG.3.2', texts: { 1: 'Ich beschreibe, wo im Alltag Energie vorkommt.', 2: 'Ich erkenne Energieformen und Energiewandler und verhalte mich energiebewusst.' } },
        { code: 'NMG.3.3', texts: { 1: 'Ich erforsche Stoffe und beschreibe ihre Eigenschaften und Gefahren.', 2: 'Ich untersuche Stoffe mit Versuchen und dokumentiere die Ergebnisse.' } },
        { code: 'NMG.3.4', texts: { 1: 'Ich bearbeite und verändere Stoffe und berichte, wie ich es gemacht habe.', 2: 'Ich beschreibe, wie man Stoffe trennt und verändert und wozu das dient.' } },
      ]},
      { id: 'NMG.4', title: 'Phänomene der Natur', competencies: [
        { code: 'NMG.4.1', texts: { 1: 'Ich erforsche meine Sinne, zum Beispiel Hören, Sehen und Riechen.', 2: 'Ich weiss, was Sinne leisten und was passiert, wenn einer beeinträchtigt ist.' } },
        { code: 'NMG.4.2', texts: { 1: 'Ich erkunde Geräusche und Schallquellen.', 2: 'Ich erforsche, wie Töne durch Schwingungen entstehen, und schütze mein Gehör.' } },
        { code: 'NMG.4.3', texts: { 1: 'Ich untersuche Licht und Schatten.', 2: 'Ich untersuche optische Phänomene und weiss, wie das Auge aufgebaut ist.' } },
        { code: 'NMG.4.4', texts: { 1: 'Ich beobachte das Wetter und kenne Verhaltensregeln bei Naturereignissen.', 2: 'Ich messe Wetterelemente, lese Wetterprognosen und verstehe Naturereignisse.' } },
        { code: 'NMG.4.5', texts: { 1: 'Ich beobachte Sonne, Mond und Sterne und beschreibe, was ich sehe.', 2: 'Ich erkläre mit Modellen, wie sich Erde, Mond und Planeten bewegen.' } },
      ]},
      { id: 'NMG.5', title: 'Technische Entwicklungen', competencies: [
        { code: 'NMG.5.1', texts: { 1: 'Ich probiere aus, wie Alltagsgeräte funktionieren, und baue sie modellartig nach.', 2: 'Ich erkenne technische Prinzipien bei Geräten, Bauten und Anlagen.' } },
        { code: 'NMG.5.2', texts: { 1: 'Ich baue einfache Stromkreise und untersuche Magnete.', 2: 'Ich lese einfache Schaltpläne und baue Elektromagnete.' } },
        { code: 'NMG.5.3', texts: { 1: 'Ich erzähle, wozu uns Geräte im Alltag dienen.', 2: 'Ich vergleiche Technik von früher und heute und schätze ihre Folgen ein.' } },
      ]},
      { id: 'NMG.6', title: 'Arbeit, Produktion und Konsum', competencies: [
        { code: 'NMG.6.1', texts: { 1: 'Ich beschreibe Hausarbeit, Erwerbsarbeit und Freiwilligenarbeit.', 2: 'Ich erkunde Arbeitsplätze und Arbeitsformen und vergleiche sie.' } },
        { code: 'NMG.6.2', texts: { 1: 'Ich sammle Informationen über Berufe und ordne sie.', 2: 'Ich vergleiche Berufe und kenne ihre Ausbildungswege.' } },
        { code: 'NMG.6.3', texts: { 1: 'Ich verfolge, wie aus Rohstoffen Produkte werden.', 2: 'Ich beschreibe den Weg von Gütern von der Produktion bis zu uns.' } },
        { code: 'NMG.6.4', texts: { 1: 'Ich erkunde Tauschen, Kaufen und Verkaufen und die Funktion von Geld.', 2: 'Ich kenne den einfachen Wirtschaftskreislauf und verstehe, wie Preise entstehen.' } },
        { code: 'NMG.6.5', texts: { 1: 'Ich plane einen Einkauf und wäge Kosten und Nutzen ab.', 2: 'Ich prüfe Konsumentscheidungen und unterscheide Wünsche von Bedürfnissen.' } },
      ]},
      { id: 'NMG.7', title: 'Lebensweisen und Lebensräume von Menschen', competencies: [
        { code: 'NMG.7.1', texts: { 1: 'Ich beschreibe den Alltag von Kindern und entdecke Vertrautes und Neues.', 2: 'Ich verstehe, was Herkunft bedeutet, und hinterfrage Vorurteile.' } },
        { code: 'NMG.7.2', texts: { 1: 'Ich lerne, wie Kinder in fernen Gebieten der Erde leben.', 2: 'Ich vergleiche Lebensweisen in der Welt und überprüfe meine Vorstellungen.' } },
        { code: 'NMG.7.3', texts: { 1: 'Ich beschreibe, wie Menschen, Güter und Nachrichten unterwegs sind.', 2: 'Ich vergleiche Mobilität früher und heute und denke über die Zukunft nach.' } },
        { code: 'NMG.7.4', texts: { 1: 'Ich beschreibe, wie ich mit Menschen und Produkten aus fernen Ländern verbunden bin.', 2: 'Ich setze mich mit Ungleichheiten und dem Zusammenleben auf der Erde auseinander.' } },
      ]},
      { id: 'NMG.8', title: 'Menschen nutzen Räume', competencies: [
        { code: 'NMG.8.1', texts: { 1: 'Ich erkunde und benenne, was es in meiner Umgebung gibt.', 2: 'Ich beschreibe typische Merkmale verschiedener Räume und Gebiete.' } },
        { code: 'NMG.8.2', texts: { 1: 'Ich benenne, wo ich mich gerne aufhalte und warum.', 2: 'Ich vergleiche mit Bildern und Karten, wie Menschen Räume nutzen.' } },
        { code: 'NMG.8.3', texts: { 1: 'Ich beobachte über längere Zeit, wie sich meine Umgebung verändert.', 2: 'Ich denke über Folgen von Veränderungen im Raum nach und entwickle Ideen.' } },
        { code: 'NMG.8.4', texts: { 1: 'Ich zeige auf Karten und dem Globus, wo Berge, Flüsse und Orte liegen.', 2: 'Ich setze Grössen und Entfernungen in Beziehung und orientiere mich auf Karten.' } },
        { code: 'NMG.8.5', texts: { 1: 'Ich finde Orte im Gelände mit einfachen Orientierungshilfen.', 2: 'Ich orientiere mich mit Karte und anderen Mitteln, zu Fuss, mit Velo und ÖV.' } },
      ]},
      { id: 'NMG.9', title: 'Zeit, Dauer und Wandel', competencies: [
        { code: 'NMG.9.1', texts: { 1: 'Ich verwende Zeitwörter, lese die Uhr und schätze Zeitdauern.', 2: 'Ich ordne Epochen wie Steinzeit, Antike und Mittelalter auf dem Zeitstrahl ein.' } },
        { code: 'NMG.9.2', texts: { 1: 'Ich beschreibe, was sich bei mir und meiner Familie verändert hat.', 2: 'Ich vergleiche das Leben früher und heute, zum Beispiel in der Steinzeit.' } },
        { code: 'NMG.9.3', texts: { 1: 'Ich gewinne aus Funden und alten Gegenständen Vorstellungen von früher.', 2: 'Ich erarbeite mir aus Quellen ein Bild einer vergangenen Epoche.' } },
        { code: 'NMG.9.4', texts: { 1: 'Ich unterscheide erfundene von wahren Geschichten.', 2: 'Ich erkläre, was Sagen und Mythen sind, und unterscheide sie von Geschichte.' } },
      ]},
      { id: 'NMG.10', title: 'Gemeinschaft und Gesellschaft', competencies: [
        { code: 'NMG.10.1', texts: { 1: 'Ich formuliere in Konflikten meine Bedürfnisse und suche faire Lösungen.', 2: 'Ich löse Konflikte fair und übernehme Mitverantwortung in der Klasse.' } },
        { code: 'NMG.10.2', texts: { 1: 'Ich erzähle, was Freundschaft ausmacht.', 2: 'Ich pflege Freundschaften auch in Konflikten und denke über Beziehungen nach.' } },
        { code: 'NMG.10.3', texts: { 1: 'Ich benenne Ämter und Einrichtungen in der Gemeinde.', 2: 'Ich weiss, welche Stellen wofür zuständig sind und wie die Gemeinde funktioniert.' } },
        { code: 'NMG.10.4', texts: { 1: 'Ich verstehe, wie wir in der Klasse fair entscheiden und Regeln einhalten.', 2: 'Ich erkläre an Beispielen, wie Macht, Recht und Staat zusammenhängen.' } },
        { code: 'NMG.10.5', texts: { 1: 'Ich setze mich für meine Interessen und die von anderen ein.', 2: 'Ich erkenne, wie politische Prozesse ablaufen und wie man mitwirken kann.' } },
      ]},
      { id: 'NMG.11', title: 'Grunderfahrungen, Werte und Normen', competencies: [
        { code: 'NMG.11.1', texts: { 1: 'Ich entdecke in Geschichten grosse Erfahrungen wie Freude, Streit und Abschied.', 2: 'Ich vergleiche, wie Menschen mit Glück, Leid und Abschied umgehen.' } },
        { code: 'NMG.11.2', texts: { 1: 'Ich staune, stelle grosse Fragen und denke darüber nach.', 2: 'Ich betrachte philosophische Fragen aus verschiedenen Blickwinkeln.' } },
        { code: 'NMG.11.3', texts: { 1: 'Ich beschreibe, was mir und anderen wertvoll ist, und denke über Regeln nach.', 2: 'Ich erkenne Werte im Handeln und vertrete, was mir wichtig ist.' } },
        { code: 'NMG.11.4', texts: { 1: 'Ich erkenne in Geschichten und im Alltag, was gerecht und ungerecht ist.', 2: 'Ich betrachte schwierige Situationen aus verschiedenen Sichten und beziehe Stellung.' } },
      ]},
      { id: 'NMG.12', title: 'Religionen und Weltsichten', competencies: [
        { code: 'NMG.12.1', texts: { 1: 'Ich entdecke Spuren von Religionen in meiner Umgebung, zum Beispiel Kirchen und Symbole.', 2: 'Ich erschliesse religiöse Spuren in Umgebung, Sprache und Medien.' } },
        { code: 'NMG.12.2', texts: { 1: 'Ich erzähle Geschichten aus der Bibel und anderen Religionen nach.', 2: 'Ich erkläre, wie heilige Schriften wie Bibel, Torah und Koran verwendet werden.' } },
        { code: 'NMG.12.3', texts: { 1: 'Ich erkenne Rituale im Alltag und beschreibe ihre Wirkung.', 2: 'Ich beschreibe und vergleiche Rituale und Bräuche verschiedener Religionen.' } },
        { code: 'NMG.12.4', texts: { 1: 'Ich erzähle von Festen und beschreibe ihre Merkmale.', 2: 'Ich kenne Hauptfeste des Kirchenjahres und Feste verschiedener Religionen.' } },
        { code: 'NMG.12.5', texts: { 1: 'Ich nehme wahr, wie sich Religionen im Leben von Menschen zeigen.', 2: 'Ich beschreibe und unterscheide Religionen und sehe Gemeinsamkeiten.' } },
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
        { code: 'NT.1.1', texts: { 3: 'Ich kann beschreiben, wie Forschende zu Erkenntnissen kommen.' } },
        { code: 'NT.1.2', texts: { 3: 'Ich kann Alltagsgeräte bedienen und erklären, wie sie funktionieren.' } },
        { code: 'NT.1.3', texts: { 3: 'Ich diskutiere, wie nachhaltig Technik und ihre Anwendungen sind.' } },
      ]},
      { id: 'NT.2', title: 'Stoffe untersuchen und gewinnen', competencies: [
        { code: 'NT.2.1', texts: { 3: 'Ich untersuche Stoffe und ordne sie nach ihren Eigenschaften.' } },
        { code: 'NT.2.2', texts: { 3: 'Ich kann Stoffgemische gezielt trennen.' } },
      ]},
      { id: 'NT.3', title: 'Chemische Reaktionen erforschen', competencies: [
        { code: 'NT.3.1', texts: { 3: 'Ich untersuche, wie sich Stoffe bei chemischen Reaktionen verwandeln.' } },
        { code: 'NT.3.2', texts: { 3: 'Ich kann chemische Reaktionen mit Modellen und dem Periodensystem erklären.' } },
        { code: 'NT.3.3', texts: { 3: 'Ich verstehe Stoffkreisläufe und gehe sorgsam mit Ressourcen um.' } },
      ]},
      { id: 'NT.4', title: 'Energie', competencies: [
        { code: 'NT.4.1', texts: { 3: 'Ich kann Energieformen und ihre Umwandlungen analysieren.' } },
        { code: 'NT.4.2', texts: { 3: 'Ich verstehe, wie Energie gespeichert und transportiert wird.' } },
      ]},
      { id: 'NT.5', title: 'Mechanik und Elektrizität', competencies: [
        { code: 'NT.5.1', texts: { 3: 'Ich analysiere Bewegungen und die Wirkung von Kräften.' } },
        { code: 'NT.5.2', texts: { 3: 'Ich verstehe die Grundlagen der Elektrizität und wende sie an.' } },
        { code: 'NT.5.3', texts: { 3: 'Ich untersuche elektrische und elektronische Schaltungen.' } },
      ]},
      { id: 'NT.6', title: 'Sinne und Signale', competencies: [
        { code: 'NT.6.1', texts: { 3: 'Ich verstehe, wie Sinnesreize im Körper verarbeitet werden.' } },
        { code: 'NT.6.2', texts: { 3: 'Ich kann erklären, wie Hören und Sehen funktionieren.' } },
        { code: 'NT.6.3', texts: { 3: 'Ich untersuche Licht und optische Phänomene.' } },
      ]},
      { id: 'NT.7', title: 'Körperfunktionen', competencies: [
        { code: 'NT.7.1', texts: { 3: 'Ich kann Aufbau und Funktionen des Körpers erklären.' } },
        { code: 'NT.7.2', texts: { 3: 'Ich verstehe den Stoffwechsel und trage Sorge zu meinem Körper.' } },
        { code: 'NT.7.3', texts: { 3: 'Ich weiss Bescheid über Fortpflanzung, Verhütung und übertragbare Krankheiten.' } },
        { code: 'NT.7.4', texts: { 3: 'Ich kann Massnahmen gegen häufige Krankheiten beurteilen.' } },
      ]},
      { id: 'NT.8', title: 'Fortpflanzung und Entwicklung', competencies: [
        { code: 'NT.8.1', texts: { 3: 'Ich verstehe, wie die Artenvielfalt mit der Evolution zusammenhängt.' } },
        { code: 'NT.8.2', texts: { 3: 'Ich kann erklären, wie Lebewesen wachsen und sich entwickeln.' } },
        { code: 'NT.8.3', texts: { 3: 'Ich verstehe Grundlagen der Genetik.' } },
      ]},
      { id: 'NT.9', title: 'Ökosysteme', competencies: [
        { code: 'NT.9.1', texts: { 3: 'Ich untersuche Gewässer und ihre Lebenswelt.' } },
        { code: 'NT.9.2', texts: { 3: 'Ich erkenne, wie Ökosysteme zusammenwirken.' } },
        { code: 'NT.9.3', texts: { 3: 'Ich schätze ein, wie der Mensch Ökosysteme beeinflusst.' } },
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
        { code: 'WAH.1.1', texts: { 3: 'Ich denke darüber nach, was Arbeit für Menschen und die Gesellschaft bedeutet.' } },
        { code: 'WAH.1.2', texts: { 3: 'Ich vergleiche Anforderungen in verschiedenen Arbeitswelten.' } },
        { code: 'WAH.1.3', texts: { 3: 'Ich vergleiche, wie Güter und Dienstleistungen hergestellt werden.' } },
      ]},
      { id: 'WAH.2', title: 'Märkte, Handel und Geld', competencies: [
        { code: 'WAH.2.1', texts: { 3: 'Ich kann Grundprinzipien der Marktwirtschaft aufzeigen, zum Beispiel Angebot und Nachfrage.' } },
        { code: 'WAH.2.2', texts: { 3: 'Ich kann erklären, warum Handel Güter verfügbar macht.' } },
        { code: 'WAH.2.3', texts: { 3: 'Ich gehe verantwortungsvoll mit Geld um.' } },
      ]},
      { id: 'WAH.3', title: 'Konsum gestalten', competencies: [
        { code: 'WAH.3.1', texts: { 3: 'Ich erkenne, was mein Einkaufen beeinflusst, zum Beispiel Werbung.' } },
        { code: 'WAH.3.2', texts: { 3: 'Ich analysiere, welche Folgen mein Konsum hat.' } },
        { code: 'WAH.3.3', texts: { 3: 'Ich treffe überlegte Konsumentscheidungen.' } },
      ]},
      { id: 'WAH.4', title: 'Ernährung und Gesundheit', competencies: [
        { code: 'WAH.4.1', texts: { 3: 'Ich weiss, was die Gesundheit beeinflusst, und gestalte meinen Alltag gesund.' } },
        { code: 'WAH.4.2', texts: { 3: 'Ich gestalte Essen und Trinken passend zur Situation.' } },
        { code: 'WAH.4.3', texts: { 3: 'Ich wähle Nahrungsmittel bewusst aus.' } },
        { code: 'WAH.4.4', texts: { 3: 'Ich kann gesunde Mahlzeiten zubereiten.' } },
        { code: 'WAH.4.5', texts: { 3: 'Ich verstehe globale Herausforderungen der Ernährung.' } },
      ]},
      { id: 'WAH.5', title: 'Haushalten und Zusammenleben', competencies: [
        { code: 'WAH.5.1', texts: { 3: 'Ich plane Alltagsarbeiten und führe sie zielgerichtet aus.' } },
        { code: 'WAH.5.2', texts: { 3: 'Ich kann mich über soziale, rechtliche und finanzielle Fragen des Alltags informieren.' } },
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
        { code: 'RZG.1.1', texts: { 3: 'Ich kann die Erde als Planeten beschreiben.' } },
        { code: 'RZG.1.2', texts: { 3: 'Ich kann Wetter und Klima analysieren.' } },
        { code: 'RZG.1.3', texts: { 3: 'Ich kann Naturereignisse wie Erdbeben und Vulkane erklären.' } },
        { code: 'RZG.1.4', texts: { 3: 'Ich untersuche Rohstoffe und Energieträger.' } },
      ]},
      { id: 'RZG.2', title: 'Lebensweisen und Lebensräume', competencies: [
        { code: 'RZG.2.1', texts: { 3: 'Ich verstehe, wie sich die Bevölkerung entwickelt und warum Menschen auswandern.' } },
        { code: 'RZG.2.2', texts: { 3: 'Ich vergleiche, wie Menschen in verschiedenen Lebensräumen leben.' } },
        { code: 'RZG.2.3', texts: { 3: 'Ich analysiere, wie sich Städte und ländliche Gebiete verändern.' } },
        { code: 'RZG.2.4', texts: { 3: 'Ich untersuche Mobilität und Verkehr.' } },
        { code: 'RZG.2.5', texts: { 3: 'Ich schätze die Bedeutung des Tourismus ein.' } },
      ]},
      { id: 'RZG.3', title: 'Mensch und Umwelt', competencies: [
        { code: 'RZG.3.1', texts: { 3: 'Ich erforsche natürliche Systeme und wie der Mensch sie nutzt.' } },
        { code: 'RZG.3.2', texts: { 3: 'Ich untersuche Wirtschaft und Globalisierung.' } },
        { code: 'RZG.3.3', texts: { 3: 'Ich verstehe, wie Raumplanung funktioniert.' } },
      ]},
      { id: 'RZG.4', title: 'Sich in Räumen orientieren', competencies: [
        { code: 'RZG.4.1', texts: { 3: 'Ich finde Orte, Länder und Gebirge auf der Karte.' } },
        { code: 'RZG.4.2', texts: { 3: 'Ich kann Karten und Orientierungsmittel auswerten.' } },
        { code: 'RZG.4.3', texts: { 3: 'Ich orientiere mich draussen im Gelände.' } },
      ]},
      { id: 'RZG.5', title: 'Schweiz in Tradition und Wandel', competencies: [
        { code: 'RZG.5.1', texts: { 3: 'Ich kann erklären, wie die Schweiz entstanden ist und sich entwickelt hat.' } },
        { code: 'RZG.5.2', texts: { 3: 'Ich zeige auf, wie wirtschaftlicher Wandel die Menschen in der Schweiz prägt.' } },
        { code: 'RZG.5.3', texts: { 3: 'Ich vergleiche den Alltag in der Schweiz in verschiedenen Jahrhunderten.' } },
      ]},
      { id: 'RZG.6', title: 'Weltgeschichte', competencies: [
        { code: 'RZG.6.1', texts: { 3: 'Ich kann Geschichte von der Neuzeit bis heute erzählen.' } },
        { code: 'RZG.6.2', texts: { 3: 'Ich beschreibe wichtige Entwicklungen und Umbrüche des 19. Jahrhunderts.' } },
        { code: 'RZG.6.3', texts: { 3: 'Ich analysiere Ereignisse des 20. und 21. Jahrhunderts und ihre Bedeutung für heute.' } },
      ]},
      { id: 'RZG.7', title: 'Geschichtskultur', competencies: [
        { code: 'RZG.7.1', texts: { 3: 'Ich lerne an Orten wie Museen, Burgen und Denkmälern.' } },
        { code: 'RZG.7.2', texts: { 3: 'Ich nutze Geschichte in Filmen, Büchern und Spielen, zum Lernen und zur Unterhaltung.' } },
        { code: 'RZG.7.3', texts: { 3: 'Ich gewinne aus Gesprächen mit Zeitzeugen Erkenntnisse über früher.' } },
      ]},
      { id: 'RZG.8', title: 'Demokratie und Menschenrechte', competencies: [
        { code: 'RZG.8.1', texts: { 3: 'Ich kann die Schweizer Demokratie erklären und mit anderen Systemen vergleichen.' } },
        { code: 'RZG.8.2', texts: { 3: 'Ich kann erklären, warum Menschenrechte wichtig sind und wie sie bedroht werden.' } },
        { code: 'RZG.8.3', texts: { 3: 'Ich beurteile die Rolle der Schweiz in Europa und der Welt.' } },
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
        { code: 'ERG.1.1', texts: { 3: 'Ich denke über grosse Erfahrungen des Lebens nach.' } },
        { code: 'ERG.1.2', texts: { 3: 'Ich stelle philosophische Fragen und denke über sie nach.' } },
      ]},
      { id: 'ERG.2', title: 'Werte und Normen', competencies: [
        { code: 'ERG.2.1', texts: { 3: 'Ich kann Werte und Normen erklären, prüfen und vertreten.' } },
        { code: 'ERG.2.2', texts: { 3: 'Ich hinterfrage Regeln und Handlungen und begründe meinen Standpunkt.' } },
      ]},
      { id: 'ERG.3', title: 'Religionen in Kultur und Gesellschaft', competencies: [
        { code: 'ERG.3.1', texts: { 3: 'Ich erkenne religiöse Motive im Alltag und in den Medien.' } },
        { code: 'ERG.3.2', texts: { 3: 'Ich schätze ein, welche Rolle Religionen in der Gesellschaft spielen.' } },
      ]},
      { id: 'ERG.4', title: 'Religionen und Weltsichten', competencies: [
        { code: 'ERG.4.1', texts: { 3: 'Ich kann erklären, wie religiöse Texte überliefert und verwendet werden.' } },
        { code: 'ERG.4.2', texts: { 3: 'Ich kann religiöse Rituale im Alltag erklären.' } },
        { code: 'ERG.4.3', texts: { 3: 'Ich kenne Festtraditionen und kann sie einordnen.' } },
        { code: 'ERG.4.4', texts: { 3: 'Ich orientiere mich in der Vielfalt der Religionen und begegne Überzeugungen mit Respekt.' } },
        { code: 'ERG.4.5', texts: { 3: 'Ich denke über Weltbilder nach, über Glauben und Wissen.' } },
      ]},
      { id: 'ERG.5', title: 'Ich und die Gemeinschaft', competencies: [
        { code: 'ERG.5.1', texts: { 3: 'Ich kenne meine Stärken und bringe sie ein.' } },
        { code: 'ERG.5.2', texts: { 3: 'Ich denke über Geschlecht und Rollen nach.' } },
        { code: 'ERG.5.3', texts: { 3: 'Ich denke über Beziehungen, Liebe und Sexualität nach und kenne meine Verantwortung.' } },
        { code: 'ERG.5.4', texts: { 3: 'Ich gestalte die Gemeinschaft aktiv mit.' } },
        { code: 'ERG.5.5', texts: { 3: 'Ich erkunde und respektiere verschiedene Lebenswelten.' } },
        { code: 'ERG.5.6', texts: { 3: 'Ich bringe Anliegen ein und suche bei Konflikten nach Lösungen.' } },
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
        { code: 'BG.1.A.1', texts: { 1: 'Ich entwickle Bildideen aus Erinnerungen und Wünschen.', 2: 'Ich baue Bildvorstellungen zu Vergangenem, Gegenwärtigem und Zukünftigem auf.', 3: 'Ich entwickle Bildvorstellungen aus Empfindungen, Fantasie und Wissen.' } },
        { code: 'BG.1.A.2', texts: { 1: 'Ich schaue genau hin und erzähle, was ich sehe und empfinde.', 2: 'Ich beobachte über längere Zeit und vergleiche meine Beobachtungen mit anderen.', 3: 'Ich analysiere Wahrnehmungen und betrachte Bilder aus verschiedenen Perspektiven.' } },
        { code: 'BG.1.A.3', texts: { 1: 'Ich beschreibe, welche Bilder, Farben und Formen mir gefallen.', 2: 'Ich beurteile Bilder und begründe meine Meinung.', 3: 'Ich analysiere Bilder nach Kriterien und begründe mein Urteil.' } },
        { code: 'BG.1.B.1', texts: { 1: 'Ich zeige meine Bilder und erzähle davon.', 2: 'Ich stelle meine Bilder aus und kommentiere sie mit Fachbegriffen.', 3: 'Ich dokumentiere meinen Arbeitsprozess in Bild und Wort und präsentiere ihn.' } },
      ]},
      { id: 'BG.2', title: 'Prozesse und Produkte', competencies: [
        { code: 'BG.2.A.1', texts: { 1: 'Ich entwickle Bildideen aus meiner Fantasie- und Lebenswelt.', 2: 'Ich entwickle Bildideen zu Natur, Kultur und Alltag.', 3: 'Ich entwickle Bildideen zu meinen Interessen und zur Gesellschaft.' } },
        { code: 'BG.2.A.2', texts: { 1: 'Ich sammle Materialien und Bilder, experimentiere und entdecke Neues.', 2: 'Ich begutachte die Wirkung meiner Bilder und arbeite gezielt weiter.', 3: 'Ich verfeinere meine Bildsprache und entwickle meine Bilder nach Kriterien weiter.' } },
        { code: 'BG.2.B.1', texts: { 1: 'Ich gestalte mit Punkten, Linien, Farben und Oberflächen erste Wirkungen.', 2: 'Ich mische Farben aus Grundfarben und gestalte Fläche und Raum bewusst.', 3: 'Ich setze Punkt, Linie, Farbe und Raum gezielt für die gewünschte Wirkung ein.' } },
        { code: 'BG.2.C.1', texts: { 1: 'Ich zeichne, male, drucke, collagiere und modelliere auf einfache Art.', 2: 'Ich nutze Verfahren wie Schablonendruck, Collage und Fotografie.', 3: 'Ich wähle Verfahren wie Druck, Montage, Plastik, Foto und Film gezielt aus.' } },
        { code: 'BG.2.C.2', texts: { 1: 'Ich entdecke Darstellungen durch Zerlegen, Vergrössern und Wiederholen.', 2: 'Ich probiere Abbilden, Verfremden und Umgestalten aus.', 3: 'Ich abstrahiere, reduziere, kombiniere und variiere bewusst.' } },
        { code: 'BG.2.D.1', texts: { 1: 'Ich probiere Stifte, Kreiden, Farben und plastische Materialien aus.', 2: 'Ich setze Bleistift, Gouache, Ton und weitere Materialien gezielt ein.', 3: 'Ich kenne Materialien und Werkzeuge und setze sie sachgerecht ein.' } },
      ]},
      { id: 'BG.3', title: 'Kontexte und Orientierung', competencies: [
        { code: 'BG.3.A.1', texts: { 1: 'Ich betrachte Kunstwerke und vergleiche sie mit eigenen Bildern.', 2: 'Ich kenne beispielhafte Kunstwerke aus Gegenwart und Vergangenheit.', 3: 'Ich deute Bildsprache und Stilmittel und ordne Kunstwerke kulturell ein.' } },
        { code: 'BG.3.B.1', texts: { 1: 'Ich beschreibe, wie Bilder auf mich wirken und was sie erzählen.', 2: 'Ich untersuche, was Bilder wollen: zeigen, informieren, auffordern.', 3: 'Ich analysiere Bildwirkung und erkenne, wie Bilder manipulieren können.' } },
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
        { code: 'TTG.1.A.1', texts: { 1: 'Ich beschreibe mit einfachen Worten, wie Alltagsgegenstände wirken und funktionieren.', 2: 'Ich beschreibe, wie Funktion, Konstruktion und Gestaltung bei Objekten zusammenspielen.', 3: 'Ich untersuche Funktion und Wirkung von Objekten zielgerichtet.' } },
        { code: 'TTG.1.B.1', texts: { 1: 'Ich erzähle, wie ich vorgegangen bin und ob ich zufrieden bin.', 2: 'Ich vergleiche mein Vorgehen und Produkt mit den Erwartungen und Kriterien.', 3: 'Ich analysiere Designprozesse und verbessere meine Produkte nach Kriterien.' } },
        { code: 'TTG.1.B.2', texts: { 1: 'Ich berichte vom Herstellen und zeige meine Produkte.', 2: 'Ich halte die Schritte des Designprozesses fest und stelle Produkte vor.', 3: 'Ich dokumentiere und präsentiere Prozess und Produkt nachvollziehbar.' } },
      ]},
      { id: 'TTG.2', title: 'Prozesse und Produkte', competencies: [
        { code: 'TTG.2.A.1', texts: { 1: 'Ich sammle und ordne Ideen zu einem Thema.', 2: 'Ich erfasse eine Aufgabe und ordne Ideen und Informationen nach Kriterien.', 3: 'Ich entwickle Ideen, recherchiere Informationen und bewerte sie.' } },
        { code: 'TTG.2.A.2', texts: { 1: 'Ich erkunde Materialien spielerisch und entwickle eigene Produktideen.', 2: 'Ich suche Lösungen und entwickle Produktideen weiter.', 3: 'Ich entwickle Produktideen nach eigenen Kriterien und probiere sie aus.' } },
        { code: 'TTG.2.A.3', texts: { 1: 'Ich stelle mit Anleitung eigene Produkte her.', 2: 'Ich plane Produkte nach Vorgaben und stelle sie her.', 3: 'Ich plane und fertige Produkte nach formalen und technischen Bedingungen.' } },
        { code: 'TTG.2.B.1', texts: { 1: 'Ich erfinde Spielobjekte, verkleide mich und probiere Bauen, Rollen und Batterien aus.', 2: 'Ich baue Konstruktionen mit Antrieben, Stromkreisen und stabilen Elementen.', 3: 'Ich analysiere Konstruktionen und baue Funktionsmodelle, auch mit Elektronik.' } },
        { code: 'TTG.2.C.1', texts: { 1: 'Ich unterscheide Materialien, Formen und Farben und wähle sie aus.', 2: 'Ich wähle Material, Form und Farbe bewusst für mein Produkt.', 3: 'Ich setze Material, Oberfläche, Form und Farbe gezielt für die Wirkung ein.' } },
        { code: 'TTG.2.D.1', texts: { 1: 'Ich übe Verfahren wie Schneiden, Falten, Kleben und Nähen von Hand.', 2: 'Ich arbeite zunehmend selbstständig: Sägen, Nähen, Stricken, Färben.', 3: 'Ich setze Verfahren wie Sägen, Bohren, Nähen und Sticken gezielt ein.' } },
        { code: 'TTG.2.E.1', texts: { 1: 'Ich gestalte mit Papier, Karton, Holz, Ton und Stoff und nutze Werkzeuge mit Anleitung.', 2: 'Ich kenne Materialeigenschaften und setze Werkzeuge und Maschinen korrekt ein.', 3: 'Ich wähle Materialien, Werkzeuge und Maschinen selbstständig und arbeite sachgerecht.' } },
      ]},
      { id: 'TTG.3', title: 'Kontexte und Orientierung', competencies: [
        { code: 'TTG.3.A.1', texts: { 1: 'Ich erkenne an Gegenständen Unterschiede zwischen früher und heute.', 2: 'Ich kenne kulturelle und geschichtliche Hintergründe von Objekten.', 3: 'Ich recherchiere kulturelle und historische Aspekte von Objekten und präsentiere sie.' } },
        { code: 'TTG.3.A.2', texts: { 1: 'Ich kenne Erfindungen aus meinem Alltag und sage, wozu sie dienen.', 2: 'Ich schätze ein, wie Erfindungen den Alltag verändern.', 3: 'Ich verstehe und bewerte Erfindungen und ihre Folgen.' } },
        { code: 'TTG.3.B.1', texts: { 2: 'Ich kenne Argumente zu Kauf und Nutzung von Produkten: Preis, Umwelt, Gesellschaft.', 3: 'Ich beurteile Rohstoffgewinnung und Produktion nach ihrer Nachhaltigkeit.' } },
        { code: 'TTG.3.B.2', texts: { 1: 'Ich erzähle, woraus Materialien wie Papier und Ton gemacht werden.', 2: 'Ich beschreibe die Herstellung von Materialien und entsorge sie richtig.', 3: 'Ich erkläre Herstellung und Gebrauch von Materialien und bewerte ihre Nachhaltigkeit.' } },
        { code: 'TTG.3.B.3', texts: { 1: 'Ich vergleiche Handarbeit mit der Herstellung in der Fabrik.', 2: 'Ich vergleiche Einzelstücke mit Serienprodukten.', 3: 'Ich bewerte handwerkliche und industrielle Produkte aus verschiedenen Blickwinkeln.' } },
        { code: 'TTG.3.B.4', texts: { 1: 'Ich bediene Alltagsgeräte sicher und sachgemäss.', 2: 'Ich nehme Geräte mit Hilfe der Anleitung in Betrieb.', 3: 'Ich nehme Geräte mit Anleitung und Montageplan sicher in Betrieb.' } },
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
        { code: 'MU.1.A.1', texts: { 1: 'Ich singe einstimmig in der Gruppe mit.', 2: 'Ich halte meine Stimme im Chor und folge Einsätzen, Tempo und Dynamik.', 3: 'Ich singe meine Stimme in mehrstimmigen Liedern sicher.' } },
        { code: 'MU.1.B.1', texts: { 1: 'Ich erkunde meine Stimme, singe kurze Tonfolgen und spreche Verse deutlich.', 2: 'Ich erzeuge mit meiner Stimme verschiedene Klangfarben und gestalte Texte rhythmisch.', 3: 'Ich erweitere und kräftige meine Stimme und rappe eigene Texte.' } },
        { code: 'MU.1.C.1', texts: { 1: 'Ich singe Kinderlieder in Mundart, Hochdeutsch und aus anderen Kulturen.', 2: 'Ich singe Lieder aus verschiedenen Kulturen und Stilen und deute ihre Eigenart.', 3: 'Ich singe Lieder aus vielen Stilen und beachte Sprache und Hintergrund.' } },
      ]},
      { id: 'MU.2', title: 'Hören und Sich-Orientieren', competencies: [
        { code: 'MU.2.A.1', texts: { 1: 'Ich höre genau hin und stelle Gehörtes in Bild und Bewegung dar.', 2: 'Ich verfolge musikalische Verläufe und erkenne musikalische Formen.', 3: 'Ich verfolge musikalische Aspekte bewusst und beschreibe Musikstücke.' } },
        { code: 'MU.2.B.1', texts: { 1: 'Ich erkenne bekannte Musik wieder und höre Neues offen an.', 2: 'Ich ordne Musikstücke Zeiten und Kulturen zu und kenne einige Komponistinnen und Komponisten.', 3: 'Ich recherchiere Musikkulturen und erkenne ihre Eigenheiten beim Hören.' } },
        { code: 'MU.2.C.1', texts: { 1: 'Ich erfasse musikalische Geschichten und spiele Situationen dazu.', 2: 'Ich ordne Musik Stimmungen zu und schütze mein Gehör vor lauter Musik.', 3: 'Ich erkenne, welche Funktion Musik in der Gesellschaft hat, und gehe achtsam mit meinem Gehör um.' } },
      ]},
      { id: 'MU.3', title: 'Bewegen und Tanzen', competencies: [
        { code: 'MU.3.A.1', texts: { 1: 'Ich stelle Kontraste und Übergänge in der Musik mit meinem Körper dar.', 2: 'Ich verbinde Puls, Atem und Körperspannung mit Musik.' } },
        { code: 'MU.3.B.1', texts: { 1: 'Ich finde zu einem Lied passende Bewegungen.', 2: 'Ich stelle Musik mit Bewegung, Objekten und Requisiten dar.', 3: 'Ich unterstütze Melodie, Rhythmus und Text mit Körpersprache.' } },
        { code: 'MU.3.C.1', texts: { 1: 'Ich tanze einfache Tänze in der Gruppe nach Vorlage.', 2: 'Ich setze Rhythmen in Bewegung um und kenne Grundschritte verschiedener Tanzstile.', 3: 'Ich tanze auch ungewohnte Taktarten und setze Tanzfiguren in Projekten ein.' } },
      ]},
      { id: 'MU.4', title: 'Musizieren', competencies: [
        { code: 'MU.4.A.1', texts: { 1: 'Ich spiele eine Begleitung und füge mich in die musizierende Gruppe ein.', 2: 'Ich spiele im Klassenensemble und passe mich Tempo und Ausdruck an.', 3: 'Ich spiele Rhythmus- und Melodiepatterns und musiziere nach Improvisationsvorlagen.' } },
        { code: 'MU.4.B.1', texts: { 1: 'Ich gestalte mit Instrumenten Stimmungen und Geschichten.', 2: 'Ich gestalte eigene Klangpartituren und experimentiere mit elektronischen Medien.', 3: 'Ich entwickle musikalische Spannungsverläufe und nehme Klänge auf und verändere sie.' } },
        { code: 'MU.4.C.1', texts: { 1: 'Ich kenne die Schulinstrumente und spiele achtsam damit.', 2: 'Ich unterscheide Instrumentengruppen und verstehe, wie Klang entsteht.', 3: 'Ich erkenne Instrumente in Musikstücken, auch in notierten.' } },
      ]},
      { id: 'MU.5', title: 'Gestaltungsprozesse', competencies: [
        { code: 'MU.5.A.1', texts: { 1: 'Ich entwickle zu Themen aus meiner Welt eine Klanggeschichte.', 2: 'Ich entwickle zu Themen eine einfache eigene Musik.', 3: 'Ich produziere eine musikalische Collage oder einen Videoclip zu einem Thema.' } },
        { code: 'MU.5.B.1', texts: { 1: 'Ich versetze mich in Musik hinein und gestalte Rollen dazu.', 2: 'Ich entwickle zu Musik eine bildnerische, theatralische oder tänzerische Gestaltung.', 3: 'Ich setze Assoziationen zu Musik in eigene Darstellungen und Medien um.' } },
        { code: 'MU.5.C.1', texts: { 1: 'Ich singe, tanze und musiziere vor anderen.', 2: 'Ich führe ein Lied als ausgearbeitete Präsentation auf.', 3: 'Ich präsentiere meine musikalischen Fähigkeiten vor Publikum und beachte die Bühnenwirkung.' } },
      ]},
      { id: 'MU.6', title: 'Praxis des musikalischen Wissens', competencies: [
        { code: 'MU.6.A.1', texts: { 1: 'Ich halte Puls und Takt und singe einfache Tonfolgen und die Durtonleiter.', 2: 'Ich wende Rhythmussprache an und singe Melodien mit Notennamen.', 3: 'Ich spiele zwei Rhythmen gleichzeitig, erkenne Intervalle und wende Dreiklänge an.' } },
        { code: 'MU.6.B.1', texts: { 1: 'Ich lese einfache Rhythmen aus Halben, Vierteln und Achteln.', 2: 'Ich benenne und notiere Noten und lese auch Sechzehntel und Punktierungen.', 3: 'Ich verfolge eine Stimme im mehrstimmigen Notenbild und notiere musikalische Ideen.' } },
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
        { code: 'BS.1.A.1', texts: { 1: 'Ich laufe schnell auf den Fussballen und finde mich beim Laufen zurecht.', 2: 'Ich kenne die Schnelllauftechnik, passe mein Tempo an und orientiere mich mit einem Plan.', 3: 'Ich laufe rhythmisch über Hindernisse, trainiere Ausdauer und laufe mit Karte.' } },
        { code: 'BS.1.B.1', texts: { 1: 'Ich hüpfe und springe vielseitig, in die Weite und in die Höhe.', 2: 'Ich kenne Weitsprung- und Hochsprungtechnik und springe mit Anlauf.', 3: 'Ich wende Weit- und Hochsprungtechnik an und schätze meine Leistung realistisch ein.' } },
        { code: 'BS.1.C.1', texts: { 1: 'Ich werfe Gegenstände mit links und rechts in die Weite.', 2: 'Ich werfe mit Anlauf und stosse mit der Kraft des ganzen Körpers.', 3: 'Ich wende Wurf-, Schleuder- und Kugelstosstechnik an.' } },
      ]},
      { id: 'BS.2', title: 'Bewegen an Geräten', competencies: [
        { code: 'BS.2.A.1', texts: { 1: 'Ich balanciere, rolle, schaukle, springe und klettere und lande kontrolliert.', 2: 'Ich turne Bewegungsfolgen an Geräten und helfe und sichere andere.', 3: 'Ich turne auch schwierige Folgen und gestalte sie in der Gruppe.' } },
        { code: 'BS.2.B.1', texts: { 1: 'Ich spanne meinen Körper an und stütze mich auf den Händen.', 2: 'Ich erhalte und steigere mit Anleitung Kraft und Beweglichkeit.', 3: 'Ich kenne Trainingsgrundsätze und trainiere Kraft und Beweglichkeit selbstständig.' } },
      ]},
      { id: 'BS.3', title: 'Darstellen und Tanzen', competencies: [
        { code: 'BS.3.A.1', texts: { 1: 'Ich nehme die Stellung meines Körpers im Raum wahr.', 2: 'Ich bewege Körperteile gezielt und achte auf die Haltung.', 3: 'Ich spüre meine Bewegungen und korrigiere sie selbst.' } },
        { code: 'BS.3.B.1', texts: { 1: 'Ich imitiere Bewegungen, spiele Rollen und bewege mich mit Materialien.', 2: 'Ich gestalte ausdrucksvolle Bewegungsfolgen und zeige Kunststücke mit Material.', 3: 'Ich choreografiere eine Bewegungsfolge und präsentiere sie.' } },
        { code: 'BS.3.C.1', texts: { 1: 'Ich bewege mich im Takt der Musik und tanze auf verschiedene Arten.', 2: 'Ich verbinde Tanzbewegungen zu Folgen und respektiere den Ausdruck anderer.', 3: 'Ich interpretiere Taktarten und Stile und präge mir Choreografien ein.' } },
      ]},
      { id: 'BS.4', title: 'Spielen', competencies: [
        { code: 'BS.4.A.1', texts: { 1: 'Ich spiele in verschiedenen Rollen mit und halte die Regeln ein.', 2: 'Ich verändere Spiele und spiele selbstständig und fair.', 3: 'Ich entwickle und erfinde Spiele und löse Konflikte konstruktiv.' } },
        { code: 'BS.4.B.1', texts: { 1: 'Ich nehme Bälle an, spiele sie weiter und treffe Ziele.', 2: 'Ich spiele in kleinen Teams, erkenne freie Räume und respektiere alle.', 3: 'Ich wende Technik und Taktik in Sportspielen an und erkläre die Regeln.' } },
        { code: 'BS.4.C.1', texts: { 1: 'Ich beachte Stoppsignale und Regeln in Kampfspielen.', 2: 'Ich reagiere auf mein Gegenüber und kämpfe respektvoll.', 3: 'Ich setze Kraft und Strategie ein und kämpfe fair ohne Schiedsrichter.' } },
      ]},
      { id: 'BS.5', title: 'Gleiten, Rollen, Fahren', competencies: [
        { code: 'BS.5.1', texts: { 1: 'Ich fahre auf Rollgeräten, weiche Hindernissen aus und bremse sicher.', 2: 'Ich fahre sicher Velo auf der Strasse und bewege mich auf Gleitgeräten.', 3: 'Ich fahre und gleite situationsangepasst und vermeide Gefahren.' } },
      ]},
      { id: 'BS.6', title: 'Bewegen im Wasser', competencies: [
        { code: 'BS.6.A.1', texts: { 1: 'Ich wende Atmen, Schweben, Gleiten und Antreiben im Wasser an.', 2: 'Ich schwimme 50 Meter und wende Crawl- und Brustbewegungen an.', 3: 'Ich schwimme 100 Meter und kenne verschiedene Schwimmtechniken.' } },
        { code: 'BS.6.B.1', texts: { 1: 'Ich tauche kurz unter und atme dabei aus.', 2: 'Ich rolle ins tiefe Wasser und tauche eine kurze Strecke.', 3: 'Ich springe kopfwärts ins tiefe Wasser und tauche ab.' } },
        { code: 'BS.6.C.1', texts: { 1: 'Ich erkenne Gefahren im Wasser und halte die Baderegeln ein.', 2: 'Ich halte Bade- und Tauchregeln ein und kann Alarm auslösen.', 3: 'Ich handle in Notsituationen richtig und kenne Rettungstechniken.' } },
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
        { code: 'MI.1.1', texts: { 1: 'Ich erzähle von meinen Erfahrungen mit Medien und virtuellen Welten.', 2: 'Ich erkenne Folgen medialer und virtueller Handlungen.', 3: 'Ich benenne Chancen und Risiken der Mediennutzung und passe mein Verhalten an.' } },
        { code: 'MI.1.2', texts: { 1: 'Ich verstehe einfache Medienbeiträge und lerne mit vorgegebenen Medien.', 2: 'Ich beschaffe Informationen aus verschiedenen Quellen und beurteile ihre Qualität.', 3: 'Ich verstehe Bild- und Filmsprache und schätze die Absicht hinter Medienbeiträgen ein.' } },
        { code: 'MI.1.3', texts: { 1: 'Ich gestalte und präsentiere einfache Bild-, Text- und Tondokumente.', 2: 'Ich verwende fremde Inhalte mit Quellenangabe und beachte Sicherheitsregeln.', 3: 'Ich stelle Medienbeiträge her und beachte dabei die rechtlichen Regeln.' } },
        { code: 'MI.1.4', texts: { 1: 'Ich pflege Kontakte mit Medien und tausche mich aus.', 2: 'Ich kommuniziere und arbeite mit Medien und befolge die Sicherheitsregeln.', 3: 'Ich veröffentliche Ideen mit Medien und nutze Werkzeuge für die Zusammenarbeit.' } },
      ]},
      { id: 'MI.2', title: 'Informatik', competencies: [
        { code: 'MI.2.1', texts: { 1: 'Ich ordne Dinge nach Eigenschaften, damit ich sie schneller finde.', 2: 'Ich kenne Dateitypen, verschlüssle mit Geheimschriften und nutze Baumstrukturen.', 3: 'Ich strukturiere Daten in einer Datenbank und kenne Backup und Synchronisation.' } },
        { code: 'MI.2.2', texts: { 1: 'Ich erkenne Anleitungen Schritt für Schritt und folge ihnen.', 2: 'Ich schreibe und teste Programme mit Schleifen und Bedingungen.', 3: 'Ich entwickle eigene Algorithmen als Programme mit Variablen und Unterprogrammen.' } },
        { code: 'MI.2.3', texts: { 1: 'Ich bediene Geräte und Programme, melde mich an und lege Dokumente ab.', 2: 'Ich schütze Daten vor Verlust und verstehe, wie Suchmaschinen funktionieren.', 3: 'Ich verstehe den Aufbau von Informatiksystemen und weiss, wo Daten gespeichert sind.' } },
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
        { code: 'BO.1.1', texts: { 3: 'Ich kenne meine Stärken und Interessen und nutze sie für die Berufswahl.' } },
      ]},
      { id: 'BO.2', title: 'Bildungswege, Berufs- und Arbeitswelt', competencies: [
        { code: 'BO.2.1', texts: { 3: 'Ich verschaffe mir einen Überblick über das Schweizer Bildungssystem.' } },
        { code: 'BO.2.2', texts: { 3: 'Ich stelle einen Bezug zur Arbeitswelt her und ziehe Schlüsse für meine Berufswahl.' } },
      ]},
      { id: 'BO.3', title: 'Entscheidung und Umgang mit Schwierigkeiten', competencies: [
        { code: 'BO.3.1', texts: { 3: 'Ich setze Prioritäten, entscheide mich und bleibe offen für Alternativen.' } },
        { code: 'BO.3.2', texts: { 3: 'Ich erkenne Schwierigkeiten bei der Berufswahl und entwickle Lösungen.' } },
      ]},
      { id: 'BO.4', title: 'Planung, Umsetzung und Dokumentation', competencies: [
        { code: 'BO.4.1', texts: { 3: 'Ich setze mir Ziele und plane meine Bewerbungen.' } },
        { code: 'BO.4.2', texts: { 3: 'Ich setze meine geplanten Schritte um und bereite den Übergang vor.' } },
        { code: 'BO.4.3', texts: { 3: 'Ich dokumentiere meine Berufswahl und stelle meine Bewerbungsunterlagen zusammen.' } },
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

export function areaCompetenciesForCycle(area, cycle) {
  return area.competencies.filter((c) => c.texts[cycle]);
}

export function competencyCount(subject, cycle) {
  return subject.areas.reduce(
    (n, a) => n + areaCompetenciesForCycle(a, cycle).length, 0);
}

// Übungs-Apps dieser Sammlung, verknüpft über den offiziellen
// Kompetenz-Code. Relative Links, damit die Verknüpfung auf GitHub
// Pages und lokal funktioniert.
export const PRACTICE_APPS = {
  'MA.1.A.1': { name: 'Zahlenwissen', href: '../zahlenwissen/' },
  'MA.1.A.2': { name: 'Zahlensprung', href: '../zahlensprung/' },
  'MA.1.A.3': { name: 'Rechenturm', href: '../rechenturm/' },
  'MA.1.A.4': { name: 'Rechenkniff', href: '../rechenkniff/' },
  'MA.2.A.1': { name: 'Formenreich', href: '../formenreich/' },
  'MA.2.A.2': { name: 'Spiegelraster', href: '../spiegelraster/' },
  'MA.2.A.3': { name: 'Figurenmass', href: '../figurenmass/' },
  'MA.3.A.1': { name: 'Grössenwissen', href: '../groessenwissen/' },
  'MA.3.A.2': { name: 'Masswerk', href: '../masswerk/' },
  'MA.3.A.3': { name: 'Wertepfad', href: '../wertepfad/' },
  'D.4.F.1': { name: 'Wortwerkstatt', href: '../wortwerkstatt/' },
};
