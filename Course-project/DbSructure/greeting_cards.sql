-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2024 at 09:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `greeting_cards`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `occasion` varchar(50) DEFAULT NULL,
  `wish` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cards`
--

INSERT INTO `cards` (`id`, `sender_id`, `receiver_id`, `occasion`, `wish`, `created_at`) VALUES
(9, 4, 5, 'Test', 'Some random text', '2024-06-12 12:31:24'),
(16, 5, 4, 'Test', 'Some random text', '2024-06-12 15:47:40'),
(17, 4, 5, 'Test', 'Some random text', '2024-06-12 18:35:51'),
(24, 7, 4, 'test', '1', '2024-06-12 18:47:30'),
(25, 7, 7, '1', '1', '2024-06-12 18:47:38'),
(26, 7, 7, '1', '1', '2024-06-12 18:49:59'),
(27, 7, 4, 'Test', 'Some random text', '2024-06-12 18:51:02'),
(28, 7, 7, '1', '1', '2024-06-12 18:52:40'),
(29, 7, 5, 'test', '1erere', '2024-06-12 18:57:04'),
(30, 7, 5, 'test', '11111', '2024-06-12 19:04:02'),
(31, 7, 7, '1', '1', '2024-06-12 19:04:21'),
(32, 7, 4, 'Test', 'Some random text', '2024-06-12 19:05:16'),
(33, 10, 4, 'Test', 'Some random text', '2024-06-12 19:10:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(4, 'Ivan', '1212dgsdg@gmail.com', '$2y$10$bZPdKYinib4ICMBBNgs2je.cN4THq1SEMsIv76SqTY4G3OZuNeMZe'),
(5, 'Mitko', 'test@gmail.com', '$2y$10$M02XVZlRoAdxmUDgCHOOCeIX5SrPDa.TWjA8.RRBWkWcmL0rK0w7e'),
(10, '1', '1@i.ii', '$2y$10$.MYwXyEiiGQxY5h.UdYUj.6/t3Ln.hCqjcu5S1hUFyEGvJvpacXGu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`,`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
