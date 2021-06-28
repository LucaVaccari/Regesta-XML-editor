sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Management", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        let view = this.getView();
        view.setModel(jsonModel);
      },

      onAdd: function () {
        window.location.href = `database/addFile.php?userId=${userId}&fileName=Untitled`;
      },

      onDelete: function (event) {
        let id =
          event.getParameter("listItem").mAggregations.content[0].mAggregations
            .customData[0].mProperties.value;
        window.location.href = `database/removeFile.php?fileId=${id}&userId=${userId}`;
      },

      onEdit: function (event) {
        let tile = getRecordElement(event);
        let id = getCustomIdFromRecord(tile);
        window.location.href = `editor.php?userId=${userId}&fileId=${id}`;
      },

      onDownload: function (event) {
        let tile = getRecordElement(event);
        let id = getCustomIdFromRecord(tile);
        let element = model.files.filter((file) => file.id == id)[0];
        download(`${element.title}.xml`, element.content);
      },

      onClearFiles: function () {
        window.location.href = `database/clearDBfiles.php?userId=${userId}`;
      },

      onHomePage: function () {
        window.location.href = `index.php`;
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

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/xml;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
