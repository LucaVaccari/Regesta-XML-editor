<?php

if (!session_id())
  session_start();

$host = "sql11.freemysqlhosting.net";
$user = "sql11421864";
$password = 'mdTT1WcU9a';
$db_name = "sql11421864";

if (!isset($_SESSION["username"]))
  $_SESSION["username"] = "";

if (!isset($_SESSION["password"]))
  $_SESSION["password"] = "";

$con = mysqli_connect($host, $user, $password, $db_name);

if (mysqli_connect_errno()) {
  die("Failed to connect with MySQL: " . mysqli_connect_error());
}
