<?php
	// резеревируем константы для подключения к серверу
	define("dbHost", "localhost");
	define("dbLogin", "filial");
	define("dbPassword", "filial999876");
	define("dbDocument", "document");
	
	// установка соединения с БД
	$link = mysqli_connect(dbHost, dbLogin, dbPassword) or die("MySQL error:	".mysqli_error($link));
	mysqli_query($link, "set names utf8") or die("Query error:	".mysqli_error($link));
	mysqli_select_db($link, dbDocument) or die("Query error:	".mysqli_error($link));
?>