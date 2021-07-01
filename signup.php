<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>XML Visual Editor | Sign Up</title>
    <link rel="stylesheet" type="text/css" href="css/signup-style.css" />

    <?php
    if (!session_id()) session_start();

    if (!isset($_SESSION["doubleUser"]) || $_SESSION["doubleUser"] == NULL || empty($_SESSION["doubleUser"]))
        $_SESSION["doubleUser"] = 0;

    echo "<script>\n
        let doubleUser = " . $_SESSION["doubleUser"] . ";\n
        if (doubleUser) {\n
            console.log('Username or email already registered');\n
        } else {\n

        }
    </script>\n"
    ?>
</head>

<body>
    <section>
        <h1>SIGN UP</h1>
        <br />
        <div class="form" id="myForm">
            <form action="signupHandler.php" class="form-container" method="POST">
                <label for="email" id="user" name="user"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" id="username" name="username" required>

                <label for="email" id="user" name="user"><b>Email</b></label>
                <input type="email" placeholder="Enter Email" id="email" name="email" required>

                <label for="psw" id="pass" name="pass"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" id="psw" name="psw" required>

                <button type="submit" id="btn" name="btn" class="btn">Sign Up</button>
                <a href="index.php"><button type="button" class="btn cancel">Cancel</button></a>
            </form>
        </div>
    </section>
</body>

</html>