<?php

include '../global.php';

$userId = $_GET['userId'];
$fileId = $_GET['fileId'];
$fileName = $_GET['fileName'];
$fileContent = $_GET['fileContent'];

echo $userId . "<br>";
echo $fileId . "<br>";
echo $fileName . "<br>";
echo '"' . $fileContent . '"' . "<br>";

$sql = ('UPDATE files SET userId = "' . $userId . '", fileName = "' . $fileName . '", fileContent = "' . $fileContent . '" where fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php?userId=" . $userId);
