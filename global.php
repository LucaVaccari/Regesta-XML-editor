<?php

$host = "sql11.freemysqlhosting.net";
$user = "sql11421864";
$password = 'mdTT1WcU9a';
$db_name = "sql11421864";

$con = mysqli_connect($host, $user, $password, $db_name);

if (mysqli_connect_errno()) {
  die("Failed to connect with MySQL: " . mysqli_connect_error());
}
