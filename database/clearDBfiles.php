<?php

include '../global.php';

$userId = $_GET['userId'];

$sql = ('DELETE FROM files WHERE userId = ' . $userId);
$con->query($sql);

header("location: ../management.php?userId=" . $userId);
