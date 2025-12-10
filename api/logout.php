<?php
session_start();

$_SESSION = array();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-3600, '/');
}

session_destroy();

header('Location: /POLAROID-CAFE-master/polaroid_login.php?logged_out=1');
exit;
?>
