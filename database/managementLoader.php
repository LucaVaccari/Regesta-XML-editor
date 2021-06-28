<?php

if (!session_id()) session_start();

$userId = $_GET["userId"];
header("location: ../management.php?userId=" . $userId);
