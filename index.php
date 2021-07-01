<!DOCTYPE html>
<html lang="en">
<?php
session_start();
?>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>XML Visual Editor</title>
    <link rel="stylesheet" type="text/css" href="css/index-style.css" />

</head>

<body>
    <section>
        <header>
            <div>
                <a href="#"><img src="resources/images/logo.png" height="60px" width="auto"></a>
                <a href="#"><img src="resources/images/small-logo.png" height="60px" width="auto" id="small"></a>
                <a href="signup.html"><button class="open-button" id="signup">Sign Up</button></a>
                <a href="login.php"><button class="open-button" id="login">Log In</button></a>
                <a href="php/logOut.php"><button class="open-button" id="logout">Log Out</button></a>
            </div>
            <?php
            if (!session_id()) session_start();

            if (!isset($_SESSION["logged"]) || $_SESSION["logged"] == NULL || empty($_SESSION["logged"]))
                $_SESSION["logged"] = 0;

            echo "<script>\n
                let logged = " . $_SESSION["logged"] . ";\n
                console.log(logged);\n
                document.getElementById('signup').style.display = logged ? 'none' : 'block';\n
                document.getElementById('login').style.display = logged ? 'none' : 'block';\n
                document.getElementById('logout').style.display = logged ? 'block' : 'none';\n
            </script>\n"
            ?>
        </header>
        <div class="center">
            <h1>XML Visual Editor</h1>
            <h3>Import your file and start editing it!</h3>
            <a class="button" href="management.php">START EDITING</a>
        </div>
        <footer>
            <div class="texts">
                <div class="dropdown">
                    <img src="resources/images/dropdown_L-R.png" height="20px" width="auto" id="leftToRight">
                    <div class="dropdown-content">
                        <a style="--i: 1" href="https://www.google.com/maps/place/Regesta+S.R.L./@45.5472802,10.1902087,15z/data=!4m5!3m4!1s0x0:0x551a640910ca7610!8m2!3d45.5472802!4d10.1902087" target="_blank">Find us</a>
                        <a style="--i: 2" href="https://www.regestaitalia.eu/contatti/" target="_blank">Contact us</a>
                        <a style="--i: 3" href="https://www.regestaitalia.eu/azienda/" target="_blank">About us</a>
                    </div>
                </div>
                <a id="hide" style="--i: 1" href="https://www.google.com/maps/place/Regesta+S.R.L./@45.5472802,10.1902087,15z/data=!4m5!3m4!1s0x0:0x551a640910ca7610!8m2!3d45.5472802!4d10.1902087" target="_blank">Find us</a>
                <a id="hide" style="--i: 2" href="https://www.regestaitalia.eu/contatti/" target="_blank">Contact us</a>
                <a id="hide" style="--i: 3" href="https://www.regestaitalia.eu/azienda/" target="_blank">About us</a>
            </div>
            <div class="icons">
                <a id="hide" style="--i: 5" href="https://it.linkedin.com/company/regesta-srl" target="_blank"><img src="resources/images/linkedin-ico.png" height="20px" width="auto"></a>
                <a id="hide" style="--i: 6" href="https://www.instagram.com/regesta_italia/" target="_blank"><img src="resources/images/instagram-ico.png" height="20px" width="auto"></a>
                <a id="hide" style="--i: 7" href="https://www.facebook.com/Regesta.Italia" target="_blank"><img src="resources/images/facebook-ico.png" height="20px" width="auto"></a>
                <a id="hide" style="--i: 8" href="https://www.youtube.com/channel/UCcernNHpymJT3_Ap697_hSQ" target="_blank"><img src="resources/images/youtube-ico.png" height="20px" width="auto"></a>
                <div class="dropdown">
                    <img src="resources/images/dropdown_R-L.png" height="20px" width="auto" id="rightToLeft">
                    <div class="dropdown-content">
                        <a style="--i: 5" href="https://it.linkedin.com/company/regesta-srl" target="_blank"><img src="resources/images/linkedin-ico.png" height="20px" width="auto"></a>
                        <a style="--i: 6" href="https://www.instagram.com/regesta_italia/" target="_blank"><img src="resources/images/instagram-ico.png" height="20px" width="auto"></a>
                        <a style="--i: 7" href="https://www.facebook.com/Regesta.Italia" target="_blank"><img src="resources/images/facebook-ico.png" height="20px" width="auto"></a>
                        <a style="--i: 8" href="https://www.youtube.com/channel/UCcernNHpymJT3_Ap697_hSQ" target="_blank"><img src="resources/images/youtube-ico.png" height="20px" width="auto"></a>
                    </div>
                </div>
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

        // show error
    </script>

    <!-- <script id="alert">
        function alertMessage() {
            document.getElementByClassName("alert-message").style.display = block;
        }
    </script> -->

</body>

</html>