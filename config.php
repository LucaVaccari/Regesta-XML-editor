<?php

if (!session_id()) session_start();

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

//Database Connection

$host = "localhost";
$user = "root";
$password = '';
$db_name = "regesta-XML-editor-db";


$con = mysqli_connect($host, $user, $password, $db_name);

if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
}

//$txtName = $_POST['email'];
//$txtEmail = $_POST['psw'];

//$sql = "INSERT INTO `test1` (`username`, `password`) VALUES ('$txtName', '$txtEmail')";
//$rs = mysqli_query($con, $sql);

$email = $_POST['email'];
$password = $_POST['psw'];

//to prevent from mysqli injection  
$email = stripcslashes($email);
$password = stripcslashes($password);
$email = mysqli_real_escape_string($con, $email);
$password = mysqli_real_escape_string($con, $password);

$sql = ("SELECT id from accounts where email = '$email' and password = '$password'");

$result = $con->query($sql);

$row = mysqli_fetch_array($result, MYSQLI_ASSOC);


if ($result->num_rows > 0) {
    $userId = $row["id"];
    header("location: database/managementLoader.php?userId=" . $userId);
} else {
    header("location: register.html");
}

// if ($count > 0) {
// } else {
// }

   // if($rs)
/*{
	echo "Contact Records Inserted";
}*/
