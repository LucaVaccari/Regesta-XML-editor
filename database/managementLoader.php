<?php

if (!session_id()) session_start();

header("location: ../management.php?userId=3");
