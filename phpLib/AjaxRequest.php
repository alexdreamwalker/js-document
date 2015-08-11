<?php
	header('Access-Control-Allow-Origin: *'); 
	if($_SERVER['HTTP_HOST'] != "localhost")
	{
		error_reporting(E_ALL | E_STRICT);
		$prev_name = session_name();
		$some_name = session_name("domain");
		session_set_cookie_params(0, '/', '.barstrade.ru');
	}
	session_start();
	require_once "SetConnectDB.php";
	require_once "DataGateway.php";
	require_once "Inserter.php";
	require_once "JSON.php";

	function decodeArray($arr)
	{
		$res = json_decode($arr[0]);
		$res = (array)$res;
		foreach ($res as &$value) 
		{
			$value = (array)$value;
		}
		$res = array_values($res);
		return $res;
	}

	//	identify the client's request
	$action = $_POST['action'];
	switch ($action) 
	{
		case 'getTechnologies':				$getData = new DataGateway();
											$getData->getTechnologies($link);
											break;

		case 'getServices':					$getData = new DataGateway();
											$getData->getServices($link);
											break;

		case 'getFunctions':				$getData = new DataGateway();
											$getData->getFunctions($link, $_POST['serviceId']);
											break;

		case 'getFunctionInfo':				$getData = new DataGateway();
											$getData->getFunctionInfo($link, $_POST['functionId']);
											break;

		case 'addFunction':					$inserter = new Inserter();
											$data['name'] = $_POST['name'];
											$data['description'] = $_POST['description'];
											$data['serviceId'] = $_POST['serviceId'];
											$data['techId'] = $_POST['techId'];
											$data['result'] = $_POST['result'];
											$data['variables'] = decodeArray($_POST['variables']);
											$data['exceptions'] = decodeArray($_POST['exceptions']);
											$data['links'] = decodeArray($_POST['links']);
											$msg = $inserter->insertFunction($link, $data);
											echo $msg;	
											break;
		default:					# code...
									break;
	}
	mysqli_close($link);
	//	end of identifying 
?>