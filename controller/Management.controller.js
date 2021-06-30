let view, popoverView;

let jsonModel,
  lastFileId = 0;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
  ],
  (Controller, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Management", {
      onInit: function () {
        jsonModel = new JSONModel(model);
        view = this.getView();
        view.setModel(jsonModel);
      },

      onAdd: function (event) {
        var button = event.getSource();

        // create popover
        if (!this._popover) {
          this._popover = Fragment.load({
            id: view.getId(),
            name: "sap.ui.demo.walkthrough.view.AddFile",
            controller: this,
          }).then(function (popover) {
            view.addDependent(popover);
            return popover;
          });
        }
        this._popover.then(function (popover) {
          popoverView = popover;
          popover.openBy(button);
        });
      },

      onDelete: function (event) {
        let id = getItemCustomId(event.getParameters().listItem);
        window.location.href = `php/removeFile.php?fileId=${id}`;
      },

      onEdit: function (event) {
        let id = getItemCustomId(event.getSource());
        window.location.href = `editor.php?fileId=${id}`;
      },

      onDownload: function (event) {
        let id = getItemCustomId(event.getSource());
        let element = model.files.filter((file) => file.id == id)[0];
        download(`${element.name}.xml`, element.content);
      },

      onClearFiles: function () {
        window.location.href = `php/clearDBfiles.php`;
      },

      onHomePage: function () {
        window.location.href = `index.php`;
      },

      onCreateEmptyFile: function () {
        let date = new Date();
        let dateString = formatDateToSQL(date).split(" ")[0];
        window.location.href = `php/addFile.php?fileName=Untitled&fileContent=<empty />&date=${dateString}`;
      },

      onFileUpload: function (event) {
        let fileUploader = event.getSource();
        fileUploader.checkFileReadable().then(() => {
          let fileName = fileUploader.getValue().replaceAll(/\..*$/g, "");

          let file = jQuery.sap.domById(fileUploader.getId() + "-fu").files[0];
          let reader = new FileReader();

          reader.onload = (file) => {
            let fileContent = file.currentTarget.result.replaceAll(/'/g, '"').replaceAll(/\n|\t/g, "");
            let date = new Date();
            let dateString = formatDateToSQL(date).split(" ")[0];
            window.location.href = `php/addFile.php?fileName=${fileName}&fileContent=${fileContent}&date=${dateString}`;
          };

          reader.readAsText(file);
        });
      },
    });
  }
);

function updateGraphics() {
  jsonModel.updateBindings(true);
}
