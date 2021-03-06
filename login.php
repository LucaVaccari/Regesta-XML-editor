<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>XML Visual Editor | Sign Up</title>
    <link rel="stylesheet" type="text/css" href="css/login-style.css" />

    <?php
    if (!session_id()) session_start();

    if (!isset($_SESSION["incorrectUser"]) || $_SESSION["incorrectUser"] == NULL || empty($_SESSION["incorrectUser"]))
        $_SESSION["incorrectUser"] = 0;

    echo "<script>\n
        let incorrectUser = " . $_SESSION["incorrectUser"] . ";
        if (incorrectUser) {\n
            // document.getElementById('alert').style.display = 'block';
            alert('Incorrect email, username or passowrd!');
        }
    </script>"
    ?>
</head>

<body>
    <section>
        <h1>LOG IN</h1>
        <br>
        <div class="form" id="myForm">
            <form action="loginHandler.php" class="form-container" method="POST">
                <label for="email" id="user" name="user"><b>Email or Username</b></label>
                <input type="text" placeholder="Enter Email or Username" id="email" name="email-username" required>

                <label for="psw" id="pass" name="pass"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" id="psw" name="psw" required>

                <p id="alert" style="display: none">Incorrect email, username or password!</p><br>

                <button type="submit" name="btn" class="login">Log In</button>
                <a href="signup.php"><button type="button" name="btn" class="signup">Sign Up</button></a>
                <a href="index.php"><button type="button" class="cancel">Cancel</button></a>
            </form>
        </div>
    </section>
</body>

</html>