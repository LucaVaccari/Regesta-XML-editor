# Documentation

## 1. Generalità

### 1.1 Scopo

L'applicazione ha lo scopo di semplificare la visualizzazione e la modifica di file XML tramite un'interfaccia grafica rispetto ad un editor testuale.

### 1.2 Funzionamento

L'applicazione converte il file XML fornito in un formato personalizzato che ne consente la rappresentazione sull'interfaccia grafica. Ogni modifica aggiorna questo oggetto intermedio per poi convertirlo nuovamente in formato XML.

È presente una coda che tiene traccia di tutte le modifiche che vengono apportate, permettendo di annullare le azioni e ripristinare quelle annullate.

### 1.3 Tecnologie utilizzate

L'applicazione sfrutta le seguenti tecnologie:

- JavaScript
- HTML
- CSS
- Framework [OpenUI5](https://openui5.org)

---

## 2. Custom JSON

### 2.1 Utilizzo

Il framework OpenUI5, il quale utilizza il pattern model-view-controller, richiede un modello di dati (nel nostro caso in formato JSON) da rappresentare, ma necessita di essere a conoscenza delle chiavi (i nomi dei tag). Essendo queste sconosciuti a priori, si è scelto di memorizzare i dati in una struttura in cui le chiavi sono predefinite ("key" e "value") mentre tutte le informazioni del file XML sono contenute nei valori (nome dei tag e contenuto di essi). Gli attributi sono salvati separatamente.

### 2.2 Struttura

Il formato personalizzato è denominato "Custom JSON" in quanto è un oggetto JSON, ma presenta alcune restrizioni nella struttura.

#### 2.2.1 Tag

Ogni tag è rappresentato nel modo seguente:

```js
{
    key: "<nome-tag>",
    value: "<contenuto-tag>",
    id: "<id-progressivo>"
}
```

- _key_ contiene il nome del tag letto dal file.
- _value_ contiene il contenuto del tag; nel caso in cui il contenuto fosse a sua volta un tag .oppure una lista di tag, _value_ conterrebbe un Array di oggetti nello stesso formato sopra mostrato.
- _id_ è un numero unico assegnato progressivamente dall'applicazione per identificare univocamente ogni elemento del file.

Tutti i tag sono salvati all'interno di una struttura ad albero utilizzata come modello dall'interfaccia grafica.

#### 2.2.2 Attributi

Ogni attributo è rappresentato nel modo seguente:

```js
{
    attributeKey: "<nome-attributo>",
    attributeValue: "<valore-attributo>",
    id: "<id-progressivo>",
    parentId: "<id-tag>"
}
```

- _attributeKey_ contiene il nome dell'attributo.
- _attributeValue_ contiene il valore dell'attributo.
- _id_ è un numero unico assegnato progressivamente dall'applicazione per identificare univocamente ogni elemento del file.
- _parentId_ è l'_id_ del tag nel quale l'attributo è contenuto.

Tutti gli attributi sono salvati in un Array.

---

## 3. Conversioni

All'interno del file js/converters.js sono presenti tutte le funzioni di conversione.

### 3.1 XMLtoCustomJSON

#### Parametri:

- xml: _string_ - il file XML sotto forma di stringa.

#### Ritorno:

Un oggetto contenente la struttura ad albero dei tag e l'Array di attributi.

#### Funzionamento:

La prima operazione effettuata è la rimozione di caratteri inutili all'interpretazione dei dati ("\n", "\t" e spaziature fra i tag).

Successivamente la stringa è passata ad un oggetto DOMParser che la converte in un [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document?retiredLocale=it) . La radice di quest'ultimo è attraversata ricorsivamente dalla funzione interna XMLDocToCustomJSON, che costruisce le due strutture per tag e attributi.

#### 3.1.1 XMLDocToCustomJSON

##### Parametri:

- node: _[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)_ - il nodo da processare
- id: _number_ - opzionale - è passato quando si analizzano gli attributi per avere l'id del tag al quale l'attributo appartiene

##### Ritorno:

Il CustomJSON contenente i tag (non gli attributi, salvati con una closure).

##### Funzionamento:

Si distinguono quattro [tipologie di nodo](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType):

- TEXT_NODE: rappresente il contenuto finale di un tag; il valore del nodo viene ritornato direttamente.
- ELEMENT_NODE: rappresenta un tag; innanzitutto _id_ e _key_ vengono assegnati, poi si procede all'assegnazione di _value_. In caso il tag fosse vuoto _value_ verrebbe posta a stringa vuota, altrimenti il contenuto è analizzato e assegnato a _value_ all'interno di un Array. Al termine vengono analizzati gli attributi.
- ATTRIBUTE_NODE: rappresenta un attributo XML; viene ritornato un oggetto CustomJSON attributo.
- DOCUMENT_NODE: rappresenta il genitore della radice del Document; viene ritornata l'elaborazione del figlio (il nodo radice).

### 3.2 CustomJSONToXML:

#### Parametri:

- customJson: _object_ - l'elemento CustomJSON da convertire
- attributes: _object_ - l'Array di attributi CustomJSON
- formatter: _object_ - l'oggetto della classe Formatter che si occupa della formattazione della stringa prodotta dalla funzione

#### Ritorno:

Una stringa formattata (secondo i criteri del formatter fornito come argomento) che rappresenta il CustomJSON passato, compresi gli attributi, se forniti.

#### Funzionamento:

La funzione attraversa ricorsivamente il CustomJSON componendo la stringa finale utilizzando il formatter.

---

## 4. Utilizzo di OpenUI5

Il framework openUI5 è la versione open source di [SapUI5](https://sapui5.hana.ondemand.com/), framework in JavaScript per la realizzazione di interfacce grafiche per applicazioni gestionali.

### 4.1 Struttura della pagina

La pagina presenta due sezioni principali:

- a sinistra si trova l'editor grafico, contenente:
  - una [OverflowToolbar](https://openui5.hana.ondemand.com/api/sap.m.OverflowToolbar) con i seguenti [Button](https://openui5.hana.ondemand.com/api/sap.m.Button):
    - undo: annulla l'ultima modifica
    - reset: ripristina i dati allo stato di importazione
    - redo: ripristina l'ultima modifica annullata
    - add: aggiunge un sotto elemento all'elemento selezionato
    - remove: rimuove l'elemento selezionato e tutti i suoi sotto elementi
    - duplicate: duplica l'elemento selezionato, mantenendo la posizione nella gerarchia
    - edit key-value: consente di modificare chiave e valore dell'elemento selezionato
    - edit attributes: apre un pannello che consente di visualizzare e modificare gli attributi dell'elemento selezionato
  - un albero rappresentante i dati effettivi in cui ogni elemento è composto da una OverflowToolbar contenente:
    - [Label](https://openui5.hana.ondemand.com/api/sap.m.Label) con nome del tag
    - Label con valore del tag
    - Button per spostare l'elemento in alto di una posizione
    - Button per spostare l'elemento in basso di una posizione
- a destra si trova un'anteprima del file XML prodotto, contenente: - una OverflowToolbar con i seguenti Button che permettono di selezionare il tipo di formattazione: - XML: formattazione XML classica - Compact XML: formattazione XML in cui i contenuti foglia si trovano sulla stessa riga del tag - un [FormattedText](https://openui5.hana.ondemand.com/api/sap.m.FormattedText) per visualizzare l'anteprima consentendo l'evidenziazione della sintassi - uno [Slider](https://openui5.hana.ondemand.com/api/sap.m.Slider) per cambiare la dimensione dei caratteri dell'anteprima
  Al termine della pagina si trova un footer con i seguenti Button: - Cancel: ignora tutte le modifiche e ritorna alla pagina iniziale - Export: salva tutte le modifiche e ritorna alla pagina iniziale

### 4.2 MVC

Dato che OpenUI5 implementa il pattern model-view-controller, ogni aggiornamento del modello si riflette nell'interfaccia, così come ogni cambiamento dell'intefaccia si riflette nel modello.

### 4.3 Controller

#### 4.3.1 Funzioni del controller

##### 4.3.1.1 getRecordElement

###### Parametri:

- event: _object_ - l'evento dal quale si vuole ottenere l'elemento grafico dell'albero

###### Ritorno:

L'elemento grafico dell'albero.

###### Funzionamento:

Ottiene dall'id dell'origine dell'evento l'elemento da ritornare.

##### 4.3.1.2 getCustomIdFromRecord

###### Parametri:

- record: _object_ - l'elemento grafico dell'albero dal quale si vuole ottenere l'id personalizzato

###### Ritorno:

L'id personalizzato dell'elemento grafico fornito come argomento.

###### Funzionamento:

Ottiene l'id personalizzato e lo ritorna.

##### 4.3.1.3 findSubTreeFromId

###### Parametri:

- tree: _object_ - l'albero CustomJSON da cui prelevare il sottoalbero
- id: _number_ - l'id del sottoalbero da ricercare

###### Ritorno:

Il sottoalbero CustomJSON con l'id corrispondente a quello passato come parametro.

###### Funzionamento:

Ricerca ricorsivamente finché non trova una corrispondenza.

##### 4.3.1.4 findParentFromId

###### Parametri:

- tree: _object_ - l'albero CustomJSON da cui prelevare l'elemento padre
- id: _number_ - l'id dell'elemento di cui si vuole cercare il padre

###### Ritorno:

Il padre dell'elemento con l'id corrispondente a quello passato come parametro.

###### Funzionamento:

Ricerca ricorsivamente finché non trova una corrispondenza.

##### 4.3.1.5 clearTree

###### Parametri:

- tree: _object_ - l'albero CustomJSON da ripulire

###### Ritorno:

###### Funzionamento:

Ricorsivamente elimina gli spazi vuoti nell'albero. Poi rimpiazza gli Array contenenti una foglia con la foglia stessa.

##### 4.3.1.6 replaceIds

###### Parametri:

- tree: _object_ - l'albero CustomJSON di cui aggiornare gli id

###### Ritorno:

L'albero CustomJSON fornito con gli id aggiornati.

###### Funzionamento:

Analizza ricorsivamente l'albero rimpiazzando tutti gli id. Questa funzione è utilizzata nella duplicazione.

##### 4.3.1.7 update

###### Parametri:

###### Ritorno:

###### Funzionamento:

Viene richiamata dopo ogni interazione con l'interfaccia per aggiornare sia la vista che il modello.

##### 4.3.1.8 onModify

###### Parametri:

###### Ritorno:

###### Funzionamento:

Controlla se c'è stata una modifica ed eventualmente aggiunge alla coda la nuova versione.

#### 4.3.2 Callback del controller

##### 4.3.2.1 onInit

Inizializza il modello, la vista e il controller.

##### 4.3.2.2 onEdit

Scambia le Label di chiave e valore con degli [Input](https://openui5.hana.ondemand.com/api/sap.m.Input).

##### 4.3.2.3 onEditAttributes

Mostra un pannello per la modifca degli attributi.

##### 4.3.2.4 onSubmit

Scambia gli Input di chiave e valore con delle Label.

##### 4.3.2.5 onAdd

Aggiunge un sotto elemento all'elemento selezionato.

##### 4.3.2.6 onRemove

Elimina l'elemento selezionato e tutti i suoi sotto elementi. L'operazione non è consentita sul nodo radice.

##### 4.3.2.7 onDuplicate

Duplica l'elemento selezionato e tutti i suoi sotto elementi, riassegnandone gli id. L'operazione non è consentita sul nodo radice.

##### 4.3.2.8 onMoveUp

Sposta un elemento più in alto nello stesso livello gerarchico, se non è il più alto. L'operazione non è consentita sul nodo radice.

##### 4.3.2.9 onMoveDown

Sposta un elemento più in basso nello stesso livello gerarchico, se non è il più basso. L'operazione non è consentita sul nodo radice.

##### 4.3.2.10 onUndo

Annulla l'ultima modifica.

##### 4.3.2.11 onRedo

Ripristina l'ultimo annullamento.

##### 4.3.2.12 onReset

Ripristina l'intero documento allo stato di importazione.

##### 4.3.2.13 onSelect

Aggiorna alcuni Button in base all'elemento dell'albero selezionato.

##### 4.3.2.14 onXMLSwitch

Imposta il formatter a non compact.

##### 4.3.2.15 onCompactXMLSwitch

Imposta il formatter a compact.

##### 4.3.2.16 onToggleOpenState

Viene chiamata quando un elemento dell'albero viene espanso. Richiama l'update.

##### 4.3.2.17 onSliderChange

Viene richiamata quando viene modificato lo slider che determina le dimensioni del testo. Richiama l'update.

---

## 5. Formattazione

Il risultato della conversione a XML può essere esportato con formattazioni diverse in base alle esigenze. Per questo è presente una classe, estendibile, che se ne occupa.

### 5.1 Classe Formatter

La classe fornisce dei metodi per circondare gli elementi dell'XML con dei caratteri, attributi della classe, decisi nel costruttore.

### 5.2 Classe HTMLFormatter

Deriva da Formatter e i suoi metodi permettono di visualizzare l'XML in un visualizzatore HTML. Prende come parametri del costruttore i colori dell'evidenziazione della sintassi.
