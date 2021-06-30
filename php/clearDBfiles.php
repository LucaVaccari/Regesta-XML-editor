<?php

include 'global.php';

$userId = $_SESSION['userId'];

$sql = ('DELETE FROM files WHERE userId = ' . $userId);
$con->query($sql);

header("location: ../management.php");
