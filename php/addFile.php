<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$sql = ('SELECT MAX(fileId) from files');
$result = $con->query($sql);

$fileId = mysqli_fetch_row($result)[0] + 1;
$userId = $_SESSION["userId"];
$fileName = $_GET["fileName"];
$fileContent = $_GET["fileContent"];
$lastModification = $_GET["date"];

$sql = ('INSERT INTO files (fileId, userId, fileName, fileContent, lastModification) 
    VALUES (' . $fileId . ', "' . $userId . '", "' . $fileName . '", \'' . $fileContent . '\', "' . $lastModification . '")');
$con->query($sql);

header("location: ../management.php");
