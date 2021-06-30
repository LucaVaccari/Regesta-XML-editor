<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$fileId = $_SESSION["fileId"];
$userId = $_SESSION["userId"];

$sql = ('DELETE FROM files WHERE fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php");
