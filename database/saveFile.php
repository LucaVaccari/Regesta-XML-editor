<?php

$host = "localhost";
$user = "root";
$password = '';
$db_name = "users";

$con = mysqli_connect($host, $user, $password, $db_name);
if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
}

$userId = $_GET['userId'];
$fileId = $_GET['fileId'];
$fileName = $_GET['fileName'];
$fileContent = $_GET['fileContent'];

echo $userId . "<br>";
echo $fileId . "<br>";
echo $fileName . "<br>";
echo '"' . $fileContent . '"' . "<br>";

$sql = ('UPDATE file SET idUser = "' . $userId . '", fileName = "' . $fileName . '", fileContent = "' . $fileContent . '" where idFile = ' . $fileId);
$con->query($sql);

header("location: ../management.php?userId=" . $userId);
