<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>Manage XVE files</title>

  <script src="js/functions.js"></script>
  <script src="controller/controllerFunctions.js"></script>

  <?php
  include "php/global.php";

  if (!$_SESSION["logged"] || !isset($_SESSION["logged"]))
    header("location: login.php");

  $userId = $_SESSION["userId"];

  $sql = "SELECT * from accounts where id = " . $userId;
  $result = $con->query($sql);
  $row = mysqli_fetch_array($result);

  if ($row["name"] != $_SESSION["username"] || $row["password"] != $_SESSION["password"]) {
    // header("location: https://youtu.be/dQw4w9WgXcQ"); // (Rick Roll)😃😃
    header("location: login.php");
  }

  echo "<script>
    let userId = " . $userId . ";
    let model = {
      files: [],
    };
    model.username = '" . $row["name"] . "';\n
    </script>\n";


  $sql = ("SELECT * from files where userId = " . $userId);
  $result = $con->query($sql);

  if ($result) {
    echo "<script>\n";
    while ($row = mysqli_fetch_array($result)) {
      echo "model.files.push({
        id: " . $row["fileId"] . ",
        userId: " . $row["userId"] . ",
        name: `" . $row["fileName"] . "`,
        content: `" . htmlspecialchars($row["fileContent"]) . "`,
        lastModification: `" . $row["lastModification"] . "`, 
      });\n";
    }
    echo "</script>\n";
  }
  ?>

  <script id="sap-ui-bootstrap" src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js" data-sap-ui-theme="sap_belize" data-sap-ui-libs="sap.m" data-sap-ui-compatVersion="edge" data-sap-ui-xx-bindingSyntax="complex" data-sap-ui-async="true" data-sap-ui-onInit="module:sap/ui/demo/walkthrough/js/management" data-sap-ui-resourceroots='{
        "sap.ui.demo.walkthrough": "./"
      }'>
  </script>
</head>

<body class="sapUiBody" id="content"></body>

</html>