# Regesta-XML-editor

5 pulsanti: rimuovi, aggiungi, duplica, sposta (su e giù)
modifica di un documento alla volta
gerarchia ad albero
Ctrl+Z

il tasto aggiungi prende il valore e lo sposta nel nuovo elemento del sottoalbero
popup con codice XML

XML -> JSON -> Our JSON -> Processing -> JSON -> XML

footer con tasti CANCEL, EXPORT

{
    key: "chiave",
    value: "valore" | {},
    id: Number (progressivo)
}
function getById(id): ritorna il sottoalbero con l'id fornito

 - bug:
 - conversioni:
   - [x] XMLtoJSON
   - [x] JSONtoOurJSON
   - [x] OurJSONto
   - [x] JSONtoXML
 - callback:
   - [x] add
   - [x] remove
   - [x] duplicate
   - [x] move up
   - [x] move down
   - cancel
   - [x] undo
   - [x] redo
   - [x] reset
   - [x] show XML
   - export
 - funzionalità:
   - [x] divisione schermo
   - [x] nascondere il pulsante value quando ci sono figli
   - [x] impedire duplicazione o rimozione della root
   - [ ] pagina iniziale
 - grafica:
   - [x] tooltip
   - [ ] colori
   - [ ] rendere i pulsanti di dimensione fissa
   - [x] pulsante con matita al posto del pulsante
   - [x] spostare undo, redo, reset
   - [x] immagini al posto delle parole
   - [ ] mostrare nome del file
   - [x] toolbar per aggiungere, rimuovere, duplicare