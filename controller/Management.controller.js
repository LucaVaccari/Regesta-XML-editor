let view, popoverView;

let jsonModel,
  lastFileId = 0;

sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
  ],
  (Controller, JSONModel, Fragment, ResourceModel, MessageToast) => {
    "use strict";

    return Controller.extend("sap.ui.demo.walkthrough.controller.Management", {
      onInit: function () {
        view = this.getView();
        let i18Model = new ResourceModel({
          bundleUrl: "i18n/management/i18n.properties",
        });
        view.setModel(i18Model, "i18n");
        jsonModel = new JSONModel(model);
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
        download(
          `${element.name}.xml`,
          element.content
            .replaceAll("&gt;", ">")
            .replaceAll("&lt;", "<")
            .replaceAll("&quot;", '"')
        );
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
            let fileContent = file.currentTarget.result
              .replaceAll(/\n|\t/g, " ")
              .replaceAll(/\s+/g, " ")
              .replaceAll(/>\s+</g, "><");
            //.replaceAll(/'/g, "''");

            console.log(fileContent);

            let parser = new DOMParser();
            let parsererrorNS = parser
              .parseFromString("INVALID", "application/xml")
              .getElementsByTagName("parsererror")[0].namespaceURI;
            let dom = parser.parseFromString(fileContent, "application/xml");
            if (
              dom.getElementsByTagNameNS(parsererrorNS, "parsererror").length >
              0
            ) {
              let bundle = view.getModel("i18n").getResourceBundle();
              var message = bundle.getText(
                "FileUploadErrorText",
                fileName + ".xml"
              );
              MessageToast.show(message);
              console.log(dom);
              return;
            }

            console.log(fileContent);
            let date = new Date();
            let dateString = formatDateToSQL(date).split(" ")[0];
            window.location.href = `php/addFile.php?fileName=${fileName}&fileContent=${fileContent.replaceAll(
              /'/g,
              "''"
            )}&date=${dateString}`;
          };

          reader.readAsText(file);
        });
      },

      onLogOut: function () {
        window.location.href = "php/logout.php";
      },
    });
  }
);

function updateGraphics() {
  jsonModel.updateBindings(true);
}
