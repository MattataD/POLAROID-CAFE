<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">                
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script defer src="Contact Info Page Script.js"></script>
    <link rel="stylesheet" href="Contact Info Page Styles.css">
    <title>Polaroid Cafe</title>
</head>

<body>
    <img src="../Contact/Images/A4-MENU for canva 1.png" alt="">

    <header class="Nav-bar">
        <div class="logo-container">
            <img src="../Contact/Images/LOGO POLAROID 3.png" class="logo-img" alt="Logo">
            <p class="logo-text">POLAROID CAFE</p>
        </div>

        <ul class="links">
            <li class="nav-item-container">
                <div class="link-items">
                    <img src="../Contact/Images/Home Fill Icon.svg" class="nav-icon" alt="">
                    <a href="../Home Page.php" class="link">Home</a>
                </div>
            </li>

            <li class="nav-item-container">
                <div class="link-items">
                    <img src="../Contact/Images/Menu Fill Icon.svg" class="nav-icon" alt="">
                    <a href="../Menu/Coffee Drinks/Menu - Coffee Drinks.php" class="link">Menu</a>
                </div>
            </li>

            <li class="nav-item-container">
                <div class="link-items">
                    <img src="../Contact/Images/Contuct Us Fill Icon.svg" class="nav-icon" alt="">
                    <a href="../Contact/Contact Info Page.php" class="link">Contact Us</a>
                </div>
            </li>

            <li class="nav-item-container">
                <div class="link-items">
                    <img src="../Contact/Images/Cart Fill Icon.svg" class="nav-icon" alt="">
                    <a href="../Cart/Cart Page.php" class="link">Cart</a>
                </div>
            </li>
        </ul>
    </header>
    <div class="content-wrapper">
        <div class="contact-section">
            <div class="contact-flex">
                <div class="map-side">
                    <h2 class="location-title">WE ARE LOCATED AT:</h2>
                    <p class="location-address">(ADDRESS HERE)</p>

                    <div class="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.435097205013!2d121.0353492!3d14.7445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b10ebb7d9ddb%3A0xf001887ce43db8b1!2sPolaroid%20Cafe!5e0!3m2!1sen!2sph!4v1764229058447!5m2!1sen!2sph"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
                <div class="divider"></div>

                <div class="info-side">
                    <h2 class="contact-title">CONTACT INFO:</h2>
                    <p class="contact-details">(contact info here)</p>

                    <div class="socials">
                        <div class="social-item">
                            <img src="/Contact/Images/Facebook.svg" class="social-icon">
                            <p class="social-text">(plug in contact)</p>
                        </div>
                        <div class="social-item">
                            <img src="/Contact/Images/Instagram.svg" class="social-icon">
                            <p class="social-text">(plug in contact)</p>
                        </div>
                        <div class="social-item">
                            <img src="/Contact/Images/Gmail.svg" class="social-icon">
                            <p class="social-text">(plug in contact)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
