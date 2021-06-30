<?php

include 'global.php';

$fileId = $_SESSION["fileId"];
$userId = $_SESSION["userId"];

$sql = ('DELETE FROM files WHERE fileId = ' . $fileId);
$con->query($sql);

header("location: ../management.php");
