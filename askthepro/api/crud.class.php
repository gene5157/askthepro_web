<?php
// Include necessary file
//require_once("includes/pdoDB.class.php");
include_once 'connection.php';
//require_once("includes/connection.php");
// Check if user is not logged in
// if (!$user->is_logged_in()) {
//     $user->redirect('../index2.php');
// }

class crud{
	public $rowlength;
	public function __construct(){
		
	}

	public function select($table,$row,$where=null,$parameter=null,$paraheader=null,$order=null,$limit=null){
		$db=pdoDB::getConnection();
		$query='SELECT '.$row.' FROM '.$table;
		if($where!=null){
			$query.=' WHERE '.$where;
		}
		if($order!=null){
			$query.=' ORDER BY '.$order.' DESC';
		}
		if($limit!=null){
			$query.=' LIMIT '.$limit;
		}
		// echo $query;
		// echo $paraheader,$parameter;
		$stmt=$db->prepare($query);
		if($parameter!= null || $paraheader!=null){
		$stmt->bindParam($paraheader,$parameter);
		}

		$stmt->execute();
		$rowCount=$stmt->rowCount();
		$this->rowlength=$rowCount;

		$Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		return $Result;
	}

	public function select2($table,$row,$where=null,$parameter=null,$paraheader=null,$order=null,$parameter2=null,$paraheader2=null){
		$db=pdoDB::getConnection();
		$query='SELECT '.$row.' FROM '.$table;
		if($where!=null){
			$query.=' WHERE '.$where;
		}
		if($order!=null){
			$query.=' ORDER BY '.$order.' DESC';
		}
		$stmt=$db->prepare($query);
		if($parameter!= null || $paraheader!=null){
		$stmt->bindParam($paraheader,$parameter);
	}	if($parameter2!= null || $paraheader2!=null){
		$stmt->bindParam($paraheader2,$parameter2);
	}
		$stmt->execute();
		$rowCount=$stmt->rowCount();
		//$this->getRow($rowCount);
		$this->rowlength=$rowCount;
		//print_r(getRow());
		$Result = $stmt->fetch(PDO::FETCH_ASSOC);
		
		//print_r($this->$rowlength);
		return $Result;
	}
	// public function getRow($rowCount){
	// 	$this->rowlength=$rowCount;
	// 	return $this->rowlength;
	// }

	public function join($table,$table2=null,$row,$where=null,$on=null,$parameter=null,$paraheader=null){
		$db=pdoDB::getConnection();
		$query='SELECT '.$row.' FROM '.$table;
		if($table2!=null){
			$query.=' INNER JOIN '.$table2;
		}
		if($on!=null){
			$query.=' ON '.$on;
		}
		if($where!=null){
			$query.=' WHERE '.$where;
		}
		$stmt=$db->prepare($query);
		$stmt->bindParam($paraheader,$parameter);
		$stmt->execute();
		$rowCount=$stmt->rowCount();
		$this->rowlength=$rowCount;
		$Result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $Result;
	}

	public function insert($table,$row=null,$value,$param){

		$db=pdoDB::getConnection();
		$insert= " INSERT INTO ".$table;
		if($row!=null){
			$insert.=" (". $row." ) ";
		}
		for($i=0; $i<count($value); $i++){
			if(is_string($value[$i])){
				$value[$i]= ''. $value[$i] . '';
			}
		}
		$value=implode(',',$value);
		$insert.=' VALUES ('.$value.')';
		$ins=$db->prepare($insert);
		foreach ($param as $key => &$val) {
    	$ins->bindParam($key, $val);
		}
		$ins->execute();
		$rowCount=$ins->rowCount();
		$this->rowlength=$rowCount;
		//print_r($ins);
		return $ins;
		// if($ins){
		// 	return true;
		// }else{
		// 	return false;
		// }
	}

	public function update($table,$rows,$where,$param){
		$db=pdoDB::getConnection();
		 // Parse the where values
            // even values (including 0) contain the where rows
            // odd values contain the clauses for the row
            for($i = 0; $i < count($where); $i++)
            {
                if($i%2 != 0)
                {
                    if(is_string($where[$i]))
                    {
                        if(($i+1) != null)
                            $where[$i] = '"'.$where[$i].'" AND ';
                        else
                            $where[$i] = '"'.$where[$i].'"';
                    }
                }
            }
            $where = implode(" ",$where);
            $update = 'UPDATE '.$table.' SET ';
            $keys = array_keys($rows);
            for($i = 0; $i < count($rows); $i++)
            {
                if(is_string($rows[$keys[$i]]))
                {
                    $update .= $keys[$i].'=:'.$rows[$keys[$i]].'';
                }
                else
                {
                    $update .= $keys[$i].'=:'.$rows[$keys[$i]];
                }
                // Parse to add commas
                if($i != count($rows)-1)
                {
                    $update .= ',';
                }
            }
            $update .= ' WHERE '.$where;
            //print_r($update);
            $query = $db->prepare($update);
            foreach ($param as $key => &$val) {
    		$query->bindParam($key, $val);
			}
			$query->execute();
			$rowCount=$query->rowCount();
			$this->rowlength=$rowCount;
			return $query;
	    
         }

    public function delete($table,$where=null,$param){
        $db=pdoDB::getConnection();
		   if($where != null)
            {
                $delete = "DELETE  FROM ".$table." WHERE ".$where;
            }
			$delQuery=$db->prepare($delete);
			foreach ($param as $key => &$val) {
    		$delQuery->bindParam($key, $val);
			}
			$delQuery->execute();
			$rowCount=$delQuery->rowCount();
			$this->rowlength=$rowCount;
			return $delQuery;
	}

}//end class



?>