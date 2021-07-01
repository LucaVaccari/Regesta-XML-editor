function XMLSchematoJSONSchema(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, ""),
    "application/xml"
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

function HTMLtoFormatted(html, fontSize) {
  return `<pre style="font-size:${fontSize}px;">${html}</pre>`;
}
