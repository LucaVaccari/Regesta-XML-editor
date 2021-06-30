<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$userId = $_SESSION['userId'];

$sql = ('DELETE FROM files WHERE userId = ' . $userId);
$con->query($sql);

header("location: ../management.php");
