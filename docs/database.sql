-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 04, 2020 at 01:41 AM
-- Server version: 5.7.31-0ubuntu0.18.04.1
-- PHP Version: 5.6.40-30+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `liveClass`
--

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `classId` int(11) NOT NULL COMMENT 'class id',
  `classTeacherId` int(11) NOT NULL COMMENT 'class teacher user id',
  `classTeacher` varchar(11) NOT NULL COMMENT 'class teacher name',
  `classStartTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'class start time',
  `classEndTime` datetime DEFAULT NULL COMMENT 'class end time',
  `classRoom` varchar(11) NOT NULL COMMENT 'class room'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `visitor`
--

CREATE TABLE `visitor` (
  `visitorId` int(11) NOT NULL COMMENT 'visitor Id primary index',
  `visitorName` varchar(255) NOT NULL COMMENT 'visitor name',
  `visitorRole` tinyint(2) NOT NULL COMMENT 'visitor role (1: teacher, 0:student)',
  `visitorStatus` tinyint(2) NOT NULL DEFAULT '1' COMMENT 'visitor status (1: active, 0:in active)',
  `visitorClass` varchar(11) NOT NULL,
  `visitorVisitedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'visitor visited time',
  `visitorUpdatedTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'visitor updated time'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`classId`);

--
-- Indexes for table `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`visitorId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'class id', AUTO_INCREMENT=92;
--
-- AUTO_INCREMENT for table `visitor`
--
ALTER TABLE `visitor`
  MODIFY `visitorId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'visitor Id primary index', AUTO_INCREMENT=118;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
