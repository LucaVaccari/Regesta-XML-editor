const KEY_INPUT_INDEX = 0,
  KEY_BUTTON_INDEX = 1,
  VALUE_INPUT_INDEX = 2,
  VALUE_BUTTON_INDEX = 3;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Text",
  ],
  (Controller, JSONModel) => {
    "use strict";

    let model;

    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onInit: function () {
        model = new JSONModel(data);
        this.getView().setModel(model);

      },
      
      // TODO: input checks
      onKeySubmit: function (event) {
        getRecordElement(event).getContent()[KEY_INPUT_INDEX].setVisible(false);
        getRecordElement(event).getContent()[KEY_BUTTON_INDEX].setVisible(true);
        console.log(this.getView().byId("__item0-__xmlview0--tree-0"));
      },

      onKeyEdit: function (event) {
        getRecordElement(event).getContent()[KEY_INPUT_INDEX].setVisible(true);
        getRecordElement(event)
          .getContent()
          [KEY_BUTTON_INDEX].setVisible(false);

        console.log(getRecordElement(event).getId());
      },

      // TODO: input checks
      onValueSubmit: function (event) {
        getRecordElement(event)
          .getContent()
          [VALUE_INPUT_INDEX].setVisible(false);
        getRecordElement(event)
          .getContent()
          [VALUE_BUTTON_INDEX].setVisible(true);
      },

      onValueEdit: function (event) {
        getRecordElement(event)
          .getContent()
          [VALUE_INPUT_INDEX].setVisible(true);
        getRecordElement(event)
          .getContent()
          [VALUE_BUTTON_INDEX].setVisible(false);
      },

      onAdd: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let subTree = findSubTreeById(data, id);
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

        model.updateBindings(true);
      },

      onRemove: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let subTree = findSubTreeById(data[0], id);

        // TODO: confirm dialog

        delete subTree.key;
        delete subTree.value;
        delete subTree.id;

        clearTree(data);

        model.updateBindings(true);
      },

      onDuplicate: function (event) {
        let id = getCustomIdFromRecord(getRecordElement(event));
        let parent = findParentFromId(data[0], id);
        let subTree = findSubTreeById(data[0], id);

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

        model.updateBindings(true);
      },

      onMoveUp: function (event) {},

      onMoveDown: function (event) {},

      onCancel: function () {
        // go to previous page
      },

      onUndo: function () {},

      onRedo: function () {},

      onReset: function () {},

      onShowXML: function () {},

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

function getRootElement() {}

getRootElement();
