# Documentation

- cosa fa l'applicazione 1
    - scopo 1.1
    - come 1.2
- custom json 2
    - struttura 2.1
    - utilizzo 2.2
- conversioni 3
    - custom JSON -> XML 3.1
    - XML -> custom JSON 3.2
- openui5 utilizzo 4
    - struttura della pagina 4.1
    - interazione mvc 4.2
    - funzioni del controller 4.3
- formattazione 5
    - classe formatter 5.1
    - metodo formatXML (utilizzo) 5.2
    - HTML formatter 5.3
- home page 6

## 1. Generalità

### 1.1 Scopo

L'applicazione ha lo scopo di semplificare la visualizzazione e la modifica di file XML tramite un'interfaccia grafica rispetto ad un editor testuale.

### 1.2 Funzionamento

L'applicazione converte il file XML fornito in un formato personalizzato che ne consente la rappresentazione sull'interfaccia grafica. Ogni modifica aggiorna questo oggetto intermedio per poi convertirlo nuovamente in formato XML.

### 1.3 Tecnologie utilizzate

L'applicazione sfrutta le seguenti tecnologie:
- JavaScript
- HTML
- CSS
- Framework [OpenUI5](https://openui5.org)

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
- *key* contiene il nome del tag letto dal file.
- *value* contiene il contenuto del tag; nel caso in cui il contenuto fosse a sua volta un tag .oppure una lista di tag, *value* conterrebbe un Array di oggetti nello stesso formato sopra mostrato.
- *id* è un numero unico assegnato progressivamente dall'applicazione per identificare univocamente ogni elemento del file.

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
- *attributeKey* contiene il nome dell'attributo.
- *attributeValue* contiene il valore dell'attributo.
- *id* è un numero unico assegnato progressivamente dall'applicazione per identificare univocamente ogni elemento del file.
- *parentId* è l'*id* del tag nel quale l'attributo è contenuto.

Tutti gli attributi sono salvati in un Array.

## 3. Conversioni

All'interno del file js/converters.js sono presenti tutte le funzioni di conversione.

### 3.1 XMLtoCustomJSON

#### Parametri:
- xml: *string* - il file XML sotto forma di stringa.

#### Ritorno:
Un oggetto contenente la struttura ad albero dei tag e l'Array di attributi.

#### Funzionamento:

La prima operazione effettuata è la rimozione di caratteri inutili all'interpretazione dei dati ("\n", "\t" e spaziature fra i tag).

Successivamente la stringa è passata ad un oggetto DOMParser che la converte in un [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document?retiredLocale=it) . La radice di quest'ultimo è attraversata ricorsivamente dalla funzione interna XMLDocToCustomJSON, che costruisce le due strutture per tag e attributi.

#### 3.1.1 XMLDocToCustomJSON

##### Parametri:
- node: *[Node](https://developer.mozilla.org/en-US/docs/Web/API/Node)* - il nodo da processare
- id: *number* - opzionale - è passato quando si analizzano gli attributi per avere l'id del tag al quale l'attributo appartiene

##### Ritorno:
Il CustomJSON contenente i tag (non gli attributi, salvati con una closure).

##### Funzionamento:

Si distinguono quattro [tipologie di nodo](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType):
- TEXT_NODE: rappresente il contenuto finale di un tag; il valore del nodo viene ritornato direttamente.
- ELEMENT_NODE: rappresenta un tag; innanzitutto *id* e *key* vengono assegnati, poi si procede all'assegnazione di *value*. In caso il tag fosse vuoto *value* verrebbe posta a stringa vuota, altrimenti il contenuto è analizzato e assegnato a *value* all'interno di un Array. Al termine vengono analizzati gli attributi.
- ATTRIBUTE_NODE: rappresenta un attributo XML; viene ritornato un oggetto CustomJSON attributo.
- DOCUMENT_NODE: rappresenta il genitore della radice del Document; viene ritornata l'elaborazione del figlio (il nodo radice).

### 3.2 CustomJSONToXML:

#### Parametri:
- customJson: *object* - l'elemento CustomJSON da convertire
- attributes: *object* - l'Array di attributi CustomJSON
- formatter: *object* - l'oggetto della classe Formatter che si occupa della formattazione della stringa prodotta dalla funzione

#### Ritorno:
Una stringa formattata (secondo i criteri del formatter fornito come argomento) che rappresenta il CustomJSON passato, compresi gli attributi, se forniti.

#### Funzionamento:
La funzione attraversa ricorsivamente il CustomJSON componendo la stringa finale utilizzando il formatter.

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
    - un albero rappresentante i dati effettivi in cui ogni elemento è composto da:
        - [Label](https://openui5.hana.ondemand.com/api/sap.m.Label) con nome del tag
        - Label con valore del tag
        - Button per spostare l'elemento in alto di una posizione
        - Button per spostare l'elemento in basso di una posizione
- a destra si trova un'anteprima del file XML prodotto, contenente:
    - una OverflowToolbar con i seguenti Button che permettono di selezionare il tipo di formattazione:
        - XML: formattazione XML classica
        - Compact XML: formattazione XML in cui i contenuti foglia si trovano sulla stessa riga del tag
    - un [FormattedText](https://openui5.hana.ondemand.com/api/sap.m.FormattedText) per visualizzare l'anteprima consentendo l'evidenziazione della sintassi
    - uno [Slider](https://openui5.hana.ondemand.com/api/sap.m.Slider) per cambiare la dimensione dei caratteri dell'anteprima
Al termine della pagina si trova un footer con i seguenti Button:
    - Cancel: ignora tutte le modifiche e ritorna alla pagina iniziale
    - Export: salva tutte le modifiche e ritorna alla pagina iniziale

### 4.2 MVC
Dato che OpenUI5 implementa il pattern model-view-controller, ogni aggiornamento del modello si riflette nell'interfaccia, così come ogni cambiamento dell'intefaccia si riflette nel modello.

### 4.3 Controller

#### 4.3.1 Funzioni del controller

##### 4.3.1.1 getRecordElement

###### Parametri:
- event: *object* - l'evento dal quale si vuole ottenere l'elemento grafico dell'albero

###### Ritorno:
L'elemento grafico dell'albero.

###### Funzionamento:

Ottiene dall'id dell'origine dell'evento l'elemento da ritornare.

##### 4.3.1.2 getCustomIdFromRecord

###### Parametri:
- record: *object* - l'elemento grafico dell'alber dal quale si vuole ottenere l'id personalizzato

###### Ritorno:
L'id personalizzato dell'elemento grafico fornito come argomento.

###### Funzionamento:

Ottiene l'id personalizzato e lo ritorna.

