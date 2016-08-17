<?php
// router.php

    if (preg_match('/\.(?:html|js|png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
        return false;    // serve the requested resource as-is
    } else if(strpos($_SERVER["REQUEST_URI"], 'socket.io')){
//        echo 'hello' . $_SERVER["REQUEST_URI"];
//        echo file_get_contents($_SERVER["REQUEST_URI"]);
        return false;
    } else {
        echo "<p>Thanks for using grunt-php :)</p>";
    }
?>