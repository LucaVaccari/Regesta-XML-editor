// convert an XML string to a JS object
function XMLtoJSON(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "text/xml"
  );

  return _XMLDocToObject(doc.getRootNode());
}

// recursive function. DO NOT CALL, internal use only
function _XMLDocToObject(node) {
  let obj = {};
  for (let child of node.childNodes) {
    if (child.hasChildNodes()) {
      // is the subnode not a leaf?
      if (child.firstChild.nodeValue == null) {
        let childObj = _XMLDocToObject(child); // explore the children
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
          obj[child.nodeName].push(child.firstChild.nodeValue);
        } else {
          obj[child.nodeName] = child.firstChild.nodeValue;
        }
      }
    } else {
      obj[child.nodeName] = "";
    }
  }
  return obj;
}

function XMLSchematoJSONSchema(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "text/xml"
  );

  return _XMLDocToObjectSchema(doc.getRootNode().childNodes[0]);
}

function _XMLDocToObjectSchema(node, obj = {}) {
  obj.tag = node.nodeName;
  obj.attributes = {};
  obj.content = [];

  for (let attr of node.attributes) {
    obj.attributes[attr.nodeName] = attr.nodeValue;
  }

  for (let child of node.childNodes) {
    if (child.hasChildNodes()) {
      // is the subnode not a leaf?
      if (child.nodeValue == null) {
        let childObj = _XMLDocToObjectSchema(child);
        obj.content.push(childObj);
      } else {
        obj.content.push(child.nodeValue);
      }
    } else {
    }
  }
  return obj;
}

// convert a JS object into an XML string
function JSONtoXML(json) {
  return formatter(json);
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

function XMLFormatter(json, indentLevel = 0) {
  let xml = "";

  if (typeof json != "object")
    return multiplyChar("\t", indentLevel) + json + "\n";
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        xml += multiplyChar("\t", indentLevel);
        xml += `<${key}>\n`;
        indentLevel++;
        xml += XMLFormatter(el, indentLevel);
        xml += multiplyChar("\t", --indentLevel);
        xml += `</${key}>\n`;
      }
    } else {
      xml += multiplyChar("\t", indentLevel);
      xml += `<${key}>\n`;
      indentLevel++;
      xml += XMLFormatter(json[key], indentLevel);
      xml += multiplyChar("\t", --indentLevel);
      xml += `</${key}>\n`;
    }
  }

  return xml;
}

function compactXMLFormatter(json, indentLevel = 0) {
  let xml = "";

  if (typeof json != "object") return json;
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        xml += multiplyChar("\t", indentLevel);
        let innerText = compactXMLFormatter(el, ++indentLevel);
        let isBranch = innerText.startsWith("\t");
        xml += isBranch ? `<${key}>\n` : `<${key}>`;
        xml += innerText;
        --indentLevel;
        xml += isBranch ? multiplyChar("\t", indentLevel) : "";
        xml += `</${key}>\n`;
      }
    } else {
      xml += multiplyChar("\t", indentLevel);
      let innerText = compactXMLFormatter(json[key], ++indentLevel);
      let isBranch = innerText.startsWith("\t");
      xml += isBranch ? `<${key}>\n` : `<${key}>`;
      xml += innerText;
      --indentLevel;
      xml += isBranch ? multiplyChar("\t", indentLevel) : "";
      xml += `</${key}>\n`;
    }
  }

  return xml;
}

function JSONFormatter(obj) {
  return JSON.stringify(obj, null, 4);
}
