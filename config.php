<?php

include 'global.php';

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
