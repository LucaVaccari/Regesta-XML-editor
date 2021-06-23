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
- Framework OpenUI5

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

### 3. Conversioni

All'interno del file js/converters.js sono presenti tutte le funzioni di conversione.

#### 3.1 XMLtoCustomJSON

##### Parametri:
- xml: *string* - il file XML sotto forma di stringa.

##### Ritorno:
Un oggetto contenente la struttura ad albero dei tag e l'Array di attributi.

##### Funzionamento:


