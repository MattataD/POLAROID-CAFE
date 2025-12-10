<?php
// Session Security Check
// Include this at the top of Admin Page.php and any other protected pages

session_start();

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Not logged in, redirect to login page
    header('Location: polaroid_login.php');
    exit;
}

// Optional: Session timeout (30 minutes of inactivity)
$timeout_duration = 1800; // 30 minutes in seconds

if (isset($_SESSION['login_time'])) {
    $elapsed_time = time() - $_SESSION['login_time'];
    
    if ($elapsed_time > $timeout_duration) {
        // Session expired
        session_unset();
        session_destroy();
        header('Location: polaroid_login.php?timeout=1');
        exit;
    }
}

// Update last activity time
$_SESSION['login_time'] = time();
?>