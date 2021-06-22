// convert an XML string to a JS object
function XMLtoJSON(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "text/xml"
  );

  return _XMLDocToObject(doc.getRootNode());

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
}

function XMLSchematoJSONSchema(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "text/xml"
  );

  return _XMLDocToObjectSchema(doc.getRootNode().childNodes[0]);
}

function _XMLDocToObjectSchema(node) {
  let obj = {};
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
function JSONtoXML(json, attributes) {
  return formatter(json, attributes);
}

function formatXML(cj, attributes, formatter) {
  let xml = "";

  if (typeof cj != "object") return cj;
  if (Array.isArray(cj)) {
    for (let el of cj) {
      xml += formatter.beforeOpenKey + el.key;
      // ATTRIBUTES START
      for (let attribute of attributes.filter((a) => a.parentId == el.id)) {
        xml += formatter.surroundAttribute(
          attribute.attributeKey,
          attribute.attributeValue
        );
      }
      // ATTRIBUTES END
      xml += formatter.afterOpenKey;
      xml += formatter.surroundContent(
        formatXML(el.value, attributes, formatter)
      );
      xml += formatter.surroundCloseKey(el.key);
    }
  } else {
    console.log("JS goes BRRRR")
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

function XMLFormatter_(json, attributes, indentLevel = 0) {
  let xml = "";

  if (typeof json != "object")
    return multiplyChar("\t", indentLevel) + json + "\n";
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        xml += multiplyChar("\t", indentLevel);
        xml += `<${key}>\n`;
        indentLevel++;
        xml += XMLFormatter_(el, attributes, indentLevel);
        xml += multiplyChar("\t", --indentLevel);
        xml += `</${key}>\n`;
      }
    } else {
      xml += multiplyChar("\t", indentLevel);
      xml += `<${key}>\n`;
      indentLevel++;
      xml += XMLFormatter_(json[key], attributes, indentLevel);
      xml += multiplyChar("\t", --indentLevel);
      xml += `</${key}>\n`;
    }
  }

  return xml;
}

function compactXMLFormatter(json, atributes, indentLevel = 0) {
  let xml = "";

  if (typeof json != "object") return json;
  for (let key of Object.keys(json)) {
    if (Array.isArray(json[key])) {
      for (let el of json[key]) {
        xml += multiplyChar("\t", indentLevel);
        let innerText = compactXMLFormatter(el, attributes, ++indentLevel);
        let isBranch = innerText.startsWith("\t");
        xml += isBranch ? `<${key}>\n` : `<${key}>`;
        xml += innerText;
        --indentLevel;
        xml += isBranch ? multiplyChar("\t", indentLevel) : "";
        xml += `</${key}>\n`;
      }
    } else {
      xml += multiplyChar("\t", indentLevel);
      let innerText = compactXMLFormatter(json[key], attributes, ++indentLevel);
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

// TODODODODODOO
function customJSONtoXML(cj, attributes, indentLevel = 0) {
  let xml = "";

  if (typeof cj != "object") return multiplyChar("\t", indentLevel) + cj + "\n";
  if (Array.isArray(cj)) {
    for (let el of cj) {
      xml += multiplyChar("\t", indentLevel);
      xml += `<${el.key}`;
      // ATTRIBUTES START
      for (let attribute of attributes.filter((a) => a.parentId == el.id)) {
        xml += ` ${attribute.attributeKey}="${attribute.attributeValue}"`;
      }
      // ATTRIBUTES END
      xml += `>\n`;
      indentLevel++;
      xml += customJSONtoXML(el.value, attributes, indentLevel);
      xml += multiplyChar("\t", --indentLevel);
      xml += `</${el.key}>\n`;
    }
  } else {
    xml += multiplyChar("\t", indentLevel);
    xml += `<${cj.key}>\n`;
    indentLevel++;
    xml += customJSONtoXML(cj.value, attributes, indentLevel);
    xml += multiplyChar("\t", --indentLevel);
    xml += `</${cj.key}>\n`;
  }

  return xml;
}

function JSONFormatter(obj) {
  return JSON.stringify(obj, null, 4);
}

function XMLtoHTML(xml, fontSize) {
  let openAngularBracket =
    '<code style="color:#73C2E1;">&lt;</code><code  style="color:#346187;">';
  let closedAngularBracket = '</code><code  style="color:#73C2E1;">&gt;</code>';
  let html = xml
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
    .replaceAll(/\t/g, "    ")
    .replaceAll(/&lt;/g, openAngularBracket)
    .replaceAll(/&gt;/g, closedAngularBracket)
    .replaceAll(
      openAngularBracket + "/",
      '<code style="color:#73C2E1;">&lt;/</code><code  style="color:#346187;">'
    )
    .replaceAll(/\n\s*\n\s*/g, "");
  return `<pre style="font-size:${fontSize}px;">${html}</pre>`;
}
