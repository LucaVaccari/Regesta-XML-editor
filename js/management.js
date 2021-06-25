sap.ui.define(["sap/ui/core/mvc/XMLView"], function (XMLView) {
    "use strict";
  
    XMLView.create({
      viewName: "sap.ui.demo.walkthrough.view.Management",
    }).then(function (view) {
      view.placeAt("content");
    });
  });