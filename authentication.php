<?php
include "config.php";
/*To do*/
if(isset($_POST['btn'])){

    $uname = mysqli_real_escape_string($con,$_POST['user']);
    $password = mysqli_real_escape_string($con,$_POST['psw']);

    if ($uname != "" && $password != ""){

        $sql = "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1";
        $stmtselect  = $db->prepare($sql);
        $result = mysqli_query($con,$sql);
        $row = mysqli_fetch_array($result);

        $count = $row['login'];

        if($count > 0){
            $_SESSION['uname'] = $uname;
            header('Location: hello.php');
        }else{
            echo "Invalid username and password";
        }

    }

}