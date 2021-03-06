sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel",
  ],
  (Controller, JSONModel, Fragment, ResourceModel) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Editor", {
      onAddAttribute: function () {
        let newAttr = {
          id: lastElementId++,
          attributeKey: "name",
          attributeValue: "value",
          parentId: selectedItem.id,
        };

        while (
          model.selectedAttributes.filter(
            (a) => a.attributeKey == newAttr.attributeKey
          ).length > 0
        ) {
          newAttr.attributeKey = newAttr.attributeKey + "_";
          jsonModel.updateBindings(true);
        }

        model.selectedAttributes.push(newAttr);
        model.allAttributes.push(newAttr);
        jsonModel.updateBindings(true);
        this.onAttributesModify();
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

      onAttributeNameModifyLive: function (event) {
        let attributeNameInput = event.getSource();
        let id = getItemCustomId(attributeNameInput);
        for (let attr of model.allAttributes) {
          if (attr.id == id) {
            attr.attributeKey = attributeNameInput
              .getValue()
              .replaceAll(/[^\w-_:'"]+|^:$/g, "");

            if (!attr.attributeKey) {
              attr.attributeKey = "attributeName";
              jsonModel.updateBindings(true);
              attributeNameInput.selectText(0, 50);
            }

            while (
              model.selectedAttributes.filter(
                (a) => a.attributeKey == attr.attributeKey
              ).length > 1
            ) {
              attr.attributeKey = attr.attributeKey + "_";
              jsonModel.updateBindings(true);
              attributeNameInput.selectText(
                attr.attributeKey.length - 1,
                attr.attributeKey.length
              );
            }

            updateModel();
            updatePreview();

            jsonModel.updateBindings(true);
            break;
          }
        }
      },

      onAttributesModify: function () {
        onModify();
        update();
      },

      onAttributeValueModifyLive: function (event) {
        let attributeValueInput = event.getSource();
        let id = getItemCustomId(attributeValueInput);
        for (let attr of model.allAttributes) {
          if (attr.id == id) {
            attr.attributeValue = attributeValueInput
              .getValue()
              .replaceAll(
                /[^\w\s.,;\:\-_\'\?\^\|\\\/\`~@#!+*\(\)??$%&=??????????????????]+/g,
                ""
              );

            updateModel();
            updatePreview();

            jsonModel.updateBindings(true);
            break;
          }
        }
      },

      onBack: function () {
        formatter = cleanFormatter;
        let output = CustomJSONToXML(
          model.data,
          model.allAttributes,
          formatter
        ).replaceAll(/\t|\n/g, "");
        let date = new Date();
        let dateString = formatDateToSQL(date).split(" ")[0];
        window.location.href = `php/saveFile.php?fileName=${model.title}&fileContent=${output}&date=${dateString}&comeBack=false`;
      },

      onCancel: function () {
        window.location.href = `management.php`;
      },

      onClearAttributes: function () {
        let parentId = selectedItem.id;

        model.allAttributes = model.allAttributes.filter(
          (a) => a.parentId != parentId
        );
        model.selectedAttributes = [];
        this.onAttributesModify();
      },

      onCompactXMLSwitch: function () {
        formatter = compactXMLformatter;
        previewFormatter = compactXMLPreviewFormatter;
        model.preview.mimeType = "application/xml";
        update();
      },

      onDownloadPreview: function () {
        let output = CustomJSONToXML(
          model.data,
          model.preview.showAttributes ? model.allAttributes : [],
          previewFormatter
        );

        download(model.title, output, model.preview.mimeType);
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
          popover.openBy(originalTree.getSelectedItem());
          popoverView = popover;
        });
      },

      onEdit: function () {
        if (selectedItem != undefined) selectedItem.editing = true;
        jsonModel.updateBindings(true);
      },

      onInit: function () {
        view = this.getView();

        let i18Model = new ResourceModel({
          bundleUrl: "i18n/editor/i18n.properties",
        });
        view.setModel(i18Model, "i18n");
        jsonModel = new JSONModel(model);
        view.setModel(jsonModel);

        originalTree = view.byId("tree");

        updateModel();
        let initData = {
          noAttributes: model.data,
          attributes: model.allAttributes,
        };
        dataQueue[0] = JSON.parse(JSON.stringify(initData));

        update();
      },

      onJSONSwitch: function () {
        formatter = JSONformatter;
        previewFormatter = JSONPreviewFormatter;
        model.preview.mimeType = "application/json";
        update();
      },

      onKeyEditLive: function (event) {
        let keyInput = event.getSource();
        let id = getItemCustomId(event.getSource());
        let subTree = findSubTreeById(model.data[0], id);
        subTree.key = keyInput.getValue().replaceAll(/[^\w-_\'\"]+/g, "");

        if (!subTree.key) {
          subTree.key = "key";
          jsonModel.updateBindings(true);
          keyInput.selectText(0, 3);
        }

        updateModel();
        updatePreview();
        jsonModel.updateBindings(true);
      },

      onMoveDown: function (event) {
        let id = getItemCustomId(event.getSource());
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

      onMoveUp: function (event) {
        let id = getItemCustomId(event.getSource());
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

      onRemoveAttribute: function (event) {
        let item = event.getParameters().listItem;
        let id = getItemCustomId(item);
        model.selectedAttributes = model.selectedAttributes.filter(
          (a) => a.id != id
        );
        model.allAttributes = model.allAttributes.filter((a) => a.id != id);
        this.onAttributesModify();
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
        update();
      },

      onReset: function () {
        let previousData = JSON.parse(JSON.stringify(dataQueue[0]));
        model.data = previousData.noAttributes;
        model.allAttributes = previousData.attributes;
        onModify();
        update();
      },

      onSave: function () {
        formatter = cleanFormatter;
        let output = CustomJSONToXML(
          model.data,
          model.allAttributes,
          formatter
        ).replaceAll(/\t|\n/g, "");
        let date = new Date();
        let dateString = formatDateToSQL(date).split(" ")[0];
        window.location.href = `php/saveFile.php?fileName=${model.title}&fileContent=${output}&date=${dateString}&comeBack=true`;
      },

      onSelect: function (event) {
        closeKeyValueInputs();
        let id = getItemCustomId(event.getParameters().listItem);
        selectedItem = findSubTreeById(model.data[0], id);
        if (selectedItem == undefined) return;
        id = selectedItem.id;

        model.somethingSelected = true;
        model.isRootSelected = id == 0;

        model.selectedAttributes = model.allAttributes.filter(
          (a) => a.parentId == id
        );

        updatePreview();
        jsonModel.updateBindings(true);
      },

      onSubmit: function (event) {
        selectedItem = findSubTreeById(
          model.data[0],
          getItemCustomId(event.getSource())
        );
        if (selectedItem != undefined) selectedItem.editing = false;

        onModify();
        update();
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

      onTitleChange: function () {
        model.editingTitle = false;
        jsonModel.updateBindings(true);
      },

      onTitleEdit: function () {
        model.editingTitle = true;
        jsonModel.updateBindings(true);
      },

      onTitleModifyLive: function (event) {
        let titleInput = event.getSource();
        model.title = titleInput
          .getValue()
          .replaceAll(/[^\w-_\'\"']+/g, "")
          .slice(0, 30);

        updateModel();
        updatePreview();

        jsonModel.updateBindings(true);
      },

      onValueEditLive: function (event) {
        let valueInput = event.getSource();
        let id = getItemCustomId(event.getSource());
        let subTree = findSubTreeById(model.data[0], id);
        if (!Array.isArray(subTree.value))
          subTree.value = valueInput
            .getValue()
            .replaceAll(
              /[^\w\s.,;\:\-_\?\^\|\\\/\`~@#!+*\(\)??$%&=??????????????????]+/g,
              ""
            );

        updateModel();
        updatePreview();
        jsonModel.updateBindings(true);
      },

      onXMLSwitch: function () {
        formatter = XMLformatter;
        previewFormatter = XMLPreviewFormatter;
        model.preview.mimeType = "application/xml";
        update();
      },

      update: update,

      updatePreview: updatePreview,
    });
  }
);
