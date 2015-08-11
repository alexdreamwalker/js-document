<?php
	// класс служит для добавления данных в БД
	class Inserter 
	{
		// Свойства - start
		private $nl;	// символ перевода на новую строку, для удобства отображения ошибок
		private $arrDate; // список названиий полей с датами в БД
		// Свойства - end

		public function __construct() // Конструктор
		{
			//$this->nl = chr(13).chr(10);
			$this->nl = "<br>";
			$this->arrDate = array('DateOrder', 'DateMeasure', 'DateStartMontage');
			date_default_timezone_set('Asia/Yekaterinburg');
		}

		public function insertOffice($link, $data) // функция добавляет офис в БД и возвращает его id
		{
			//print_r($data); return;
			mysqli_select_db($link, dbAuth) or die("Query error:	".mysqli_error());
			$msg;
			$stmt = mysqli_prepare($link, "INSERT offices (IDCompany, Address)
										 VALUES(?, ?)");

			mysqli_stmt_bind_param($stmt, "ds", $data['idCompany'], $data['address']);

			mysqli_stmt_execute($stmt);

			if(trim(mysqli_stmt_error($stmt)) == "")
					$msg = mysqli_insert_id($link);
				else
					$msg = 0;

			mysqli_stmt_close($stmt);

			if(!$this->iniOfficeInCashAvailable($link, $msg))
				$msg = "Ошибка при инициализации офиса в таблице инкассации: обратитесь к администратору!";

			mysqli_select_db($link, dbFilial) or die("Query error:	".mysqli_error());
			return $msg;
		}

		public function insertFunction($link, $data) // функция добавляет офис в БД и возвращает его id
		{
			mysqli_select_db($link, dbDocument) or die("Query error:	".mysqli_error());
			$msg;
			$stmt = mysqli_prepare($link, "INSERT functions(Name, Description, ServiceID, TechID, Result)
										 VALUES(?, ?, ?, ?, ?)");

			mysqli_stmt_bind_param($stmt, "ssdds", $data['name'], $data['description'], $data['serviceId'], $data['techId'], $data['result']);

			mysqli_stmt_execute($stmt);

			if(trim(mysqli_stmt_error($stmt)) == "")
					$msg = mysqli_insert_id($link);
				else
					$msg = 0;

			mysqli_stmt_close($stmt);

			if($msg != 0)
			{
				$idF = $msg;
				$msg = $this->insertVariables($link, $idF, $data['variables']);
				if($msg == 0) return "Error inserting variables";
				$msg = $this->insertExceptions($link, $idF, $data['exceptions']);
				if($msg == 0) return "Error inserting exceptions";
				$msg = $this->insertLinks($link, $idF, $data['links']);
				if($msg == 0) return "Error inserting links";
				else $msg = "OK inserting function";
			} else $msg = "Error inserting general function data";

			return $msg;
		}

		public function insertVariables($link, $idFunction, $arr)
		{
			$stmt = mysqli_prepare($link, "INSERT variables (Name, Type, FunctionID, Description) VALUES(?, ?, ?, ?)");
			$n = count($arr);
			//print_r($arrImg);
			for($i = 0; $i < $n; $i++)
			{
				$val = $arr[$i];
				mysqli_stmt_bind_param($stmt, "ssds", $val['name'], $val['type'], $idFunction, $val['description']);
				mysqli_stmt_execute($stmt);

				if(trim(mysqli_stmt_error($stmt)) != "")
				{
					$msg = 0;
					return $msg;
				}
			}

			mysqli_stmt_close($stmt);
			return 1;
		}

		public function insertExceptions($link, $idFunction, $arr)
		{
			$stmt = mysqli_prepare($link, "INSERT exceptions (Name, FunctionID, Description) VALUES(?, ?, ?)");
			$n = count($arr);
			//print_r($arrImg);
			for($i = 0; $i < $n; $i++)
			{
				$val = $arr[$i];
				mysqli_stmt_bind_param($stmt, "sds", $val['name'], $idFunction, $val['description']);
				mysqli_stmt_execute($stmt);

				if(trim(mysqli_stmt_error($stmt)) != "")
				{
					$msg = 0;
					return $msg;
				}
			}

			mysqli_stmt_close($stmt);
			return 1;
		}

		public function insertLinks($link, $idFunction, $arr)
		{
			$stmt = mysqli_prepare($link, "INSERT links (FunctionID, LinkID) VALUES(?, ?)");
			$n = count($arr);
			//print_r($arrImg);
			for($i = 0; $i < $n; $i++)
			{
				$val = $arr[$i];
				mysqli_stmt_bind_param($stmt, "dd", $idFunction, $val['linkId']);
				mysqli_stmt_execute($stmt);

				if(trim(mysqli_stmt_error($stmt)) != "")
				{
					$msg = 0;
					return $msg;
				}
			}

			mysqli_stmt_close($stmt);
			return 1;
		}
		
	}
?>