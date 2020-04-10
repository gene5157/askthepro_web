<?php
// include database connection
include 'connection.php';
require_once("crud.class.php");
// select all data
 // $action = isset($_GET['action']) ? $_GET['action'] : null;
 // $crud = new crud();
 // echo $action;



class api extends crud {	

	public function __construct()
    {
    	
		
	}
	 
	function getLimitQuestions(){	
		
		// $query = "SELECT id,title,date_post,user_id,isAnswer,categories_id,summary,description
  // 			FROM questions order by date_post limit 10";
  // 		echo $query;
		// $stmt = $con->prepare($query);
		// $stmt->execute();
		// $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$tableName="questions";
			$rowData="id,title,date_post,user_id,summary,description,categories_id,isAnswer";
			$limit = 10;
			$order="date_post";
			$data = $this->select($tableName,$rowData,'','','',$order,$limit);
			$rowCount=$this->rowlength;

			$questions = [];
			//print_r($data);
			foreach ($data as $row){
				$dataQues = [
				 'id'=>$row['id'],
				 'title'=>$row['title'],
				 'date_post'=>$row['date_post'],
				 'user_id'=>$row['user_id'],
				 'summary'=>$row['summary'],
				 'description'=>$row['description'],
				 'categories_id'=>$row['categories_id'],
				 'isAnswer'=>$row['isAnswer']
				];
				array_push($questions,$dataQues);
			}
		echo json_encode([
			"Status"=>200,
			"Length"=>$rowCount,
			"questions"=> $questions
			],JSON_PRETTY_PRINT);

		}


function getAllQuestions(){
		$tableName = "questions AS a";
	$tableName2 = "categorys AS c";
		    $rowData2="a.id,a.title,a.date_post,a.user_id,a.summary,a.description,a.categories_id,a.isAnswer,c.name";
		    $on="a.categories_id = c.id";
			
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->join($tableName,$tableName2,$rowData2,$on,'','','');
			$rowCount2=$this->rowlength;

			$question = [];
			foreach ($data as $row){
				$temp = [
				 'id'=>$row['id'],
				 'title'=>$row['title'],
				 'date_post'=>$row['date_post'],
				 'user_id'=>$row['user_id'],
				 'summary'=>$row['summary'],
				 'description'=>$row['description'],
				 'categories_id'=>$row['categories_id'],
				 'isAnswer'=>$row['isAnswer'],
				 'categoryType'=>$row['name']
				];
				array_push($question,$temp);
			}
		echo json_encode([
			"Status"=>200,
			"Length"=>$rowCount2,
			"questions"=> $question
			],JSON_PRETTY_PRINT);

}

function getQuestion($ques_id){
		$tableName="questions AS q";
		$tableName2="users AS u";
			$rowData="q.id,q.title,q.date_post,q.user_id,q.summary,q.description,q.categories_id,q.isAnswer,u.id,u.username";
			$on="q.user_id = u.id";
			$where="q.id=:id";
			$paraheader=":id";
			$parameter1=$ques_id;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->join($tableName,$tableName2,$rowData,$on,$where,$parameter1,$paraheader);
			$rowCount=$this->rowlength;

		
			$questions = [];
			$answers = $this->getParticularAnswer($ques_id);
			//print_r($data);
			foreach ($data as $row){
				$dataQues = [
				 'id'=>$row['id'],
				 'title'=>$row['title'],
				 'date_post'=>$row['date_post'],
				 'user_id'=>$row['user_id'],
				 'summary'=>$row['summary'],
				 'description'=>$row['description'],
				 'categories_id'=>$row['categories_id'],
				 'isAnswer'=>$row['isAnswer'],
				 'username'=>$row['username'],
				 'answers'=>$answers
				];
				array_push($questions,$dataQues);
			}
		echo json_encode([
			"Status"=>200,
			"Length"=>$rowCount,
			"question"=> $questions
			],JSON_PRETTY_PRINT);

}

function getParticularAnswer($ques_id){
	$tableName = "answers AS a";
	$tableName2 = "users AS u";
		    $rowData2="a.id,a.title,a.date_post,a.userId,a.questionId,a.description,a.isBestAnswered,u.username";
		    $on="a.userId = u.id";
			$where2="questionId=:questionId";
			$paraheader2=":questionId";
			$parameter2=$ques_id;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data2 = $this->join($tableName,$tableName2,$rowData2,$on,$where2,$parameter2,$paraheader2);
			$rowCount2=$this->rowlength;
			$answers = [];
			foreach ($data2 as $row2) {
					$data = [
						'id'=>$row2['id'],
				 		'title'=>$row2['title'],
				 		'date_post'=>$row2['date_post'],
				 		'userId'=>$row2['userId'],
						'questionId'=>$row2['questionId'],
						'description'=>$row2['description'],
						'isBestAnswered'=>$row2['isBestAnswered'],
						'username'=>$row2['username']
					];
					array_push($answers,$data);
				}
				return [
				"answers"=> (["length"=>$rowCount2,
							  "answers"=>$answers
				])
				];
				// return $answers;
}

function getCategorys(){
		$tableName="categorys";
			$rowData="id,name,description";
			$data = $this->select($tableName,$rowData,'','','','','');
			$rowCount=$this->rowlength;

			$categorys = [];
			foreach ($data as $row){
				$data = [
				 'id'=>$row['id'],
				 'name'=>$row['name'],
				 'description'=>$row['description']
				];
				array_push($categorys,$data);
			}
		echo json_encode([
			"Status"=>200,
			"Length"=>$rowCount,
			"categorys"=> $categorys
			],JSON_PRETTY_PRINT);

}

function getCategoryOnAny($user_id){
	$tableName = "questions AS a";
	$tableName2 = "categorys AS c";
		    $rowData2="a.id,a.title,a.date_post,a.user_id,a.summary,a.description,a.categories_id,a.isAnswer,c.name";
		    $on="a.categories_id = c.id";
			$where2="user_id=:user_id";
			$paraheader2=":user_id";
			$parameter2=$user_id;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->join($tableName,$tableName2,$rowData2,$on,$where2,$parameter2,$paraheader2);
			$rowCount2=$this->rowlength;

			$question = [];
			foreach ($data as $row){
				$temp = [
				 'id'=>$row['id'],
				 'title'=>$row['title'],
				 'date_post'=>$row['date_post'],
				 'user_id'=>$row['user_id'],
				 'summary'=>$row['summary'],
				 'description'=>$row['description'],
				 'categories_id'=>$row['categories_id'],
				 'isAnswer'=>$row['isAnswer'],
				 'categoryType'=>$row['name']
				];
				array_push($question,$temp);
			}
		echo json_encode([
			"Status"=>200,
			"questions"=> $question
			],JSON_PRETTY_PRINT);
}

function questionsOnAny($where_name,$where_id){
	$tableName="questions";
			$rowData="id,title,date_post,user_id,summary,description,categories_id,isAnswer";
			$where="".$where_name."=:".$where_name."";
			$paraheader=":".$where_name."";
			$parameter1=$where_id;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->select($tableName,$rowData,$where,$parameter1,$paraheader,'','');
			$rowCount=$this->rowlength;

		
			$questions = [];
			//$answers = $this->getParticularAnswer($ques_id);
			//print_r($data);
			foreach ($data as $row){
				$dataQues = [
				 'id'=>$row['id'],
				 'title'=>$row['title'],
				 'date_post'=>$row['date_post'],
				 'user_id'=>$row['user_id'],
				 'summary'=>$row['summary'],
				 'description'=>$row['description'],
				 'categories_id'=>$row['categories_id'],
				 'isAnswer'=>$row['isAnswer']
				];
				array_push($questions,$dataQues);
			}
		echo json_encode([
			"Status"=>200,
			"Length"=>$rowCount,
			"question"=> $questions
			],JSON_PRETTY_PRINT);
}

function getUsers(){
	$tableName="users";
			$rowData="id,username,email,password,mobile,registered,isActive,role";
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->select($tableName,$rowData,'','','','','');
			$rowCount=$this->rowlength;
			$users = [];
			foreach ($data as $row) {
					$data = [
						'id'=>$row['id'],
				 		'username'=>$row['username'],
				 		'email'=>$row['email'],
				 		'password'=>$row['password'],
						'mobile'=>$row['mobile'],
						'registered'=>$row['registered'],
						'isActive'=>$row['isActive'],
						'role'=>$row['role']
					];
					array_push($users,$data);
				}
				return $users;
}

function getUser($email){
	$tableName="users";
			$rowData="id,username,email,mobile,registered,isActive,role";
			$where="email=:email";
			$paraheader=":email";
			$parameter1=$email;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->select($tableName,$rowData,$where,$parameter1,$paraheader,'','');
			$rowCount=$this->rowlength;
			$user = [];
			foreach ($data as $row) {
					$data = [
						'id'=>$row['id'],
				 		'username'=>$row['username'],
				 		'email'=>$row['email'],
						'mobile'=>$row['mobile'],
						'registered'=>$row['registered'],
						'isActive'=>$row['isActive'],
						'role'=>$row['role']
					];
					array_push($user,$data);
				}
				echo json_encode([
					"Status"=>200,
					"length"=>$rowCount,
					"user"=> $data
				],JSON_PRETTY_PRINT);
}
function getPointOnAny($userId){
		try{
			$tableName="points";
			$rowData="id,userId,totalPoint";
			$where="userId=:userId";
			$paraheader=":userId";
			$parameter1=$userId;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->select($tableName,$rowData,$where,$parameter1,$paraheader,'','');
			$rowCount=$this->rowlength;
			$point = [];
			foreach ($data as $row) {
					$data = [
				 		'userId'=>$row['userId'],
				 		'totalPoint'=>$row['totalPoint']
					];
					array_push($point,$data);
				}
				echo json_encode([
					"Status"=>200,
					"point"=> $data
				],JSON_PRETTY_PRINT);
		}catch(PDOException $e){
			echo "cannot connect to DB";
		}
}
function getUserOnAny($field_name,$field_id){
		try{
			$tableName="users";
			$rowData="id,username,email,mobile,registered,isActive,role";
			$where=$field_name."=:".$field_name;
			$paraheader=":".$field_name;
			$parameter1=$field_id;
			// $order="date_post";
			// $data = $this->select($tableName,$rowData,'','','',$order,'');
			$data = $this->select($tableName,$rowData,$where,$parameter1,$paraheader,'','');
			$rowCount=$this->rowlength;
			$user = [];
			foreach ($data as $row) {
					$data = [
						'id'=>$row['id'],
				 		'username'=>$row['username'],
				 		'email'=>$row['email'],
						'mobile'=>$row['mobile'],
						'registered'=>$row['registered'],
						'isActive'=>$row['isActive'],
						'role'=>$row['role']
					];
					array_push($user,$data);
				}
				echo json_encode([
					"Status"=>200,
					"Length"=>$rowCount,
					"user"=> $data
				],JSON_PRETTY_PRINT);
		}catch(PDOException $e){
			echo "cannot connect to DB";
		}
}

function searchOn(){
	
}

function createQuestion(){
	$title = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
	$date_post = isset($_REQUEST['date_post']) ? $_REQUEST['date_post'] : null;
	$user_id = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : null;
	$summary = isset($_REQUEST['summary']) ? $_REQUEST['summary'] : null;
	$description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
	$categories_id = isset($_REQUEST['categories_id']) ? $_REQUEST['categories_id'] : null;
	$isAnswer = isset($_REQUEST['isAnswer']) ? $_REQUEST['isAnswer'] : null;
	$postdata = file_get_contents("php://input");
	
   // echo $title;
if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);
  // print_r($request);
// echo 'test';
  // Validate.
  if(trim($request->data->title) === '' || (int)$request->data->user_id === 0)
  {
    return http_response_code(400);
  }

  $title = trim($request->data->title);
  $date_post = trim($request->data->date_post);
  $user_id = trim($request->data->user_id);
  $summary = trim($request->data->summary);
  $description = trim($request->data->description);
  $categories_id = trim($request->data->categories_id);
  $isAnswer = 0;
  //  echo 'test';
  // echo $isAnswer;

}
try{
	// echo $isAnswer;
	$tableName="questions";
			$rowData="title,user_id,summary,description,categories_id,isAnswer";
			$value=array(':title',':user_id',':summary',':description',':categories_id',':isAnswer');
			$data2 = [
			':title'=>$title,
			':user_id'=>$user_id,
			':summary'=>$summary,
			':description'=>$description,
			':categories_id'=>$categories_id,
			':isAnswer'=>($isAnswer == null ? 0 : $isAnswer)
		];
		// 	$data2 = [
		// 	':title'=>$parameter['title'],
		// 	':date_post'=>$parameter['date_post'],
		// 	':user_id'=>$parameter['user_id'],
		// 	':summary'=>$parameter['summary'],
		// 	':description'=>$parameter['description'],
		// 	':categories_id'=>$parameter['categories_id'],
		// 	':isAnswer'=>$parameter['isAnswer']
		// ];
			$stmt = $this->insert($tableName,$rowData,$value,$data2);
// $query = "INSERT INTO questions SET title=:title, date_post=:date_post,user_id=:user_id,summary=:summary
// ,description=:description,categories_id=:categories_id,isAnswer=:isAnswer";
// $stmt = $con->prepare($query);
// $stmt->bindParam(':title', $title);
// $stmt->bindParam(':price', $price);
// $stmt->bindParam(':title', $title);
// $stmt->bindParam(':title', $title);
// $stmt->bindParam(':title', $title);
// $stmt->bindParam(':title', $title);
// $stmt->bindParam(':title', $title);
// Execute the query
			http_response_code(200);
			echo json_encode(array("status"=>200,"result"=>'success'));
// if($stmt){
// // echo json_encode(array('result'=>'success'));
// 	http_response_code(200);
// 	echo json_encode(["status"=>200,"data"=>$stmt]);
// }else{
// echo json_encode(array('result'=>'fail'));
// }
}
// show error
catch(PDOException $exception){
die('ERROR: ' . $exception->getMessage());
}
}

function updQuestion(){
		$ques_id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$title = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
		// $date_post = isset($_REQUEST['date_post']) ? $_REQUEST['date_post'] : null;
		// $user_id = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : null;
		$summary = isset($_REQUEST['summary']) ? $_REQUEST['summary'] : null;
		$description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
		$categories_id = isset($_REQUEST['categories_id']) ? $_REQUEST['categories_id'] : null;
		// $isAnswer = isset($_REQUEST['isAnswer']) ? $_REQUEST['isAnswer'] : null;
		$postdata = file_get_contents("php://input");

		if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // print_r($request);
	// echo 'test';
	  // Validate.
	  if(trim($request->data->title) === '' || (int)$request->data->id === 0)
	  {
	    return http_response_code(400);
	  }

	  $title = trim($request->data->title);
	  // $date_post = trim($request->data->date_post);
	  $ques_id = trim($request->data->id);
	  $summary = trim($request->data->summary);
	  $description = trim($request->data->description);
	  $categories_id = trim($request->data->categories_id);
	  // $isAnswer = 0;
	  //  echo 'test';
	  // echo $isAnswer;

	}
	try{
	// echo $isAnswer;
		$data = [
			':title'=>$title,
			':summary'=>$summary,
			':categories_id'=>$categories_id,
			':description'=>$description,
			':id'=>$ques_id
			];
			$row = [
			'title'=>'title',
			'summary'=>'summary',
			'categories_id'=>'categories_id',
			'description'=>'description'
			];
			$tableName="questions";
			$where=array("id=:id");
			$stmt = $this->update($tableName,$row,$where,$data);

			echo json_encode(array("status"=>200,"result"=>'success'));
			// return http_response_code(200);
			
		}
		// show error
		catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}

}

function delQuestion(){
	try{
		$ques_id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$postdata = file_get_contents("php://input");
		if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // print_r($request);
	// echo 'test';
	  // Validate.
	  if((int)$request->data->id === 0)
	  {
	    return http_response_code(400);
	  }
	  $ques_id = trim($request->data->id);
	}
	  

		$data=[':id'=>$ques_id];
			$tableName='questions';
			$where="id=:id";
			$stmt = $this->delete($tableName,$where,$data);
			$rowCount=$this->rowlength.' rows deleted';
			
			echo json_encode([
				"Status"=>"OK",
				"Action"=>"Delete Question Post",
				"Data  "=> $rowCount
			],JSON_PRETTY_PRINT);
	}catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}
}

function createAnswer(){
	$title = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
	$userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : null;
	$questionId = isset($_REQUEST['questionId']) ? $_REQUEST['questionId'] : null;
	$description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
	$isBestAnswered = isset($_REQUEST['isBestAnswered']) ? $_REQUEST['isBestAnswered'] : null;
	$postdata = file_get_contents("php://input");
	
   // echo $title;
if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);
  // print_r($request);
// echo 'test';
  // Validate.
  if(trim($request->data->title) === '' || (int)$request->data->userId === 0 || (int)$request->data->questionId === 0)
  {
    return http_response_code(400);
  }

  $title = trim($request->data->title);
  $userId = trim($request->data->userId);
  $questionId = trim($request->data->questionId);
  $description = trim($request->data->description);
  $isBestAnswered = 0;
  //  echo 'test';
  // echo $isAnswer;

}
try{
	// echo $isAnswer;
	$tableName="answers";
			$rowData="title,userId,questionId,description,isBestAnswered";
			$value=array(':title',':userId',':questionId',':description',':isBestAnswered');
			$data2 = [
			':title'=>$title,
			':userId'=>$userId,
			':questionId'=>$questionId,
			':description'=>$description,
			':isBestAnswered'=>($isBestAnswered == null ? 0 : $isBestAnswered)
		];
			$stmt = $this->insert($tableName,$rowData,$value,$data2);
			http_response_code(200);
			echo json_encode(array("status"=>200,"result"=>'success'));

}
// show error
catch(PDOException $exception){
die('ERROR: ' . $exception->getMessage());
}
}
function updBestAns(){
		$ans_id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$isBestAnswered = isset($_REQUEST['isBestAnswered']) ? $_REQUEST['isBestAnswered'] : null;
		$isAnswer = isset($_REQUEST['isAnswer']) ? $_REQUEST['isAnswer'] : null;
		$ques_id = isset($_REQUEST['ques_id']) ? $_REQUEST['ques_id'] : null;
		$postdata = file_get_contents("php://input");

		if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // Validate.
	  if((int)$request->data->id === 0)
	  {
	    return http_response_code(400);
	  }

	  $isBestAnswered = trim($request->data->isBestAnswered);
	  $ans_id = trim($request->data->id);
	  if($ques_id != null){
	  	$isAnswer = trim($request->data->isAnswer);
	  	$ques_id = trim($request->data->ques_id);
	  }
	  
	}
	try{
		$data = [
			':isBestAnswered'=>$isBestAnswered,
			':id'=>$ans_id
			];
			$row = [
			'isBestAnswered'=>'isBestAnswered'
			];
			$tableName="answers";
			$where=array("id=:id");
			$stmt = $this->update($tableName,$row,$where,$data);

			//upd question isAnswer
			if($ques_id != null){
				$data2 = [
				':isAnswer'=>$isAnswer,
				':id'=>$ques_id
				];
				$row2 = [
				'isAnswer'=>'isAnswer'
				];
				$tableName2="questions";
				$where2=array("id=:id");
				$stmt2 = $this->update($tableName2,$row2,$where2,$data2);
			}
			

			echo json_encode(array("status"=>200,"result"=>'success'));
			// return http_response_code(200);
			
		}
		// show error
		catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}

}

function updAnswer(){
		$title = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
		$ans_id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$description = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
		$postdata = file_get_contents("php://input");

		if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // Validate.
	  if(trim($request->data->title) === '' || (int)$request->data->id === 0)
	  {
	    return http_response_code(400);
	  }

	  $title = trim($request->data->title);
	  $description = trim($request->data->description);
	  $ans_id = trim($request->data->id);
	}
	try{
		$data = [
			':title'=>$title,
			':description'=>$description,
			':id'=>$ans_id
			];
			$row = [
			'title'=>'title',
			'description'=>'description'
			];
			$tableName="answers";
			$where=array("id=:id");
			$stmt = $this->update($tableName,$row,$where,$data);
			
			echo json_encode(array("status"=>200,"result"=>'success'));
			// return http_response_code(200);
			
		}
		// show error
		catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}

}


function delAnswer(){
	try{
		$ans_id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$postdata = file_get_contents("php://input");
		if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // print_r($request);
	// echo 'test';
	  // Validate.
	  if((int)$request->data->id === 0)
	  {
	    return http_response_code(400);
	  }
	  $ans_id = trim($request->data->id);
	}
	  

		$data=[':id'=>$ans_id];
			$tableName='answers';
			$where="id=:id";
			$stmt = $this->delete($tableName,$where,$data);
			$rowCount=$this->rowlength.' rows deleted';
			
			echo json_encode([
				"Status"=>"OK",
				"Action"=>"Delete Answers post",
				"Data  "=> $rowCount
			],JSON_PRETTY_PRINT);
	}catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}
}

function addPoint(){
	$userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : null;
	$totalPoint = isset($_REQUEST['totalPoint']) ? $_REQUEST['totalPoint'] : null;
	$postdata = file_get_contents("php://input");
	
if(isset($postdata) && !empty($postdata))
{
  // Extract the data.
  $request = json_decode($postdata);
  // Validate.
  if((int)$request->data->userId === 0 || (int)$request->data->totalPoint === 0)
  {
    return http_response_code(400);
  }

  $userId = trim($request->data->userId);
  $totalPoint = trim($request->data->totalPoint);

}
	try{
		// echo $isAnswer;
		$tableName="points";
				$rowData="userId,totalPoint";
				$value=array(':userId',':totalPoint');
				$data2 = [
				':userId'=>$userId,
				':totalPoint'=>$totalPoint
			];
				$stmt = $this->insert($tableName,$rowData,$value,$data2);
				http_response_code(200);
				echo json_encode(array("status"=>200,"result"=>'success'));

	}
// show error
	catch(PDOException $exception){
	die('ERROR: ' . $exception->getMessage());
	}
}


function updPoint(){
		$userId = isset($_REQUEST['userId']) ? $_REQUEST['userId'] : null;
		$totalPoint = isset($_REQUEST['totalPoint']) ? $_REQUEST['totalPoint'] : null;
		$id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
		$postdata = file_get_contents("php://input");
		
	if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  // Validate.
	  if( (int)$request->data->userId === 0 || (int)$request->data->totalPoint === 0)
	  {
	    return http_response_code(400);
	  }

	  $userId = trim($request->data->userId);
	  $totalPoint = trim($request->data->totalPoint);

	}
	try{
		$data = [
			':totalPoint'=>$totalPoint,
			':userId'=>$userId
			];
			$row = [
			'totalPoint'=>'totalPoint'
			];
			$tableName="points";
			$where=array("userId=:userId");
			$stmt = $this->update($tableName,$row,$where,$data);

			echo json_encode(array("status"=>200,"result"=>'success'));
			// return http_response_code(200);
			
		}
		// show error
		catch(PDOException $exception){
		die('ERROR: ' . $exception->getMessage());
		}

}

function register(){
	$username = isset($_REQUEST['username']) ? $_REQUEST['username'] : null;
	$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : null;
	$password = isset($_REQUEST['password']) ? $_REQUEST['password'] : null;
	$registered = isset($_REQUEST['registered']) ? $_REQUEST['registered'] : null;
	$isActive = isset($_REQUEST['isActive']) ? $_REQUEST['isActive'] : null;
	$role = isset($_REQUEST['role']) ? $_REQUEST['role'] : null;
	$postdata = file_get_contents("php://input");
	
	if(isset($postdata) && !empty($postdata))
	{
	  // Extract the data.
	  $request = json_decode($postdata);
	  
	  // Validate.
	  if(trim($request->data->username) === '' || trim($request->data->role) === '')
	  {
	    return http_response_code(400);
	  }

	  $username = trim($request->data->username);
	  $email = trim($request->data->email);
	  $password = trim($request->data->password);
	  $registered = trim($request->data->registered);
	  $isActive = trim($request->data->isActive);
	  $role = trim($request->data->role);
	}
try{
	// echo $isAnswer;
	$tableName="users";
			$rowData="username,email,password,registered,isActive,role";
			$value=array(':username',':email',':password',':registered',':isActive',':role');
			$data2 = [
			':username'=>$username,
			':email'=>$email,
			':password'=>$password,
			':registered'=>$registered,
			':isActive'=>($isActive == null ? 0 : $isActive),
			':role'=>$role
		];
			$stmt = $this->insert($tableName,$rowData,$value,$data2);
			http_response_code(200);
			echo json_encode(array("status"=>200,"result"=>'success'));

}
// show error
catch(PDOException $exception){
die('ERROR: ' . $exception->getMessage());
}
}

function search(){
	 $pdo=pdoDB::getConnection();
	$param['title'] = $param['title1'] = !empty($_GET['title']) ? "%".$_GET['title']."%" : null;
	
			$sql = "SELECT id,title,date_post,summary,description,categories_id,isAnswer FROM questions 
					WHERE title LIKE :title or :title1 is null ";

			$stmt = $pdo->prepare($sql);

			$stmt->execute($param);
			$data = $stmt->fetchAll();
			  // print_r($stmt);
			$rowCount = $stmt->rowCount().' records found ';

			$ques = [];
			foreach ($data as $row){
				$data=[
			 "id"=>$row['id'],
			 "title"=>$row['title'],
			 "date_post"=>$row['date_post'],
			 "summary"=>$row['summary'],
			 "description"=>$row['description'],
			 "categories_id"=>$row['categories_id'],
			 "isAnswer"=>$row['isAnswer']

			 	];
			 array_push($ques,$data);
		}
		//echo $stmt->rowCount().' rows total';
		
			echo json_encode(
				$ques
			,JSON_PRETTY_PRINT);	
}


}//end switch

	


//   $query = "SELECT id,title,date_post,user_id,isAnswer,categories_id,summary,description
//   			FROM questions order by date_post limit 10";
//   // echo $query;
// $stmt = $con->prepare($query);
// $stmt->execute();
// $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
// $json = json_encode(['questions' => $results]);//json prettyprint//formatting  jSON output 
// echo $json;

?>