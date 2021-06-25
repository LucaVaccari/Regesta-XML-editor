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
                    files: [
                        {
                            id: 1,
                            title: "Hey1",
                            content: "<sus></sus>",
                        },
                        {
                            id: 2,
                            title: "Hey2",
                            content: "<sus></sus>",
                        },
                        {
                            id: 3,
                            title: "Hey3",
                            content: "<sus></sus>",
                        },
                        {
                            id: 4,
                            title: "Hey4",
                            content: "<sus></sus>",
                        }
                    ],
                });
                let view = this.getView();
                view.setModel(jsonModel);
            },

            onAdd: function() {
                
            },

            onEdit: function(event) {
                let tile = getRecordElement(event);
                let id = getCustomIdFromRecord(tile);
                console.log("Editing file with id " + id);
            },

            onDownload: function(event) {
                let tile = getRecordElement(event);
                let id = getCustomIdFromRecord(tile);
                console.log("Downloading file with id " + id);
            }
        });
    }
);

function getRecordElement(event) {
    let id = event.getSource().getId();
    return sap.ui.getCore().getElementById(id).oParent.oParent;
}

function getCustomIdFromRecord(record) {
    if (record == undefined) return -1;
    return record.mAggregations.content[0].mAggregations.customData[0].mProperties.value;
}