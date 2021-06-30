<!-- <script id="alert" src="index.php"></script> -->

<?php 

include 'php/global.php';

$email = $_POST['email'];
$password = $_POST['psw'];

//to prevent from mysqli injection  
$email = stripcslashes($email);
$email = mysqli_real_escape_string($con, $email);
$password = stripcslashes($password);
$password = mysqli_real_escape_string($con, $password);

$sql = ("SELECT * from accounts where email = '$email' and password = '$password'");

$result = $con->query($sql);

$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

if ($result->num_rows > 0) {
    $_SESSION["username"] = $row["name"];
    $_SESSION["password"] = $row["password"];
    $_SESSION["userId"] = $row["id"];
    $_SESSION["logged"] = true;
    header("location: management.php");
} else {
    // echo <script type="text/javascript"> 'alertMessage();' '</script>';
    // header("location: register.html");
}
?>
