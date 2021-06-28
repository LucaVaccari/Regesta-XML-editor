<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>XML Visual Editor</title>

  <script src="js/formatter.js"></script>
  <script src="js/htmlFormatter.js"></script>
  <script src="js/jsonFormatter.js"></script>
  <script src="js/converters.js"></script>
  <script src="js/customJSON.js"></script>
  <script src="js/global.js"></script>
  <script src="controller/controllerFunctions.js"></script>

  <?php
  $host = "sql11.freemysqlhosting.net";
  $user = "sql11421864";
  $password = 'mdTT1WcU9a';
  $db_name = "sql11421864";

  $con = mysqli_connect($host, $user, $password, $db_name);
  if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
  }

  $userId = $_GET['userId'];
  $fileId = $_GET['fileId'];

  $sql = ('SELECT * from files WHERE fileId = ' . $fileId . ' and userId = ' . $userId);
  $result = $con->query($sql);

  $row = mysqli_fetch_array($result);

  echo "<script>\n";
  echo "let userId = `" . $userId . "`;\n";
  echo "let fileId = `" . $fileId . "`;\n";
  echo "model.preview = `" . $row["fileContent"] . "`;\n";
  echo "model.title = `" . $row["fileName"] . "`;\n";
  echo "customJson = XMLtoCustomJSON(model.preview);\n
    model.data = [customJson.noAttributesCJ];\n
    model.allAttributes = customJson.attributes;\n";
  echo "</script>\n";

  ?>

  <script id="sap-ui-bootstrap" src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js" data-sap-ui-theme="sap_belize" data-sap-ui-libs="sap.m" data-sap-ui-compatVersion="edge" data-sap-ui-xx-bindingSyntax="complex" data-sap-ui-async="true" data-sap-ui-onInit="module:sap/ui/demo/walkthrough/js/editor" data-sap-ui-resourceroots='{
        "sap.ui.demo.walkthrough": "./"
      }'></script>
</head>

<body class="sapUiBody" id="content"></body>

</html>