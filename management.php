<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>XML Visual Editor</title>

  <?php
  if (!session_id()) session_start();
  echo $_GET['userId'];
  echo '<script>
        let x = "sas";
      </script>';
  ?>

  <script id="sap-ui-bootstrap" src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js" data-sap-ui-theme="sap_belize" data-sap-ui-libs="sap.m" data-sap-ui-compatVersion="edge" data-sap-ui-xx-bindingSyntax="complex" data-sap-ui-async="true" data-sap-ui-onInit="module:sap/ui/demo/walkthrough/js/management" data-sap-ui-resourceroots='{
        "sap.ui.demo.walkthrough": "./"
      }'></script>
</head>

<body class="sapUiBody" id="content"></body>

</html>