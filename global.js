// Global variables
let model = {}; // the mvc model
let lastId = 0; // id used to generate ids
let dataQueue = []; // used to store model.data changes
let dataQueueIndex = 0; //used in undo / redo

model.xml =
  "<shiporder><orderperson>John Smith</orderperson><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>";

let json = XMLtoJSON(model.xml);
model.data = JSONtoCustomJSON(json);
json = customJSONtoJSON(model);
dataQueue[0] = JSON.parse(JSON.stringify(model.data));
dataQueueIndex = 0;

// convert an XML string to a JS object
function XMLtoJSON(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "text/xml"
  );
  return _XMLDocToObject(doc.getRootNode());
}

// recursive function. DO NOT CALL, internal use only
function _XMLDocToObject(node, obj = {}) {
  for (let child of node.childNodes) {
    if (child.hasChildNodes()) {
      // is the subnode not a leaf?
      if (child.childNodes[0].nodeValue == null) {
        let childObj = {};
        _XMLDocToObject(child, childObj); // explore the children
        if (child.nodeName in obj) {
          // if the key already exists
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]]; // convert to array
          }
          obj[child.nodeName].push(childObj);
        } else obj[child.nodeName] = [childObj];
      } else {
        // the subnode is a leaf
        if (child.nodeName in obj) {
          // if the key already exists
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]]; // convert to array
          }
          obj[child.nodeName].push(child.childNodes[0].nodeValue);
        } else obj[child.nodeName] = child.childNodes[0].nodeValue;
      }
    }
  }
  return obj;
}

// convert a JS object into an XML string
function JSONtoXML(json, indentLevel = 0) {
  let xml = "";

  if (typeof json != "object")
    return multiplyChar("\t", indentLevel) + json + "\n";
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        xml += multiplyChar("\t", indentLevel);
        xml += `<${key}>\n`;
        indentLevel++;
        xml += JSONtoXML(el, indentLevel);
        xml += multiplyChar("\t", --indentLevel);
        xml += `</${key}>\n`;
      }
    } else {
      xml += multiplyChar("\t", indentLevel);
      xml += `<${key}>\n`;
      indentLevel++;
      xml += JSONtoXML(json[key], indentLevel);
      xml += multiplyChar("\t", --indentLevel);
      xml += `</${key}>\n`;
    }
  }

  return xml;
}

// if an element is not a leaf, it's incapsulated into an array
function JSONtoCustomJSON(json) {
  let customJson = [];

  if (typeof json != "object") return json;
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        customJson.push({
          key: key,
          value: JSONtoCustomJSON(el),
          id: lastId++,
        });
      }
    } else {
      customJson.push({
        key: key,
        value: JSONtoCustomJSON(json[key]),
        id: lastId++,
      });
    }
  }

  return customJson;
}

function customJSONtoJSON(customJson) {
  let json = {};

  if (typeof customJson != "object") return customJson;

  if (!Array.isArray(customJson))
    return {
      [customJson.key]: customJSONtoJSON(customJson.value),
    };

  for (let el of customJson) {
    if (Object.keys(json).includes(el.key)) {
      if (!Array.isArray(json[el.key])) json[el.key] = [json[el.key]];
      json[el.key].push(customJSONtoJSON(el.value));
    } else {
      json[el.key] = customJSONtoJSON(el.value);
    }
  }

  return json;
}

function multiplyChar(char, times) {
  let result = "";
  for (let i = 0; i < times; i++) result += char;

  return result;
}
