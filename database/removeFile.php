<?php

include '../global.php';

$fileId = $_GET["fileId"];
$userId = $_GET["userId"];

$sql = ('DELETE FROM files WHERE fileId = ' . $fileId);
$con->query($sql);

header("location: managementLoader.php?userId=" . $userId);
