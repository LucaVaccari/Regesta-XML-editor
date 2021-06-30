<?php

include 'global.php';

if (!$_SESSION["logged"])
    header("location: ../index.php");

$fileId = $_GET["fileId"];
$userId = $_SESSION["userId"];

echo $fileId;

$sql = ('DELETE FROM files WHERE fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php");
