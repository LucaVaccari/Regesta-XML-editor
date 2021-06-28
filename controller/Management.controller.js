let jsonModel,
  lastFileId = 0;
let model = {
  files: [
    {
      id: lastFileId++,
      title: "Hey1",
      content: "<sus></sus>",
    },
    {
      id: lastFileId++,
      title: "Hey2",
      content: "<sus></sus>",
    },
    {
      id: lastFileId++,
      title: "Hey3",
      content: "<sus></sus>",
    },
    {
      id: lastFileId++,
      title: "Hey4",
      content: "<sus></sus>",
    },
  ],
};

sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Management", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        let view = this.getView();
        view.setModel(jsonModel);
        console.log(x);
      },

      onAdd: function () {
        console.log("Adding a new file");
        model.files.push({
          id: lastFileId++,
          title: "HeySus",
          content: "<sus></sus>",
        });
        updateGraphics();
      },

      onDelete: function (event) {
        let id =
          event.getParameter("listItem").mAggregations.content[0].mAggregations
            .customData[0].mProperties.value;
        console.log("Removing file with id " + id);
      },

      onEdit: function (event) {
        let tile = getRecordElement(event);
        let id = getCustomIdFromRecord(tile);
        console.log("Editing file with id " + id);
      },

      onDownload: function (event) {
        let tile = getRecordElement(event);
        let id = getCustomIdFromRecord(tile);
        console.log("Downloading file with id " + id);
      },
    });
  }
);

function getRecordElement(event) {
  let id = event.getSource().getId();
  return sap.ui.getCore().getElementById(id).oParent.oParent;
}

function getCustomIdFromRecord(record) {
  if (record == undefined) return -1;
  return record.mAggregations.content[0].mAggregations.customData[0].mProperties
    .value;
}

function updateGraphics() {
  jsonModel.updateBindings(true);
}
