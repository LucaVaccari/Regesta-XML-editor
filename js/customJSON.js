let attributes = [];

function XMLtoCustomJSON(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, "").replaceAll(/>\s*</g, "><"),
    "text/xml"
  );

  let root = doc.getRootNode();
  return XMLDocToCustomJSON(root);

  function XMLDocToCustomJSON(node, id = -1) {
    let noAttributesCJ = {};

    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        // a leaf of the document tree
        const leaf = node.nodeValue == undefined ? "" : node.nodeValue;
        return leaf;
      }
      case Node.ELEMENT_NODE: // a branch of the document tree
        noAttributesCJ.id = lastId++;
        noAttributesCJ.key = node.nodeName;

        if (node.childNodes.length == 0)
          noAttributesCJ.value = "";
        else {
          noAttributesCJ.value = [];
          for (let child of node.childNodes) {
            let temp = XMLDocToCustomJSON(child);
            noAttributesCJ.value.push(temp);
          }
        }

        for (let attr of node.attributes) {
          let temp = XMLDocToCustomJSON(attr, noAttributesCJ.id);
          attributes.push(temp);
        }

        break;
      case Node.ATTRIBUTE_NODE: // an attribute
        return {
          id: lastId++,
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
