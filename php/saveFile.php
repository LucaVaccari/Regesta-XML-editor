<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$userId = $_SESSION['userId'];
$fileId = $_SESSION['fileId'];
$fileName = $_GET['fileName'];
$fileContent = $_GET['fileContent'];
$lastModification = $_GET['date'];

$sql = ('UPDATE files 
    SET userId = ' . $userId . ', fileName = "' . $fileName . '", fileContent = \'' . $fileContent . '\', lastModification = "' . $lastModification . '" 
    where fileId = ' . $fileId);
$con->query($sql);

echo $_GET["comeBack"];

if ($_GET["comeBack"] == "true")
    header("location: ../editor.php");
else
    header("location: ../management.php");
