<?php

include 'global.php';

if (!$_SESSION["logged"] || !isset($_SESSION["logged"]))
    header("location: ../login.php");

$userId = $_SESSION['userId'];

$sql = ('DELETE FROM files WHERE userId = ' . $userId);
$con->query($sql);

header("location: ../management.php");
