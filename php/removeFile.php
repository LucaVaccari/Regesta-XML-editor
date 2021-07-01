<?php

include 'global.php';

if (!((bool) $_SESSION["logged"]) || !isset($_SESSION["logged"]))
    header("location: ../login.php");

    $fileId = $_GET["fileId"];
$userId = $_SESSION["userId"];

echo $fileId;

$sql = ('DELETE FROM files WHERE fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php");
