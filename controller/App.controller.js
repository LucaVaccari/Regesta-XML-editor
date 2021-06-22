const KEY_LABEL_INDEX = 0,
  KEY_INPUT_INDEX = 1,
  VALUE_LABEL_INDEX = 2,
  VALUE_INPUT_INDEX = 3,
  MOVE_BUTTONS_INDEX = 5,
  MOVE_DOWN_BUTTON_INDEX = 6;

let jsonModel, view, tree, root, popoverView;
let lastKeyInput, lastKeyLabel, lastValueInput, lastValueLabel;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  (Controller, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        view = this.getView();
        view.setModel(jsonModel);

        tree = view.byId("tree");
        root = tree.getItems()[0];
        root.getContent()[MOVE_BUTTONS_INDEX].setVisible(false);
        root.getContent()[MOVE_DOWN_BUTTON_INDEX].setVisible(false);

        update();
      },

      onEdit: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;

        let buttons = selected.getContent();

        lastKeyLabel?.setVisible(true);
        lastKeyInput?.setVisible(false);

        lastKeyInput = buttons[KEY_INPUT_INDEX];
        lastKeyInput.setVisible(true);
        lastKeyLabel = buttons[KEY_LABEL_INDEX];
        lastKeyLabel.setVisible(false);

        //lastValueLabel?.setVisible(true);
        lastValueInput?.setVisible(false);

        lastValueInput = buttons[VALUE_INPUT_INDEX];
        let id = getCustomIdFromRecord(selected);
        let subTree = findSubTreeById(model.data, id);
        if (subTree != undefined)
          lastValueInput.setVisible(!Array.isArray(subTree.value));
        else console.error("You shouldn't reach this point (onEdit)");
        lastValueLabel = buttons[VALUE_LABEL_INDEX];
        lastValueLabel.setVisible(false);
      },

      onEditAttributes: function () {
        if (!this._popover) {
          this._popover = Fragment.load({
            id: view.getId(),
            name: "sap.ui.demo.walkthrough.view.AttributeEditing",
            controller: this,
          }).then(function (popover) {
            view.addDependent(popover);
            return popover;
          });
        }
        this._popover.then(function (popover) {
          popover.openBy(tree.getSelectedItems()[0]);
          popoverView = popover;
        });

      },

      onSubmit: function (event) {
        let selected = getRecordElement(event);
        let buttons = selected.getContent();
        buttons[KEY_INPUT_INDEX].setVisible(false);
        buttons[KEY_LABEL_INDEX].setVisible(true);
        buttons[VALUE_INPUT_INDEX].setVisible(false);

        let id = getCustomIdFromRecord(selected);
        let subTree = findSubTreeById(model.data, id);
        if (subTree != undefined)
          buttons[VALUE_LABEL_INDEX].setVisible(!Array.isArray(subTree.value));
        else console.error("You shouldn't reach this point (onEdit)");

        onModify();
        update();
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

        if (id == model.data[0].id) {
          console.warn("Cannot remove root node");
          return;
        }

        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (parent.value.length <= 1) {
          parent.value = subTree.value;
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

      onSelect: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;
        let id = getCustomIdFromRecord(selected);
        let isRoot = id == getCustomIdFromRecord(root);

        view.byId("removeButton").setEnabled(!isRoot);
        view.byId("duplicateButton").setEnabled(!isRoot);
        view.byId("addButton").setEnabled(true);
        view.byId("editButton").setEnabled(true);
        view.byId("editAttributesButton").setEnabled(true);

        model.selectedAttributes = model.allAttributes.filter(a => a.parentId == id);

        jsonModel.updateBindings(true);
      },

      onXMLSwitch: function () {
        formatter.compact = false;
        update();
      },

      onCompactXMLSwitch: function () {
        formatter.compact = true;
        update();
      },

      onJSONSwitch: function () {
        formatter = JSONFormatter;
        update();
      },

      onExport: function () {},

      onToggleOpenState: update,

      onSliderChange: update,
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

  let fontSize = view.byId("fontSizeSlider").getValue();
  // model.preview = XMLtoHTML(JSONtoXML(customJSONtoJSON(model.data), model.allAttributes), fontSize);
  model.preview = XMLtoHTML(formatXML(model.data, model.allAttributes, formatter), fontSize);
  view.byId("undoButton").setEnabled(dataQueueIndex > 0);
  view.byId("redoButton").setEnabled(dataQueueIndex < dataQueue.length - 1);

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
        [VALUE_LABEL_INDEX].setVisible(!Array.isArray(subTree.value));
    else
      console.error(
        "You shouldn't reach this point. subtree.value is undefined"
      );

    let keyLabel = node.getContent()[KEY_LABEL_INDEX];
    keyLabel.setWidth(keyLabel.getText().length + 6 + "em");

    let valueLabel = node.getContent()[VALUE_LABEL_INDEX];
    valueLabel.setWidth(valueLabel.getText().length + 6 + "em");
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
