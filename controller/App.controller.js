const KEY_LABEL_INDEX = 0,
  KEY_INPUT_INDEX = 1,
  VALUE_LABEL_INDEX = 2,
  VALUE_INPUT_INDEX = 3,
  MOVE_BUTTONS_INDEX = 5,
  MOVE_DOWN_BUTTON_INDEX = 6;

let jsonModel, view, tree, root, popoverView, attributesShown = true;
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
        root.getContent()[0].getContent()[MOVE_BUTTONS_INDEX].setVisible(false);
        root.getContent()[0].getContent()[MOVE_DOWN_BUTTON_INDEX].setVisible(false);

        clearTree(model.data);
        let initData = {
          noAttributes: model.data,
          attributes: model.allAttributes,
        }
        dataQueue[0] = JSON.parse(JSON.stringify(initData));
        update();
      },

      onEdit: function () {
        let selected = tree.getSelectedItems()[0];
        if (selected == undefined) return;

        let buttons = selected.getContent()[0].getContent();

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
        let buttons = selected.getContent()[0].getContent();
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
          let previousData = JSON.parse(JSON.stringify(dataQueue[--dataQueueIndex]));
          model.data = previousData.noAttributes;
          model.allAttributes = previousData.attributes;
        }

        update();
      },

      onRedo: function () {
        if (dataQueueIndex < dataQueue.length - 1) {
          let previousData = JSON.parse(JSON.stringify(dataQueue[++dataQueueIndex]));
          model.data = previousData.noAttributes;
          model.allAttributes = previousData.attributes;
        }
        update();
      },

      onReset: function () {
        let previousData = JSON.parse(JSON.stringify(dataQueue[0]));
        model.data = previousData.noAttributes;
        model.allAttributes = previousData.attributes;
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

        model.selectedAttributes = model.allAttributes.filter(
          (a) => a.parentId == id
        );

        jsonModel.updateBindings(true);
      },

      onXMLSwitch: function () {
        formatter.isCompact = false;
        update();
      },

      onCompactXMLSwitch: function () {
        formatter.isCompact = true;
        update();
      },

      onJSONSwitch: function () {
        formatter = JSONFormatter;
        update();
      },

      onExport: function () { },


      onAttributesModify: function () {
        onModify();
        update();
      },

      onAddAttribute: function () {
        let selected = tree.getSelectedItems()[0];
        let newAttr = {
          id: lastId++,
          attributeKey: "name",
          attributeValue: "value",
          parentId: getCustomIdFromRecord(selected),
        }

        model.selectedAttributes.push(newAttr);
        model.allAttributes.push(newAttr);
        this.onAttributesModify();
      },

      onRemoveAttribute: function (event) {
        let item = event.getParameter("listItem");
        let id = item.mAggregations.customData[0].mProperties.value;
        model.selectedAttributes = model.selectedAttributes.filter(a => a.id != id);
        model.allAttributes = model.allAttributes.filter(a => a.id != id);
        this.onAttributesModify();
      },

      onClearAttributes: function () {
        let selected = tree.getSelectedItems()[0];
        let parentId = getCustomIdFromRecord(selected);

        model.allAttributes = model.allAttributes.filter(a => a.parentId != parentId);
        model.selectedAttributes = [];
        this.onAttributesModify();
      },

      onToggleAttributesVisibility: function (event) {
        attributesShown = event.getParameters().state;
        update();
      },

      update: update
    });
  }
);

function getRecordElement(event) {
  let id = event.getSource().getId();
  return sap.ui.getCore().getElementById(id).oParent.oParent;
}

function getCustomIdFromRecord(record) {
  return record.mAggregations.content[0].mAggregations.customData[2].mProperties.value;
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
      tree[k] = (typeof arr[0] != "object") ? arr[0] : arr;
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
  // data
  clearTree(model.data);

  // preview

  let attributes = attributesShown ? model.allAttributes : [];
  let fontSize = view.byId("fontSizeSlider").getValue();
  model.preview = HTMLtoFormatted(
    CustomJSONToXML(model.data, attributes, formatter),
    fontSize
  );

  //update attributes
  model.allAttributes.forEach((originalAttribute, originalAttributeIndex) => {
    for (let attribute of model.selectedAttributes) {
      if (originalAttribute.id == attribute.id) {
        this[originalAttributeIndex] = attribute;
        break;
      }
    }
  })

  // graphics
  view.byId("undoButton").setEnabled(dataQueueIndex > 0);
  view.byId("redoButton").setEnabled(dataQueueIndex < dataQueue.length - 1);

  let currentData = JSON.stringify({ noAttributes: model.data, attributes: model.allAttributes });
  let originalData = JSON.stringify(dataQueue[0]);
  view.byId("resetButton").setEnabled(currentData != originalData);

  jsonModel.updateBindings(true);
  for (let node of tree.getItems()) {
    let id = getCustomIdFromRecord(node);
    let subTree = findSubTreeById(model.data, id);
    if (subTree != undefined)
      node
        .getContent()[0].getContent()
      [VALUE_LABEL_INDEX].setVisible(!Array.isArray(subTree.value));
    else
      console.error(
        "You shouldn't reach this point. subtree.value is undefined"
      );

    let keyLabel = node.getContent()[0].getContent()[KEY_LABEL_INDEX];
    keyLabel.setWidth(keyLabel.getText().length + 6 + "em");

    let valueLabel = node.getContent()[0].getContent()[VALUE_LABEL_INDEX];
    valueLabel.setWidth(valueLabel.getText().length + 6 + "em");
  }

  jsonModel.updateBindings(true);
}

function onModify() {
  let currentData = {
    noAttributes: model.data,
    attributes: model.allAttributes
  };
  let currentDataString = JSON.stringify(currentData);
  let previousData = JSON.stringify(dataQueue[dataQueueIndex]);
  if (currentDataString != previousData) {
    dataQueue = dataQueue.slice(0, ++dataQueueIndex);
    let dataCopy = JSON.parse(currentDataString);
    dataQueue.push(dataCopy);
  }
}
