function XMLtoCustomJSON(xml) {
  console.log(xml);
  let attributes = [];
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, " ").replaceAll(/>\s*</g, "><"),
    "application/xml"
  );

  let root = doc.getRootNode();
  let noAttributesCJ = XMLDocToCustomJSON(root);
  return { noAttributesCJ, attributes };

  function XMLDocToCustomJSON(node, id = -1) {
    let noAttributesCJ = {};

    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        // a leaf of the document tree
        const leaf = node.nodeValue == undefined ? "" : node.nodeValue;
        return leaf;
      }
      case Node.ELEMENT_NODE: // a branch of the document tree
        noAttributesCJ.id = lastElementId++;
        noAttributesCJ.key = node.nodeName;

        if (node.childNodes.length == 0) noAttributesCJ.value = "";
        else {
          noAttributesCJ.value = [];
          for (let i = 0; i < node.childNodes.length; i++) {
            let temp = XMLDocToCustomJSON(node.childNodes.item(i));
            temp.isFirst = i == 0;
            temp.isLast = i == node.childNodes.length - 1;
            noAttributesCJ.value.push(temp);
          }
        }

        for (let attr of node.attributes) {
          let temp = XMLDocToCustomJSON(attr, noAttributesCJ.id);
          attributes.push(temp);
        }

        // view properties
        noAttributesCJ.editing = false;
        noAttributesCJ.isParent = Array.isArray(noAttributesCJ.value);
        noAttributesCJ.isFirst = true;
        noAttributesCJ.isLast = true;
        noAttributesCJ.editing = false;

        break;
      case Node.ATTRIBUTE_NODE: // an attribute
        return {
          id: lastElementId++,
          attributeKey: node.nodeName,
          attributeValue: node.nodeValue,
          parentId: id,
        };
      case Node.DOCUMENT_NODE: // the root of the document tree
        return XMLDocToCustomJSON(node.firstChild);
      default:
        console.warn(
          "unsupported xml node type: " + node + " " + node.nodeType
        );
        break;
      //return XMLDocToCustomJSON(node.firstSibling);
    }

    return noAttributesCJ;
  }
}

function CustomJSONToXML(customJson, attributes, formatter, id = -1) {
  let xml = "";

  if (typeof customJson != "object") return customJson;
  if (Array.isArray(customJson)) {
    for (let el of customJson) {
      let isLast = customJson.indexOf(el) == customJson.length - 1;
      let isFirst = customJson.indexOf(el) == 0;
      let filteredAttributes = attributes.filter((a) => a.parentId == el.id);
      let content = formatter.surround(
        el.key,
        CustomJSONToXML(el.value, attributes, formatter, id),
        filteredAttributes.map((a) => a.attributeKey),
        filteredAttributes.map((a) => a.attributeValue),
        isLast,
        isFirst
      );
      xml +=
        id == el.id ? formatter.setBold(content, isLast, isFirst) : content;
    }
  } else {
    console.warn("You shouldn't reach this point CustomJSONToXML");
  }
  return xml;
}
