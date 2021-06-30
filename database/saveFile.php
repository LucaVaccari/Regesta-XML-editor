<?php

include '../global.php';

$userId = $_GET['userId'];
$fileId = $_GET['fileId'];
$fileName = $_GET['fileName'];
$fileContent = $_GET['fileContent'];
$lastModification = $_GET['date'];

echo $userId . "<br>";
echo $fileId . "<br>";
echo $fileName . "<br>";
echo '"' . $fileContent . '"' . "<br>";

$sql = ('UPDATE files 
    SET userId = "' . $userId . '", fileName = "' . $fileName . '", fileContent = \'' . $fileContent . '\', lastModification = "' . $lastModification . '" 
    where fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php?userId=" . $userId);
