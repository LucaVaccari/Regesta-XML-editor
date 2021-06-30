const KEY_LABEL_INDEX = 0,
  KEY_INPUT_INDEX = 1,
  VALUE_LABEL_INDEX = 2,
  VALUE_INPUT_INDEX = 3,
  MOVE_UP_BUTTON_INDEX = 5,
  MOVE_DOWN_BUTTON_INDEX = 6;

let jsonModel,
  view,
  originalTree,
  selectedItem,
  root,
  popoverView,
  attributesShown = true;
let lastKeyInput, lastKeyLabel, lastValueInput, lastValueLabel;

function findSubTreeById(tree, id) {
  if (tree == undefined) return;

  if (Array.isArray(tree)) {
    for (let el of tree)
      if (id == el.id) return el;
      else {
        let searchResult = findSubTreeById(el, id);
        if (searchResult != undefined) return searchResult;
      }
  } else {
    if (id == tree.id) return tree;
    else return findSubTreeById(tree.value, id);
  }
}

function findParentFromId(tree, id) {
  if (tree == undefined || tree.value == undefined) return;

  if (Array.isArray(tree.value)) {
    for (let el of tree.value) {
      if (id == el.id) return tree;
      else {
        let searchResult = findParentFromId(el, id);
        if (searchResult != undefined) return searchResult;
      }
    }
  } else {
    if (id == tree.value.id) return tree;
    else return findParentFromId(tree.value, id);
  }
}

function clearTree(tree) {
  if (typeof tree == "string") return;

  for (let k in tree) {
    if (!tree[k] || typeof tree[k] !== "object") {
      continue; // If null or not an object, skip to the next iteration
    }

    // The property is an object
    if (Object.keys(tree[k]).length === 0) {
      delete tree[k]; // The object had no properties, so delete that property
    }

    if (Array.isArray(tree[k])) {
      arr = [];
      for (let el of tree[k]) {
        if (
          el != undefined &&
          el != null &&
          el != {} &&
          Object.keys(el).length != 0
        )
          arr.push(el);
      }
      tree[k] = typeof arr[0] != "object" ? arr[0] : arr;
    }

    clearTree(tree[k]);
  }
}

function replaceIds(tree) {
  if (typeof tree != "object") {
    return tree;
  }

  if (Array.isArray(tree)) {
    let obj = [];
    for (let el of tree) {
      obj.push(replaceIds(el));
    }
    return obj;
  } else {
    let returnVal = JSON.parse(JSON.stringify(tree));
    returnVal.value = replaceIds(tree.value);
    returnVal.id = lastElementId++;
    return returnVal;
  }
}

function onModify() {
  let currentData = {
    noAttributes: model.data,
    attributes: model.allAttributes,
  };
  let currentDataString = JSON.stringify(currentData);
  let previousData = JSON.stringify(dataQueue[dataQueueIndex]);
  if (currentDataString != previousData) {
    dataQueue = dataQueue.slice(0, ++dataQueueIndex);
    let dataCopy = JSON.parse(currentDataString);
    dataQueue.push(dataCopy);
  }
}

function closeKeyValueInputs() {
  if (selectedItem != undefined) selectedItem.editing = false;
  update();
}

function updateTree(tree) {
  if (typeof tree != "object") return;

  if (Array.isArray(tree)) {
    for (let i in tree) {
      tree[i].isFirst = i == 0;
      tree[i].isLast = i == tree.length - 1;
      updateTree(tree[i]);
    }
  } else {
    tree.isParent = Array.isArray(tree.value);
    updateTree(tree.value);
  }
}

function updateModel() {
  // update tree
  clearTree(model.data);
  updateTree(model.data);

  // update attributes
  model.allAttributes.forEach((originalAttribute, originalAttributeIndex) => {
    for (let attribute of model.selectedAttributes) {
      if (originalAttribute.id == attribute.id) {
        this[originalAttributeIndex] = attribute;
        break;
      }
    }
  });
  for (let attr of model.allAttributes) {
    attr.attributeKey = attr.attributeKey || "attributeName";
  }
}

function updatePreview() {
  // selected = originalTree.getSelectedItems()[0];
  let id = selectedItem ? selectedItem.id : -1;
  let attributes = attributesShown ? model.allAttributes : [];
  model.preview.content = HTMLtoFormatted(
    CustomJSONToXML(model.data, attributes, formatter, id),
    model.preview.fontSize
  );
}

function updateGraphics() {
  model.somethingChanged = dataQueueIndex > 0;
  model.somethingUndone = dataQueueIndex < dataQueue.length - 1;

  let currentData = JSON.stringify({
    noAttributes: model.data,
    attributes: model.allAttributes,
  });
  let originalData = JSON.stringify(dataQueue[0]);
  model.fileChanged = currentData != originalData;

  jsonModel.updateBindings(true);

  if (!selectedItem) {
    model.somethingSelected = false;
    model.isRootSelected = false;
  }

  jsonModel.updateBindings(true);
}

function update() {
  updateModel();
  updatePreview();
  updateGraphics();
}
