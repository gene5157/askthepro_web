<?php
require_once('pdoDB.class.php');
$pdo=pdoDB::getConnection();


$host = "localhost";
$db_name = "askthepro";
$username = "root";
$password = "";

try {
$con = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
}


// show error
catch(PDOException $exception){
echo "Connection error: " . $exception->getMessage();
}
