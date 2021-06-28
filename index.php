<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>XML Visual Editor</title>
    <link rel="stylesheet" type="text/css" href="css/index-style.css">
    </link>
</head>

<body>
    <section>
        <header>
            <div>
                <a href="#"><img src="resources/images/logo.png" height="60px" width="auto"></a>
                <button class="open-button" onclick="openForm()">Log in</button>
                <span>
                    <div class="form-popup" id="myForm">
                        <form action="config.php" class="form-container" method="POST">
                            <label for="email" id="user" name="user"><b>Email</b></label>
                            <input type="text" placeholder="Enter Email" name="email" required>
                            <label for="psw" id="pass" name="pass"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" id="psw" name="psw" required>
                            <button type="submit" id="btn" name="btn" class="btn">Login</button>
                            <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
                        </form>
                    </div>
                </span>
            </div>
        </header>
        <div class="center">
            <h1>XML Visual Editor</h1>
            <h3>Import your file and start editing it!</h3>
            <a class="button" href="editor.php">IMPORT</a>
        </div>
        <footer>
            <div class="texts">
                <a style="--i: 1" href="https://www.google.com/maps/place/Regesta+S.R.L./@45.5472802,10.1902087,15z/data=!4m5!3m4!1s0x0:0x551a640910ca7610!8m2!3d45.5472802!4d10.1902087" target="_blank">Find us</a>
                <a style="--i: 2" href="https://www.regestaitalia.eu/contatti/" target="_blank">Contact us</a>
                <a style="--i: 3" href="https://www.regestaitalia.eu/azienda/" target="_blank">About us</a>
            </div>
            <div class="icons">
                <a style="--i: 5" href="https://it.linkedin.com/company/regesta-srl" target="_blank"><img src="resources/images/linkedin-ico.png" height="20px" width="auto"></a>
                <a style="--i: 6" href="https://www.instagram.com/regesta_italia/" target="_blank"><img src="resources/images/instagram-ico.png" height="20px" width="auto"></a>
                <a style="--i: 7" href="https://www.facebook.com/Regesta.Italia" target="_blank"><img src="resources/images/facebook-ico.png" height="20px" width="auto"></a>
                <a style="--i: 8" href="https://www.youtube.com/channel/UCcernNHpymJT3_Ap697_hSQ" target="_blank"><img src="resources/images/youtube-ico.png" height="20px" width="auto"></a>
            </div>
        </footer>
    </section>
    <script>
        function openForm() {
            document.getElementById("myForm").style.display = "block";
        }

        function closeForm() {
            document.getElementById("myForm").style.display = "none";
        }
    </script>
</body>

</html>