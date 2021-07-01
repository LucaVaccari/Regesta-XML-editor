<?php

include "global.php";

$_SESSION["logged"] = false;

session_destroy();

header("location: ../index.php");
