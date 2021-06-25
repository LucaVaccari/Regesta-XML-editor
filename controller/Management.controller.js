sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
    ],
    (Controller, JSONModel) => {
        "use strict";

        return Controller.extend("sap.ui.demo.walkthrough.controller.Management", {
            onInit: function () {
                let jsonModel = new JSONModel({
                    data: [
                        "sus", "sas", "ses", "sis", "sos",
                    ],
                });
                let view = this.getView();
                view.setModel(jsonModel);
            }
        });
    }
);