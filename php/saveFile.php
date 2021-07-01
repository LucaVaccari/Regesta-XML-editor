<?php

include 'global.php';

if (!$_SESSION["logged"] || !isset($_SESSION["logged"]))
    header("location: ../login.php");

$userId = $_SESSION['userId'];
$fileId = $_SESSION['fileId'];
$fileName = $_GET['fileName'];
$fileContent = $_GET['fileContent'];
$lastModification = $_GET['date'];

$sql = <<<EOD
UPDATE files
SET userId = $userId, fileName = "$fileName", fileContent = $fileContent, lastModification = "$lastModification"
where fileId = $fileId
EOD;
$con->query($sql);

echo $_GET["comeBack"];

if ($_GET["comeBack"] == "true")
    header("location: ../editor.php");
else
    header("location: ../management.php");
