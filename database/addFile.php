<?php

$host = "sql11.freemysqlhosting.net";
$user = "sql11421864";
$password = 'mdTT1WcU9a';
$db_name = "sql11421864";

$con = mysqli_connect($host, $user, $password, $db_name);
if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
}

$sql = ('SELECT MAX(fileId) from files');
$result = $con->query($sql);

$fileId = mysqli_fetch_row($result)[0] + 1;
$userId = $_GET["userId"];
$fileName = $_GET["fileName"];

$sql = ('INSERT INTO files (fileId, userId, fileName, fileContent) VALUES (' . $fileId . ', "' . $userId . '", "' . $fileName . '", "<empty></empty>")');
$con->query($sql);

header("location: managementLoader.php?userId=" . $userId);
