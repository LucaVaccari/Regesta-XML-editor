<?php

if (!session_id())
  session_start();

$host = "localhost";
$user = "root";
$password = '';
$db_name = "regesta-xml-editor-db";

$con = mysqli_connect($host, $user, $password, $db_name);

if (!isset($_SESSION["username"]))
  $_SESSION["username"] = "name";

if (!isset($_SESSION["password"]))
  $_SESSION["password"] = "psw";

if (!isset($_SESSION["userId"]))
  $_SESSION["userId"] = -1;

if (!isset($_SESSION["fileId"]))
  $_SESSION["fileId"] = -1;

if (!isset($_SESSION["logged"]))
  $_SESSION["logged"] = 0;

if (mysqli_connect_errno()) {
  die("Failed to connect with MySQL: " . mysqli_connect_error());
}
