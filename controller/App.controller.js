const KEY_INPUT_INDEX = 0,
  KEY_BUTTON_INDEX = 1,
  VALUE_INPUT_INDEX = 2,
  VALUE_BUTTON_INDEX = 3;

let jsonModel;
let view;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Text",
  ],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        view = this.getView();
        view.setModel(jsonModel);

        update();
      },

      // TODO: input checks
      onKeySubmit: function (event) {
        getRecordElement(event).getContent()[KEY_INPUT_INDEX].setVisible(false);
        getRecordElement(event).getContent()[KEY_BUTTON_INDEX].setVisible(true);

        onModify();
        update();
      },

      onKeyEdit: function (event) {
        getRecordElement(event).getContent()[KEY_INPUT_INDEX].setVisible(true);
        getRecordElement(event)
          .getContent()
          [KEY_BUTTON_INDEX].setVisible(false);

        update();
      },

      // TODO: input checks
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
        getRecordElement(event)
          .getContent()
          [VALUE_INPUT_INDEX].setVisible(true);
        getRecordElement(event)
          .getContent()
          [VALUE_BUTTON_INDEX].setVisible(false);

        update();
      },

      onAdd: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let subTree = findSubTreeById(model.data, id);
        let subTreeValue = {
          key: "key",
          value: [],
          id: lastId++,
        };
        if (Array.isArray(subTree.value)) subTree.value.push(subTreeValue);
        else {
          subTreeValue.value = subTree.value;
          subTree.value = [subTreeValue];
        }

        onModify();
        update();
      },

      onRemove: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.log("Cannot remove root node");
          return;
        }

        // TODO: confirm dialog

        delete subTree.key;
        delete subTree.value;
        delete subTree.id;

        clearTree(model.data);

        onModify();
        update();
      },

      //TODO: fix
      onDuplicate: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.log("Cannot duplicate root node");
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
          console.log("Cannot move root node");
          return;
        }

        let index = parent.value.indexOf(subTree);
        if (index > 0) {
          [parent.value[index - 1], parent.value[index]] = [
            parent.value[index],
            parent.value[index - 1],
          ];
          onModify();
        }
      },

      onMoveDown: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.log("Cannot move root node");
          return;
        }

        let index = parent.value.indexOf(subTree);
        if (index < parent.value.length - 1) {
          [parent.value[index], parent.value[index + 1]] = [
            parent.value[index + 1],
            parent.value[index],
          ];
          onModify();
        }
      },

      onCancel: function () {
        // go to previous page
      },

      onUndo: function () {
        if (dataQueueIndex >= 1) {
          //console.log(dataQueueIndex);
          model.data = JSON.parse(JSON.stringify(dataQueue[--dataQueueIndex]));
        }
        console.log(dataQueue);
        update();
      },

      onRedo: function () {},

      onReset: function () {},

      onToggleXML: function () {
        let panel = view.byId("xmlView");
        let visible = !panel.getVisible();
        panel.setVisible(visible);
        view.byId("xmlButton").setText(visible ? "Hide XML" : "Show XML");

        update();
      },

      onExport: function () {},
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
          el !== undefined &&
          el !== null &&
          el !== {} &&
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
  console.log(typeof tree);
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
  } else {
    console.error(
      "You shouldn't reach this point. If you see this message, there's an error in your code."
    );
  }

  return obj;
}

function update() {
  model.xml = JSONtoXML(customJSONtoJSON(model.data));
  view.byId("undoButton").setVisible(dataQueueIndex > 0);

  jsonModel.updateBindings(true);
}

function onModify() {
  let currentData = JSON.stringify(model.data);
  let previousData = JSON.stringify(dataQueue[dataQueueIndex - 1]);
  if (currentData != previousData) {
    dataQueue = dataQueue.slice(0, ++dataQueueIndex);
    let dataCopy = JSON.parse(currentData);
    dataQueue.push(dataCopy);
  }
  update();
}
