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
          popover.openBy(originalTree.getSelectedItem());
          popoverView = popover;
        });
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

      onKeyEditLive: function (event) {
        let keyInput = event.getSource();
        let id = getItemCustomId(event.getSource());
        let subTree = findSubTreeById(model.data[0], id);
        subTree.key = keyInput.getValue().replaceAll(
          /[^\w-_]+/g,
          ""
        );

        if (!subTree.key) {
          subTree.key = "key";
          jsonModel.updateBindings(true);
          keyInput.selectText(0, 3);
        }

        updateModel();
        updatePreview();
        jsonModel.updateBindings(true);
      },

      onValueEditLive: function (event) {
        let valueInput = event.getSource();
        let id = getItemCustomId(event.getSource());
        let subTree = findSubTreeById(model.data[0], id);
        if (!Array.isArray(subTree.value))
          subTree.value = valueInput.getValue().replaceAll(
            /[^\w\s.,;\:\-_\'\?\^\|\\\/\"\`~@#!+*\(\)£$%&=àèéìòù°§ç]+/g,
            ""
          );

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
        update();
        selectedItem = findSubTreeById(model.data[0], getItemCustomId(originalTree.getSelectedItem()));
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

      onCancel: function () {
        window.location.href = `management.php`;
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
        selectedItem = findSubTreeById(model.data[0], getItemCustomId(originalTree.getSelectedItem()));
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
        selectedItem = findSubTreeById(model.data[0], getItemCustomId(originalTree.getSelectedItem()));
        update();
      },

      onReset: function () {
        let previousData = JSON.parse(JSON.stringify(dataQueue[0]));
        model.data = previousData.noAttributes;
        model.allAttributes = previousData.attributes;
        onModify();
        update();
        selectedItem = findSubTreeById(model.data[0], getItemCustomId(originalTree.getSelectedItem()));
        update();
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

      onXMLSwitch: function () {
        formatter = XMLformatter;
        previewFormatter = XMLPreviewFormatter;
        model.preview.mimeType = "text/xml";
        update();
      },

      onCompactXMLSwitch: function () {
        formatter = compactXMLformatter;
        previewFormatter = compactXMLPreviewFormatter;
        model.preview.mimeType = "text/xml";
        update();
      },

      onJSONSwitch: function () {
        formatter = JSONformatter;
        previewFormatter = JSONPreviewFormatter;
        model.preview.mimeType = "application/json";
        update();
      },

      onExport: function () {
        formatter = cleanFormatter;
        let output = CustomJSONToXML(
          model.data,
          model.allAttributes,
          formatter
        ).replaceAll(/\t|\n/g, "");
        let date = new Date();
        let dateString = formatDateToSQL(date).split(" ")[0];
        window.location.href = `database/saveFile.php?fileName=${model.title}&fileContent=${output}&date=${dateString}`;
      },

      onAttributesModify: function () {
        onModify();
        update();
      },

      onAttributeModifyLive: function (event) {
        // TODO: decouple
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
        let parentId = selectedItem.id;

        model.allAttributes = model.allAttributes.filter(
          (a) => a.parentId != parentId
        );
        model.selectedAttributes = [];
        this.onAttributesModify();
      },

      onToggleAttributesVisibility: function (event) {
        update();
      },

      onTitleEdit: function () {
        model.editingTitle = true;
        jsonModel.updateBindings(true);
      },

      onTitleChange: function () {
        model.editingTitle = false;
        jsonModel.updateBindings(true);
      },

      onDownloadPreview: function () {

        let output = CustomJSONToXML(
          model.data,
          model.preview.showAttributes ? model.allAttributes : [],
          previewFormatter
        );

        download(model.title, output, model.preview.mimeType);
      },

      update: update,

      updatePreview: updatePreview,
    });
  }
);

function getRecordElement(event) {
  let id = event.getSource().getId();
  return sap.ui.getCore().getElementById(id).oParent.oParent;
}

function getCustomIdFromRecord(record) {
  if (record == undefined) return -1;
  return record.mAggregations.content[0].data("id");
}

function getItemCustomId(item) {
  return item ? item.data("id") : -1;
}
