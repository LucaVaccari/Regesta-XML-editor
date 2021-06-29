sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  (Controller, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Editor", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        view = this.getView();
        view.setModel(jsonModel);

        originalTree = view.byId("tree");
        root = originalTree.getItems()[0];

        updateModel();
        let initData = {
          noAttributes: model.data,
          attributes: model.allAttributes,
        };
        dataQueue[0] = JSON.parse(JSON.stringify(initData));

        sap.ui.getCore().attachValidationError(function (oEvent) {
          oEvent.getParameter("element").setValueState(ValueState.Error);
        });
        sap.ui.getCore().attachValidationSuccess(function (oEvent) {
          oEvent.getParameter("element").setValueState(ValueState.None);
        });

        update();
      },

      onEdit: function () {
        if (selectedItem != undefined) selectedItem.editing = true;
        jsonModel.updateBindings(true);
      },

      onEditAttributes: function () {
        closeKeyValueInputs();

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
          popover.openBy(originalTree.getSelectedItems()[0]);
          popoverView = popover;
        });
      },

      onSubmit: function (event) {
        selectedItem = findSubTreeById(
          model.data[0],
          getCustomIdFromRecord(getRecordElement(event))
        );
        if (selectedItem != undefined) selectedItem.editing = false;

        onModify();
        update();
      },

      onKeyValueEditLive: function (event) {
        let selected = getRecordElement(event);
        let buttons = selected.getContent()[0].getContent();

        let id = getCustomIdFromRecord(selected);
        let subTree = findSubTreeById(model.data, id);
        subTree.key = buttons[KEY_INPUT_INDEX].getValue().replaceAll(
          /[^\w-_]+/g,
          ""
        );
        if (!Array.isArray(subTree.value))
          subTree.value = buttons[VALUE_INPUT_INDEX].getValue().replaceAll(
            /[^\w\s.,;\:\-_\'\?\^\|\\\/\"\`~@#!+*\(\)£$%&=àèéìòù°§ç]+/g,
            ""
          );

        if (!subTree.key) {
          subTree.key = "key";
          jsonModel.updateBindings(true);
          buttons[KEY_INPUT_INDEX].selectText(0, 3);
        }

        updateModel();
        updatePreview();

        jsonModel.updateBindings(true);
      },

      onAdd: function () {
        let selected = originalTree.getSelectedItems()[0];
        if (selectedItem == undefined) return;

        let subTreeValue = {
          key: "key",
          value: "value",
          id: lastElementId++,
          editing: false,
        };
        if (Array.isArray(selectedItem.value))
          selectedItem.value.push(subTreeValue);
        else {
          subTreeValue.value = selectedItem.value;
          selectedItem.value = [subTreeValue];
        }

        closeKeyValueInputs();
        onModify();
        update();

        originalTree.expand(originalTree.indexOfItem(selected));

        update();
      },

      onRemove: function () {
        closeKeyValueInputs();

        if (selectedItem == undefined) return;

        if (selectedItem.id == model.data[0].id) {
          console.warn("Cannot remove root node");
          return;
        }

        let id = selectedItem.id;

        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        // remove attributes
        removeAttributesInSubTree(selectedItem);
        function removeAttributesInSubTree(tree) {
          if (Array.isArray(tree.value)) {
            model.allAttributes = model.allAttributes.filter(
              (a) => a.parentId != tree.id
            );
            for (let el of tree.value) {
              removeAttributesInSubTree(el);
            }
          } else {
            model.allAttributes = model.allAttributes.filter(
              (a) => a.parentId != tree.id
            );
          }
        }

        if (parent.value.length <= 1) {
          parent.value = Array.isArray(subTree.value) ? "" : subTree.value;
        }

        for (let key in selectedItem) delete subTree[key];

        clearTree(model.data);

        onModify();
        selectedItem = undefined;
        update();
        update();
      },

      onDuplicate: function () {
        if (selectedItem == undefined) return;

        let id = selectedItem.id;
        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        if (id == model.data[0].id) {
          console.warn("Cannot duplicate root node");
          return;
        }

        let newSubTree = {
          key: subTree.key,
          value: replaceIds(subTree.value),
          id: lastElementId++,
          editing: false,
        };

        // add attributes
        addAttributesInSubTree(subTree, newSubTree);
        function addAttributesInSubTree(originalTree, newTree) {
          let filteredAttributes = model.allAttributes.filter(
            (a) => a.parentId == originalTree.id
          );
          if (Array.isArray(originalTree.value)) {
            for (let index in originalTree.value) {
              for (let attribute of filteredAttributes) {
                model.allAttributes.push({
                  id: lastElementId++,
                  attributeKey: attribute.attributeKey,
                  attributeValue: attribute.attributeValue,
                  parentId: newTree.id,
                });
              }
              addAttributesInSubTree(
                originalTree.value[index],
                newTree.value[index]
              );
            }
          } else {
            for (let attribute of filteredAttributes) {
              model.allAttributes.push({
                id: lastElementId++,
                attributeKey: attribute.attributeKey,
                attributeValue: attribute.attributeValue,
                parentId: newTree.id,
              });
            }
          }
        }

        if (Array.isArray(parent.value)) {
          for (let index in parent.value) {
            if (parent.value[index].id == id) {
              parent.value.splice(Number(index) + 1, 0, newSubTree);
              break;
            }
          }
        } else {
          console.warn("You shouldn't reach this point onDuplicate");
        }

        closeKeyValueInputs();
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
        window.location.href = `database/managementLoader.php?userId=${userId}`;
      },

      onUndo: function () {
        if (dataQueueIndex >= 1) {
          let previousData = JSON.parse(
            JSON.stringify(dataQueue[--dataQueueIndex])
          );
          model.data = previousData.noAttributes;
          model.allAttributes = previousData.attributes;
        }

        update();
      },

      onRedo: function () {
        if (dataQueueIndex < dataQueue.length - 1) {
          let previousData = JSON.parse(
            JSON.stringify(dataQueue[++dataQueueIndex])
          );
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

      onSelect: function (event) {
        closeKeyValueInputs();
        let element = event.getParameter("listItem");
        let id = getCustomIdFromRecord(element);
        selectedItem = findSubTreeById(model.data[0], id);
        if (selectedItem == undefined) return;
        id = selectedItem.id;

        model.somethingSelected = true;
        model.isRootSelected = id == getCustomIdFromRecord(root);

        model.selectedAttributes = model.allAttributes.filter(
          (a) => a.parentId == id
        );

        jsonModel.updateBindings(true);
      },

      onXMLSwitch: function () {
        formatter = XMLformatter;
        update();
      },

      onCompactXMLSwitch: function () {
        formatter = compactXMLformatter;
        update();
      },

      onJSONSwitch: function () {
        formatter = JSONformatter;
        update();
      },

      onExport: function () {
        formatter = cleanFormatter;
        let output = CustomJSONToXML(
          model.data,
          model.allAttributes,
          formatter
        ).replaceAll(/\t|\n/g, "");
        window.location.href = `database/saveFile.php?userId=${userId}&fileId=${fileId}&fileName=${model.title}&fileContent=${output}`;
      },

      onAttributesModify: function () {
        onModify();
        update();
      },

      onAttributeModifyLive: function (event) {
        let inputParent = event.getSource().oParent;
        let id =
          inputParent.oParent.mAggregations.customData[0].mProperties.value;
        for (let attr of model.allAttributes) {
          if (attr.id == id) {
            let inputs = inputParent.mAggregations.items;
            attr.attributeKey = inputs[0]
              .getValue()
              .replaceAll(/[^\w-_:]+|^:$/g, "");
            attr.attributeValue = inputs[1]
              .getValue()
              .replaceAll(
                /[^\w\s.,;\:\-_\'\?\^\|\\\/\"\`~@#!+*\(\)£$%&=àèéìòù°§ç]+/g,
                ""
              );

            if (!attr.attributeKey) {
              attr.attributeKey = "attributeName";
              jsonModel.updateBindings(true);
              inputs[0].selectText(0, 50);
            }

            updateModel();
            updatePreview();

            jsonModel.updateBindings(true);
            break;
          }
        }
      },

      onAddAttribute: function () {
        // selected = originalTree.getSelectedItems()[0];
        let newAttr = {
          id: lastElementId++,
          attributeKey: "name",
          attributeValue: "value",
          parentId: selectedItem.id,
        };

        model.selectedAttributes.push(newAttr);
        model.allAttributes.push(newAttr);
        this.onAttributesModify();
      },

      onRemoveAttribute: function (event) {
        let item = event.getParameter("listItem");
        let id = item.mAggregations.customData[0].mProperties.value;
        model.selectedAttributes = model.selectedAttributes.filter(
          (a) => a.id != id
        );
        model.allAttributes = model.allAttributes.filter((a) => a.id != id);
        this.onAttributesModify();
      },

      onClearAttributes: function () {
        // selected = originalTree.getSelectedItems()[0];
        let parentId = selectedItem.id;

        model.allAttributes = model.allAttributes.filter(
          (a) => a.parentId != parentId
        );
        model.selectedAttributes = [];
        this.onAttributesModify();
      },

      onToggleAttributesVisibility: function (event) {
        attributesShown = event.getParameters().state;
        update();
      },

      onTitleEdit: function () {
        view.byId("titleLabel").setVisible(false);
        view.byId("titleInput").setVisible(true);
      },

      onTitleChange: function () {
        view.byId("titleLabel").setVisible(true);
        view.byId("titleInput").setVisible(false);
      },

      onDownloadPreview: function () {
        console.log("Downloading preview");
      },

      update: update,

      updatePreview: updatePreview,
    });
  }
);
