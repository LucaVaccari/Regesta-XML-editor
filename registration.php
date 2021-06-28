<?php    

session_start();

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

        //Database Connection

    $host = "localhost";  
    $user = "root";  
    $password = '';  
    $db_name = "register";  
      

    $con = mysqli_connect($host, $user, $password, $db_name);  
    
    if(mysqli_connect_errno()) {  
        die("Failed to connect with MySQL: ". mysqli_connect_error()); 
        
    
    }

    $txtName = $_POST['name'];
    $txtCompany = $_POST['company'];
    $txtEmail = $_POST['email'];
    $txtPass = $_POST['psw'];

    $sql = "INSERT INTO `register` (`name`, `company`,`email`,`password`) VALUES ('$txtName', $txtCompany,'$txtEmail', $txtPass)";
    $rs = mysqli_query($con, $sql);

    if($count >= 0) {
        $_SESSION['username'] = $username;
        header("location: editor.html");
    }
    else{
        header("location: register.html");
        
    }

    ?> 