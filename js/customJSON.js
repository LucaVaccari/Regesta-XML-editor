let attributes = [];
let customJSON;

function XMLtoCustomJSON(xml) {
  let doc = new DOMParser().parseFromString(
    xml.replaceAll(/\n|\t/g, "").replaceAll(/> </g, "><"),
    "text/xml"
  );

  let root = doc.getRootNode();
  let { CJ, noAttributesCJ } = XMLDocToCustomObj(root);
  customJSON = CJ;
  return noAttributesCJ;

  function XMLDocToCustomObj(node, id = -1) {
    let CJ = {},
      noAttributesCJ = {};

    switch (node.nodeType) {
      case Node.TEXT_NODE: {
        // a leaf of the document tree
        const CJ = node.nodeValue == undefined ? "" : node.nodeValue;
        return { CJ };
      }
      case Node.ELEMENT_NODE: // a branch of the document tree
        CJ.id = lastId++;
        noAttributesCJ.id = CJ.id;
        CJ.key = node.nodeName;
        noAttributesCJ.key = node.nodeName;
        CJ.value = "";
        noAttributesCJ.value = "";
        if (node.childNodes.length == 1 && typeof node.firstChild != "object") {
          let temp = XMLDocToCustomObj(node.firstChild);
          CJ.value = temp.CJ;
          noAttributesCJ.value = temp.noAttributesCJ;
        } else if (node.childNodes.length > 0) {
          CJ.value = [];
          noAttributesCJ.value = [];
          for (let child of node.childNodes) {
            let temp = XMLDocToCustomObj(child);
            CJ.value.push(temp.CJ);
            noAttributesCJ.value.push(temp.noAttributesCJ);
          }
        }
        CJ.attributes = [];
        for (let attr of node.attributes) {
          let temp = XMLDocToCustomObj(attr, CJ.id);
          CJ.attributes.push(temp);
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
        return XMLDocToCustomObj(node.firstChild);
      default:
        console.warn("unsupported xml node type: " + node + " " + node.nodeType);
        break;
    }

    return { CJ, noAttributesCJ };
  }
}
