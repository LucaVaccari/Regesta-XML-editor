<?php

include 'global.php';

$txtName = $_POST['name'];

$sql = ('SELECT MAX(id) from accounts');
$result = $con->query($sql);
$id = mysqli_fetch_row($result)[0] + 1;

$txtEmail = $_POST['email'];
$txtPass = $_POST['psw'];

$sql = "INSERT INTO `accounts` (`name`, `id`,`email`,`password`) VALUES ('$txtName', $id,'$txtEmail', '$txtPass')";
$con->query($sql);

header("location: index.php");
