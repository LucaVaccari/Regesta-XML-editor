// Global variables
let model = {}; // the mvc model
let lastId = 0; // id used to generate ids
let dataQueue = []; // used to store model.data changes
let dataQueueIndex = 0; //used in undo / redo
var formatter = XMLFormatter;

model.preview =
  "<shiporder name='sus' surname='sas'><orderperson>John Smith</orderperson><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>";

console.log(XMLSchematoJSONSchema(model.preview));
let json = XMLtoJSON(model.preview);
model.data = JSONtoCustomJSON(json);
json = customJSONtoJSON(model);
dataQueue[0] = JSON.parse(JSON.stringify(model.data));
dataQueueIndex = 0;