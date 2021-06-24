<?php
include "config.php";

if(isset($_POST['btn'])){

    $uname = mysqli_real_escape_string($con,$_POST['user']);
    $password = mysqli_real_escape_string($con,$_POST['psw']);

    if ($uname != "" && $password != ""){

        $sql_query = $query = "SELECT * FROM `login` WHERE username='$uname' and password='$password'";
        $result = mysqli_query($con,$sql_query);
        $row = mysqli_fetch_array($result);

        $count = $row['login'];

        if($count > 0){
            $_SESSION['uname'] = $uname;
            header('Location: index.html');
        }else{
            echo "Invalid username and password";
        }

    }

}