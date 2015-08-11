<?php
	require_once("JSON.php");
	// класс, который предназначен, чтобы возвращать данные из БД
	class DataGateway
	{
		// Свойства - start
		private $nl;	// символ перевода на новую строку, для удобства отображения ошибок
		private $arrDate; // список названиий полей с датами в БД
		// Свойства - end
		
		// Методы - start

		public function __construct() // Конструктор
		{
			//$this->nl = chr(13).chr(10);
			$this->nl = "<br>";
			$this->arrDate = array('DateOrder', 'DateMeasure', 'DateStartMontage');
			//mysqli_select_db($link, dbFilial) or die("Mysql error:	".mysqli_error($link));
		}

		//	function get JSON list functions by Service ID	
		public function getFunctions($link, $idService) 
		{
			mysqli_select_db($link, dbDocument) or die("Query error:	".mysqli_error());
			$stmt = mysqli_prepare($link, "SELECT ID, Name, Description, TechID FROM functions WHERE ServiceID = ?");

			if(!preg_match("/^([0-9])/", $idService))	{	echo "Wrong Service ID"; return;	}
			
			mysqli_stmt_bind_param($stmt, "d", $idService);
			mysqli_stmt_execute($stmt);
			mysqli_stmt_bind_result($stmt, $id, $name, $description, $techId);

			$arrayFunctions = array();

	    	while ($row = mysqli_stmt_fetch($stmt))
	    	{
	    		$arrayFunctions[] = array('id'=> $id, 'name'=> $name, 'description'=> $description, 'techId'=> $techId);
	    	}
			$json = new Services_JSON();
	    	
	    	$functions = array('functions' => $arrayFunctions);
	    	$outputData = $json->encode($functions);

			mysqli_stmt_close($stmt);
	    	echo $outputData;
	    }
		//	end function getOffices

		//	function get JSON list services	
		public function getServices($link) // возвращает список городов в формате JSON
		{
			mysqli_select_db($link, dbDocument) or die("Query error:	".mysqli_error());
			$stmt = mysqli_prepare($link, "SELECT ID, Name, Address, AjaxPath, FtpPath FROM services ORDER BY Name");
			mysqli_stmt_execute($stmt);
			mysqli_stmt_bind_result($stmt, $id, $name, $address, $ajaxpath, $ftppath);

			$arrayServices = array();

	    	while ($row = mysqli_stmt_fetch($stmt))
	    	{
	    		$arrayServices[] = array('id'=> "$id", 'name'=> $name, 'address'=> $address, 'ajaxPath'=> $ajaxpath, 'ftpPath'=> $ftppath);
	    	}
			$json = new Services_JSON();
	    	
	    	$services = array('services' => $arrayServices);
	    	$outputData = $json->encode($services);

			mysqli_stmt_close($stmt);
	    	echo $outputData;
	    }
		//	end function getServices

		//	function get JSON list services	
		public function getTechnologies($link) // возвращает список городов в формате JSON
		{
			mysqli_select_db($link, dbDocument) or die("Query error:	".mysqli_error());
			$stmt = mysqli_prepare($link, "SELECT ID, Name FROM technologies ORDER BY Name");
			mysqli_stmt_execute($stmt);
			mysqli_stmt_bind_result($stmt, $id, $name);

			$arrayTechs = array();

	    	while ($row = mysqli_stmt_fetch($stmt))
	    	{
	    		$arrayTechs[] = array('id'=> "$id", 'name'=> $name);
	    	}
			$json = new Services_JSON();
	    	
	    	$techs = array('technologies' => $arrayTechs);
	    	$outputData = $json->encode($techs);

			mysqli_stmt_close($stmt);
	    	echo $outputData;
	    }
		//	end function getServices

		public function getFunctionInfo($link, $idFunction)
		{
			mysqli_select_db($link, dbDocument) or die("Query error: ".mysqli_error());
			$stmt = mysqli_prepare($link, "SELECT ID, Name, Description, Result FROM functions
											WHERE ID = ?");
			mysqli_stmt_bind_param($stmt, "d", $idFunction);
			mysqli_stmt_execute($stmt);
			mysqli_stmt_bind_result($stmt, $id, $name, $description, $result);
			$arrayGeneral = array();
	    	while ($row = mysqli_stmt_fetch($stmt))	
	    	{	
	    		$arrayGeneral[] = array('id' => $id,'name' => $name, 'description' => $description, 'result' => $result);
	    	}
	    	mysqli_stmt_close($stmt);

	    	$stmt = mysqli_prepare($link, "SELECT ID, Name, Type, Description FROM variables
	    									WHERE FunctionID = ?");
	    	mysqli_stmt_bind_param($stmt, "d", $idFunction);
	    	mysqli_stmt_execute($stmt);
	    	mysqli_stmt_bind_result($stmt, $id, $name, $type, $description);
			$arrayParams = array();
			while($row = mysqli_stmt_fetch($stmt))
			{
				$arrayParams[] = array('id' => $id, 'name' => $name, 'type' => $type, 'description' => $description);
			}
			mysqli_stmt_close($stmt);

			$stmt = mysqli_prepare($link, "SELECT ID, Name, Description FROM exceptions
	    									WHERE FunctionID = ?");
	    	mysqli_stmt_bind_param($stmt, "d", $idFunction);
	    	mysqli_stmt_execute($stmt);
	    	mysqli_stmt_bind_result($stmt, $id, $name, $description);
			$arrayExceptions = array();
			while($row = mysqli_stmt_fetch($stmt))
			{
				$arrayExceptions[] = array('id' => $id, 'name' => $name, 'description' => $description);
			}
			mysqli_stmt_close($stmt);

			$stmt = mysqli_prepare($link, "SELECT links.ID, LinkID, Name, ServiceID, TechID FROM links
											INNER JOIN functions on functions.ID = links.LinkID
	    									WHERE FunctionID = ?");
	    	mysqli_stmt_bind_param($stmt, "d", $idFunction);
	    	mysqli_stmt_execute($stmt);
	    	mysqli_stmt_bind_result($stmt, $id, $linkId, $name, $serviceId, $techId);
			$arrayLinks = array();
			while($row = mysqli_stmt_fetch($stmt))
			{
				$arrayLinks[] = array('id' => $id, 'linkId' => $linkId, 'name' => $name, 'serviceId' => $serviceId, 'techId' => $techId);
			}
			mysqli_stmt_close($stmt);

			$json = new Services_JSON();
			$function = array('general' => $arrayGeneral, 'variables' => $arrayParams, 'exceptions' => $arrayExceptions, 'links' => $arrayLinks);
	    	$outputData = $json->encode($function);

	    	echo $outputData;
		}
		// Методы - end
	}
?>