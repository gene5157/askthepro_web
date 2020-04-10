<?php
require_once('view.controller.php');

if(isset($_GET['class']))
{
    $function = $_GET['function'];
    $className = $_GET['class'];
    $class = new $className();
    
    // if($function = 'createQuestion'){
    // 	$postdata = file_get_contents("php://input");
    // 	$result = $class->$function();

    // }else{
	    if(isset($_GET['parameter'])){
	    	if(isset($_GET['parameter2'])){
	    		$parameter = $_GET['parameter'];
	    		$parameter2 = $_GET['parameter2'];
	   			$result = $class->$function($parameter,$parameter2);
	   			// echo "test";
			}else{
				$parameter = $_GET['parameter'];
	   			$result = $class->$function($parameter);
			}
		}else{
			// echo "test1";
			$result = $class->$function();
		}
	// }
    // echo $function;
    // echo $className;
if(is_array($result))
{   
    print_r($result);
}
elseif(is_string($result ) && is_array(json_decode($result , true)))
{
print_r(json_decode($string, true));
}
else
{
echo $result;
}

}

//post
if(isset($_POST['class2']))
{
    $function = $_POST['function2'];
    $className = $_POST['class2'];
    $class = new $className();
    
    if(isset($_POST['parameter2'])){
    	$parameter = $_POST['parameter2'];
   		$result = $class->$function($parameter);
	}else{
		$result = $class->$function();
	}
    // echo $function;
    // echo $className;
if(is_array($result))
{   
    print_r($result);
}
elseif(is_string($result ) && is_array(json_decode($result , true)))
{
print_r(json_decode($string, true));
}
else
{
echo $result;
}

}
?>