<?php
session_start();

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'polaroid_cafe');

$login_error = false;
$error_message = '';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: Admin Page.php');
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Connect to database
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        $login_error = true;
        $error_message = "Connection error. Please contact administrator.";
    } else {
        $username = trim($_POST['username']);
        $password = $_POST['password'];

        if (empty($username) || empty($password)) {
            $login_error = true;
            $error_message = "Please enter both username and password.";
        } else {
            $sql = "SELECT id, username, password_hash FROM admin_users WHERE username = ?";
            $stmt = $conn->prepare($sql);
            
            if ($stmt) {
                $stmt->bind_param("s", $username);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $row = $result->fetch_assoc();
                    
                    // Verify password
                    if (password_verify($password, $row['password_hash'])) {
                        $_SESSION['admin_logged_in'] = true;
                        $_SESSION['admin_id'] = $row['id'];
                        $_SESSION['username'] = $row['username'];
                        $_SESSION['login_time'] = time();
                        
                        header('Location: Admin Page.php');
                        exit;
                    } else {
                        $login_error = true;
                        $error_message = "Invalid username or password.";
                    }
                } else {
                    $login_error = true;
                    $error_message = "Invalid username or password.";
                }
                
                $stmt->close();
            } else {
                $login_error = true;
                $error_message = "System error. Please try again.";
            }
        }
        
        $conn->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="polaroid_login.css">
    <title>Polaroid Cafe | Admin Login</title>
    <link rel="icon" type="image/x-icon" href="Images/Polaroid_Icon.svg">
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <div class="logo-section">
                <img src="Images/Polaroid_Icon.svg" alt="Polaroid Cafe Logo" class="logo-img">
            </div>
            <h1>POLAROID CAFE</h1>
            <p>Admin Dashboard Login</p>
        </div>

        <form class="login-form" id="loginForm" method="POST" action="polaroid_login.php">
            <?php if ($login_error): ?>
            <div class="error-message show" id="errorMessage">
                <?php echo htmlspecialchars($error_message); ?>
            </div>
            <?php else: ?>
            <div class="error-message" id="errorMessage">
                Invalid username or password. Please try again.
            </div>
            <?php endif; ?>

            <div class="form-group">
                <label for="username">Username</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                    </svg>
                    <input type="text" id="username" name="username" required autocomplete="username" value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>">
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
                    </svg>
                    <input type="password" id="password" name="password" required autocomplete="current-password">
                </div>
            </div>

            <button type="submit" class="login-btn">Sign In</button>
        </form>

        <div class="login-footer">
            &copy; 2024 Polaroid Cafe. All rights reserved.
        </div>
    </div>

    <script>
        const form = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorMessage.classList.contains('show')) {
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 5000);
        }

        document.getElementById('username').addEventListener('input', () => {
            errorMessage.classList.remove('show');
        });

        document.getElementById('password').addEventListener('input', () => {
            errorMessage.classList.remove('show');
        });
    </script>
</body>
</html>