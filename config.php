<?php

if (!session_id()) session_start();

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

//Database Connection

$host = "localhost";
$user = "root";
$password = '';
$db_name = "users";


$con = mysqli_connect($host, $user, $password, $db_name);

if (mysqli_connect_errno()) {
    die("Failed to connect with MySQL: " . mysqli_connect_error());
}

//$txtName = $_POST['email'];
//$txtEmail = $_POST['psw'];

//$sql = "INSERT INTO `test1` (`username`, `password`) VALUES ('$txtName', '$txtEmail')";
//$rs = mysqli_query($con, $sql);

$username = $_POST['email'];
$password = $_POST['psw'];

//to prevent from mysqli injection  
$username = stripcslashes($username);
$password = stripcslashes($password);
$username = mysqli_real_escape_string($con, $username);
$password = mysqli_real_escape_string($con, $password);

$sql = ("SELECT * from account where name = '$username' and password = '$password'");

$result = mysqli_query($con, $sql);

$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

$active = $row['active'];

$count = mysqli_num_rows($result);

echo mysqli_fetch_assoc($result);

// if ($count > 0) {
//     header("location: ./managementLoader.php");
// } else {
//     header("location: register.html");
// }

   // if($rs)
/*{
	echo "Contact Records Inserted";
}*/
