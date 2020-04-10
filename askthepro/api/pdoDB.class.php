<?php
//require_once("config.php");

class pdoDB {
	private static $dbConnection = null;

	public function __construct(){

	}
	private function __clone(){

	}

	public static function getConnection(){
		//if there isn't a connection already then create one 
		if(!self::$dbConnection){
			try{
				//need to chg with using variable from the config.php. config already declare
				self::$dbConnection = new PDO('mysql:host=localhost;dbname=askthepro','root','');
				self::$dbConnection->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}catch(PDOException $e) {
				//in a production system you would log the error not display it
				echo $e->getMessage();
			}
		}
		//return the connection
		return self::$dbConnection;

	}
}//end class

?>