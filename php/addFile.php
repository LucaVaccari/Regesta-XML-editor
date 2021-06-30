<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$sql = ('SELECT COALESCE(MAX(fileId), 0) from files');
$result = $con->query($sql);

if ($result->num_rows <= 0)
    $fileId = 0;
else {
    $result = mysqli_fetch_row($result);
    $fileId = $result[0] + 1;
}

$userId = $_SESSION["userId"];
$fileName = $_GET["fileName"];
$fileContent = $_GET["fileContent"];
$lastModification = $_GET["date"];

$sql = ('INSERT INTO files (fileId, userId, fileName, fileContent, lastModification) 
    VALUES (' . $fileId . ', "' . $userId . '", "' . $fileName . '", \'' . $fileContent . '\', "' . $lastModification . '")');
$con->query($sql);

header("location: ../management.php");
