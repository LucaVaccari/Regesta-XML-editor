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
    }
  }
  return obj;
}

function CustomJSONToXML(customJson, attributes, formatter) {
  let xml = "";

  if (typeof customJson != "object") return customJson;
  if (Array.isArray(customJson)) {
    for (let el of customJson) {
      let isLast = customJson.indexOf(el) == customJson.length - 1;
      console.log(isLast, " el: ", el);
      let filteredAttributes = attributes.filter(a => a.parentId == el.id)
      xml += formatter.surround(el.key, CustomJSONToXML(el.value, attributes, formatter), filteredAttributes.map(a => a.attributeKey), filteredAttributes.map(a => a.attributeValue), isLast);
    }
  } else {
    console.warn("You shouldn't reach this point CustomJSONToXML");
  }
  return xml;//.replaceAll(/\n\s*\n/g, "\n");
}

// if an element is not a leaf, it's incapsulated into an array
// LEGACY FUNCTION, DO NOT USE.
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

function HTMLtoFormatted(html, fontSize) {
  return `<pre style="font-size:${fontSize}px;">${html}</pre>`;
}
