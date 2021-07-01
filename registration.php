<?php

include 'php/global.php';


$sql = ('SELECT MAX(id) from accounts');
$result = $con->query($sql);
$id = mysqli_fetch_row($result)[0] + 1;

$txtName = $_POST['username'];
$txtEmail = $_POST['email'];
$txtPass = $_POST['psw'];

$sql = "SELECT name, email from accounts WHERE name = '" . $txtName . "' or email = '" . $txtEmail . "'";
$result = $con->query($sql);
if ($result->num_rows > 0)
    header("location: signup.html");
else {
    $sql = "INSERT INTO `accounts` (`name`, `id`,`email`,`password`) VALUES ('$txtName', $id,'$txtEmail', '$txtPass')";
    $con->query($sql);

    header("location: login.php");
}
