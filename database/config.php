<?php    

    $host = "localhost";  
    $user = "root";  

    $password = '';  
    $db_name = "test1";  
      

    $con = mysqli_connect($host, $user, $password, $db_name);  
    
    if(mysqli_connect_errno()) {  
        die("Failed to connect with MySQL: ". mysqli_connect_error()); 
        
    
    }

    $txtName = $_POST['email'];
    $txtEmail = $_POST['psw'];

    $sql = "INSERT INTO `test1` (`user`, `psw`) VALUES ('$txtName', '$txtEmail')";
    $rs = mysqli_query($con, $sql);
    if($rs)
{
	echo "Contact Records Inserted";
}


?> 