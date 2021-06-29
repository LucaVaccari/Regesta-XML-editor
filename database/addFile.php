<?php

include '../global.php';

$sql = ('SELECT MAX(fileId) from files');
$result = $con->query($sql);

$fileId = mysqli_fetch_row($result)[0] + 1;
$userId = $_GET["userId"];
$fileName = $_GET["fileName"];
$fileContent = $_GET["fileContent"];

$sql = ('INSERT INTO files (fileId, userId, fileName, fileContent) VALUES (' . $fileId . ', "' . $userId . '", "' . $fileName . '", ' . $fileContent . ')');
$con->query($sql);

header("location: managementLoader.php?userId=" . $userId);
