const KEY_INPUT_INDEX = 0,
  KEY_BUTTON_INDEX = 1,
  VALUE_INPUT_INDEX = 2,
  VALUE_BUTTON_INDEX = 3,
  MOVE_BUTTONS_INDEX = 4,
  MOVE_DOWN_BUTTON_INDEX = 5;

let jsonModel, view, tree;
let lastEditButton, lastInput;

sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        view = this.getView();
        view.setModel(jsonModel);

        tree = view.byId("tree");
        tree.getItems()[0].getContent()[VALUE_BUTTON_INDEX].setVisible(false);
        tree.getItems()[0].getContent()[MOVE_BUTTONS_INDEX].setVisible(false);
        tree
          .getItems()[0]
          .getContent()
          [MOVE_DOWN_BUTTON_INDEX].setVisible(false);

        view.byId("page").getScrollDelegate().setVertical(false);

        update();
      },

      onKeySubmit: function (event) {
        getRecordElement(event).getContent()[KEY_INPUT_INDEX].setVisible(false);
        getRecordElement(event).getContent()[KEY_BUTTON_INDEX].setVisible(true);

        onModify();
        update();
      },

      onKeyEdit: function (event) {
        lastEditButton?.setVisible(true);
        lastInput?.setVisible(false);

        lastInput = getRecordElement(event).getContent()[KEY_INPUT_INDEX];
        lastInput.setVisible(true);
        lastEditButton = getRecordElement(event).getContent()[KEY_BUTTON_INDEX];
        lastEditButton.setVisible(false);
      },

      onValueSubmit: function (event) {
        getRecordElement(event)
          .getContent()
          [VALUE_INPUT_INDEX].setVisible(false);
        getRecordElement(event)
          .getContent()
          [VALUE_BUTTON_INDEX].setVisible(true);

        onModify();
        update();
      },

      onValueEdit: function (event) {
        lastEditButton?.setVisible(true);
        lastInput?.setVisible(false);

        lastInput = getRecordElement(event).getContent()[VALUE_INPUT_INDEX];
        lastInput.setVisible(true);
        lastEditButton =
          getRecordElement(event).getContent()[VALUE_BUTTON_INDEX];
        lastEditButton.setVisible(false);
      },

      onAdd: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
        let subTree = findSubTreeById(model.data, id);
        let subTreeValue = {
          key: "key",
          value: "value",
          id: lastId++,
        };
        if (Array.isArray(subTree.value)) subTree.value.push(subTreeValue);
        else {
          subTreeValue.value = subTree.value;
          subTree.value = [subTreeValue];
        }

        onModify();
        update();

        tree.expand(tree.indexOfItem(selected));

        update();
      },

      onRemove: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (parent.value.length <= 1) {
          parent.value = subTree.value;
        }

        if (id == model.data[0].id) {
          console.warn("Cannot remove root node");
          return;
        }

        delete subTree.key;
        delete subTree.value;
        delete subTree.id;

        clearTree(model.data);

        onModify();
        update();
      },

      onDuplicate: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.warn("Cannot duplicate root node");
          return;
        }

        let subTreeValue = {
          key: subTree.key,
          value: replaceIds(subTree.value),
          id: lastId++,
        };
        if (Array.isArray(parent.value)) parent.value.push(subTreeValue);
        else {
          subTreeValue.value = parent.value;
          parent.value = [subTreeValue];
        }

        onModify();
        update();
      },

      onMoveUp: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.warn("Cannot move root node");
          return;
        }

        let index = parent.value.indexOf(subTree);
        if (index > 0) {
          [parent.value[index - 1], parent.value[index]] = [
            parent.value[index],
            parent.value[index - 1],
          ];
          onModify();
          update();
        }
      },

      onMoveDown: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.warn("Cannot move root node");
          return;
        }

        let index = parent.value.indexOf(subTree);
        if (index < parent.value.length - 1) {
          [parent.value[index], parent.value[index + 1]] = [
            parent.value[index + 1],
            parent.value[index],
          ];
          onModify();
          update();
        }
      },

      onCancel: function () {
        // go to previous page
      },

      onUndo: function () {
        if (dataQueueIndex >= 1) {
          model.data = JSON.parse(JSON.stringify(dataQueue[--dataQueueIndex]));
        }

        update();
      },

      onRedo: function () {
        if (dataQueueIndex < dataQueue.length - 1) {
          model.data = JSON.parse(JSON.stringify(dataQueue[++dataQueueIndex]));
        }
        update();
      },

      onReset: function () {
        model.data = JSON.parse(JSON.stringify(dataQueue[0]));
        onModify();
        update();
      },

      onTogglePreview: function () {
        let panel = view.byId("preview");
        let visible = !panel.getVisible();
        panel.setVisible(visible);
        view
          .byId("previewButton")
          .setText(visible ? "Hide preview" : "Show preview");

        update();
      },

      onXMLSwitch: function () {
        formatter = XMLFormatter;
        update();
      },

      onCompactXMLSwitch: function () {
        formatter = compactXMLFormatter;
        update();
      },

      onJSONSwitch: function () {
        formatter = JSONFormatter;
        update();
      },

      onExport: function () {},

      onToggleOpenState: update,
    });
  }
);

function getRecordElement(event) {
  let id = event.getSource().getId();
  return sap.ui.getCore().getElementById(id).oParent;
}

function getCustomIdFromRecord(record) {
  return record.mAggregations.customData[0].mProperties.value;
}

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
      tree[k] = arr;
    }

    clearTree(tree[k]);
  }
}

function replaceIds(tree) {
  let obj = [];

  if (typeof tree.value != "object" && tree.value) {
    return {
      key: tree.key,
      value: tree.value,
      id: lastId++,
    };
  }

  if (Array.isArray(tree)) {
    for (let el of tree) {
      obj.push(replaceIds(el));
    }
  } else return tree;

  return obj;
}

function update() {
  clearTree(model.data);

  model.preview = JSONtoXML(customJSONtoJSON(model.data)) + "\n\n\n\n\n";
  // view.byId("undoButton").setVisible(dataQueueIndex > 0);
  // view.byId("redoButton").setVisible(dataQueueIndex < dataQueue.length - 1);

  let currentData = JSON.stringify(model.data);
  let originalData = JSON.stringify(dataQueue[0]);
  view.byId("resetButton").setEnabled(currentData != originalData);

  jsonModel.updateBindings(true);
  for (let node of tree.getItems()) {
    let id = getCustomIdFromRecord(node);
    let subTree = findSubTreeById(model.data, id);
    if (subTree != undefined)
      node
        .getContent()
        [VALUE_BUTTON_INDEX].setVisible(!Array.isArray(subTree.value));
  }

  jsonModel.updateBindings(true);
}

function onModify() {
  let currentData = JSON.stringify(model.data);
  let previousData = JSON.stringify(dataQueue[dataQueueIndex]);
  if (currentData != previousData) {
    dataQueue = dataQueue.slice(0, ++dataQueueIndex);
    let dataCopy = JSON.parse(currentData);
    dataQueue.push(dataCopy);
  }
}
