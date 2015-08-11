-- phpMyAdmin SQL Dump
-- version 3.4.10.1deb1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Янв 05 2014 г., 17:41
-- Версия сервера: 5.5.34
-- Версия PHP: 5.3.10-1ubuntu3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `document`
--

-- --------------------------------------------------------

--
-- Структура таблицы `exceptions`
--

CREATE TABLE IF NOT EXISTS `exceptions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `FunctionID` int(11) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `exceptions`
--

INSERT INTO `exceptions` (`ID`, `Name`, `FunctionID`, `Description`) VALUES
(1, 'ex1', 5, 'ex1desc'),
(2, 'ex2', 5, 'ex2desc');

-- --------------------------------------------------------

--
-- Структура таблицы `functions`
--

CREATE TABLE IF NOT EXISTS `functions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Description` text NOT NULL,
  `ServiceID` int(11) NOT NULL,
  `TechID` int(11) NOT NULL,
  `Result` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `functions`
--

INSERT INTO `functions` (`ID`, `Name`, `Description`, `ServiceID`, `TechID`, `Result`) VALUES
(1, 'start', 'Начинает заполнение глобальных массива globalData информацией о сервисах, технологиях, функциях выбранного сервиса.', 3, 1, 'Заполнена вся начальная информация'),
(2, 'getFunctions', 'Заполняет глобальный массив функциями, имеющимися в выбранном сервисе', 3, 1, '{}'),
(3, 'getFunctions', 'Возвращает список всех функций с описаниями и идентификаторами по выбранному ID сервиса', 3, 2, 'array'),
(4, 'getServices', 'Возвращает массив сервисов, имеющихся в компании', 3, 2, 'array'),
(5, 'JS', 'description', 3, 2, 'result'),
(6, '', '', 3, 2, '');

-- --------------------------------------------------------

--
-- Структура таблицы `links`
--

CREATE TABLE IF NOT EXISTS `links` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `FunctionID` int(11) NOT NULL,
  `LinkID` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `links`
--

INSERT INTO `links` (`ID`, `FunctionID`, `LinkID`) VALUES
(1, 5, 1),
(2, 5, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `services`
--

CREATE TABLE IF NOT EXISTS `services` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Address` varchar(50) NOT NULL,
  `AjaxPath` varchar(50) NOT NULL,
  `FtpPath` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `services`
--

INSERT INTO `services` (`ID`, `Name`, `Address`, `AjaxPath`, `FtpPath`) VALUES
(1, 'FILIAL', 'filial.barstrade.ru', '/phpLib/AjaxRequest.php', 'filial.barstrade.ru@filial'),
(2, 'SGP', 'sgp.barstrade.ru', '/phpLib/AjaxRequest.php', 'sgp.barstrade.ru@sgp'),
(3, 'DOCUMENT', 'document.barstrade.ru', 'phpLib/AjaxRequest.php', 'ftp.barstrade.ru@document');

-- --------------------------------------------------------

--
-- Структура таблицы `technologies`
--

CREATE TABLE IF NOT EXISTS `technologies` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `technologies`
--

INSERT INTO `technologies` (`ID`, `Name`) VALUES
(1, 'PHP'),
(2, 'JS');

-- --------------------------------------------------------

--
-- Структура таблицы `variables`
--

CREATE TABLE IF NOT EXISTS `variables` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Type` varchar(20) NOT NULL DEFAULT 'var',
  `FunctionID` int(11) NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `variables`
--

INSERT INTO `variables` (`ID`, `Name`, `Type`, `FunctionID`, `Description`) VALUES
(1, 'first', '1t', 5, '1d'),
(2, 'second', '2t', 5, '2d');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
