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
        root
          .getContent()[0]
          .getContent()
          [MOVE_UP_BUTTON_INDEX].setVisible(false);
        root
          .getContent()[0]
          .getContent()
          [MOVE_DOWN_BUTTON_INDEX].setVisible(false);

        clearTree(model.data);
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
        selected = originalTree.getSelectedItems()[0];
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
        selected = getRecordElement(event);
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

      onKeyValueEditLive: function (event) {
        selected = getRecordElement(event);
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
        selected = originalTree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
        let subTree = findSubTreeById(model.data, id);
        let subTreeValue = {
          key: "key",
          value: "value",
          id: lastElementId++,
        };
        if (Array.isArray(subTree.value)) subTree.value.push(subTreeValue);
        else {
          subTreeValue.value = subTree.value;
          subTree.value = [subTreeValue];
        }

        closeKeyValueInputs();
        onModify();
        update();

        originalTree.expand(originalTree.indexOfItem(selected));

        update();
      },

      onRemove: function () {
        closeKeyValueInputs();

        selected = originalTree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
        if (id == model.data[0].id) {
          console.warn("Cannot remove root node");
          return;
        }

        let parent = findParentFromId(model.data[0], id);
        let subTree = findSubTreeById(model.data[0], id);

        // remove attributes
        removeAttributesInSubTree(subTree);
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

        delete subTree.key;
        delete subTree.value;
        delete subTree.id;

        clearTree(model.data);

        onModify();
        update();
        update();
      },

      onDuplicate: function () {
        selected = originalTree.getSelectedItems()[0];
        if (selected == undefined) return;

        let id = getCustomIdFromRecord(selected);
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

      onSelect: function () {
        selected = originalTree.getSelectedItems()[0];
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

        closeKeyValueInputs();
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
        update();
        model.preview = CustomJSONToXML(
          model.data,
          model.allAttributes,
          formatter,
          getCustomIdFromRecord(selected)
        );
        window.location.href = `database/saveFile.php?userId=${userId}&fileId=${fileId}&fileName=${
          model.title
        }&fileContent=${model.preview.replaceAll(/\t|\n/g, "")}`;
      },

      onAttributesModify: function () {
        onModify();
        update();
      },

      onAttributeModifyLive: function (event) {
        let inputParent = event.getSource().oParent;
        let id =
          inputParent.oParent.mAggregations.customData[0].mProperties.value;
        // console.log(model.allAttributes);
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
        selected = originalTree.getSelectedItems()[0];
        let newAttr = {
          id: lastElementId++,
          attributeKey: "name",
          attributeValue: "value",
          parentId: getCustomIdFromRecord(selected),
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
        selected = originalTree.getSelectedItems()[0];
        let parentId = getCustomIdFromRecord(selected);

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

      update: update,
    });
  }
);
