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
   - duplicate function
 - conversioni:
   !- XMLtoJSON
   !- JSONtoOurJSON
   !- OurJSONtoJSON
   !- JSONtoXML
 - callback:
   !- add
   !- remove
   !- duplicate
   !- move up
   !- move down
   - cancel
   !- undo
   !- redo
   !- reset
   !- show XML
   - export
 - funzionalità:
   !- divisione schermo
   !- nascondere il pulsante value quando ci sono figli
   !- impedire duplicazione o rimozione della root
   - mostrare i pulsanti solo sull'elemento selezionato
   - pagina iniziale
 - cose poco utili:
   - colori diversi per livelli diversi
   - rendere i pulsanti di dimensione fissa
   - pulsante con matita al posto del pulsante
