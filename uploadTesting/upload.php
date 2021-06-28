<?php

$host = "sql11.freemysqlhosting.net";
$user = "sql11421864";
$password = 'mdTT1WcU9a';
$db_name = "sql11421864";


$con = mysqli_connect($host, $user, $password, $db_name);

if (mysqli_connect_errno()) {
  die("Failed to connect with MySQL: " . mysqli_connect_error());
}

//$id = 0;
$txtFile = $_POST['myfile'];
//$txtEmail = $_POST['psw'];


$string = file_get_contents($txtFile);
echo ($string);

$sql = "INSERT INTO `accounts` (`files`) VALUES ('$string)";
$rs = mysqli_query($con, $sql);



/*$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));



// Check if file already exists
if (file_exists($target_file)) {
  echo "Sorry, file already exists.";
  $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
  echo "Sorry, your file is too large.";
  $uploadOk = 0;
}
*/
