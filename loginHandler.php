<?php

include 'php/global.php';

$account = $_POST['email-username'];
$password = $_POST['psw'];

//to prevent from mysqli injection  
$email = stripcslashes($email);
$email = mysqli_real_escape_string($con, $email);
$password = stripcslashes($password);
$password = mysqli_real_escape_string($con, $password);

$sql = ("SELECT * from accounts where (email = '$account' or name = '$account') and password = '$password'");

$result = $con->query($sql);

$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

if ($result->num_rows > 0) {
    $_SESSION["username"] = $row["name"];
    $_SESSION["password"] = $row["password"];
    $_SESSION["userId"] = $row["id"];
    $_SESSION["logged"] = 1;
    header("location: management.php");
} else {
    header("location: login.html");
}
