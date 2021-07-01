<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>XML Visual Editor | Sign Up</title>
    <link rel="stylesheet" type="text/css" href="css/login-style.css">
    </link>
</head>

<body>
    <section>
        <h1>LOG IN</h1>
        <br>
        <div class="form" id="myForm">
            <form action="config.php" class="form-container" method="POST">
                <label for="email" id="user" name="user"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" id="email" name="email" required>

                <label for="psw" id="pass" name="pass"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" id="psw" name="psw" required>

                <button type="submit" name="btn" class="login">Log In</button>
                <button type="submit" name="btn" class="signup">Sign Up</button>
                <a href="index.php"><button type="button" class="cancel">Cancel</button></a>
            </form>
        </div>
    </section>
</body>

</html>