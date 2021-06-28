<?php

$host = "localhost";
$user = "root";
$password = '';
$db_name = "regesta-XML-editor-db";

$con = mysqli_connect($host, $user, $password, $db_name);
if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
}

$userId = $_GET['userId'];

$sql = ('DELETE FROM files WHERE userId = ' . $userId);
$con->query($sql);

header("location: managementLoader.php?userId=" . $userId);
