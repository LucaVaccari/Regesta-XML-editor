<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>XML Visual Editor</title>

  <script src="js/managementFunctions.js"></script>

  <?php
  if (!session_id()) session_start();
  echo '<script>
        let userId = ' . $_GET['userId'] . ';
      </script>';

  $host = "localhost";
  $user = "root";
  $password = '';
  $db_name = "regesta-XML-editor-db";

  $con = mysqli_connect($host, $user, $password, $db_name);
  if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
  }

  $sql = ("SELECT * from files where userId = " . $_GET["userId"]);
  $result = $con->query($sql);

  echo "<script>\n";
  while ($row = mysqli_fetch_array($result)) {
    echo "model.files.push({
      id: " . $row["fileId"] . ",
      userId: " . $row["userId"] . ",
      name: `" . $row["fileName"] . "`,
      content: `" . $row["fileContent"] . "`,
    });\n";
  }
  echo "</script>\n";

  // riempire l'array "files" del modello JS
  ?>

  <script id="sap-ui-bootstrap" src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js" data-sap-ui-theme="sap_belize" data-sap-ui-libs="sap.m" data-sap-ui-compatVersion="edge" data-sap-ui-xx-bindingSyntax="complex" data-sap-ui-async="true" data-sap-ui-onInit="module:sap/ui/demo/walkthrough/js/management" data-sap-ui-resourceroots='{
        "sap.ui.demo.walkthrough": "./"
      }'></script>
</head>

<body class="sapUiBody" id="content"></body>

</html>