<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>XVE - In Editor</title>

  <script src="js/formatters/formatter.js"></script>
  <script src="js/formatters/htmlFormatter.js"></script>
  <script src="js/formatters/jsonFormatter.js"></script>
  <script src="js/formatters/jsonHtmlFormatter.js"></script>
  <script src="js/converters.js"></script>
  <script src="js/customJSON.js"></script>
  <script src="js/editorVariables.js"></script>
  <script src="controller/controllerFunctions.js"></script>
  <script src="js/functions.js"></script>

  <?php
  include 'php/global.php';

  if (!$_SESSION["logged"])
    header("location: index.php");

  $userId = $_SESSION["userId"];

  if (isset($_GET["fileId"])) {
    $_SESSION["fileId"] = $_GET["fileId"];
    header("location: editor.php");
  }

  $fileId = $_SESSION['fileId'];

  $sql = ('SELECT * from files WHERE fileId = ' . $fileId . ' and userId = ' . $userId);
  $result = $con->query($sql);

  $row = mysqli_fetch_array($result);

  echo "<script>\n";
  echo "let userId = `" . $userId . "`;\n";
  echo "let fileId = `" . $fileId . "`;\n";
  echo "model.username = '" . $_SESSION["username"] . "';\n";
  echo 'model.preview.content = `' . $row["fileContent"] . "`;\n";
  echo "model.title = `" . $row["fileName"] . "`;\n";
  echo "customJson = XMLtoCustomJSON(model.preview.content);\n
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