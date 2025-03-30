-- MySQL dump 10.13  Distrib 8.0.35, for macos13 (arm64)
--
-- Host: localhost    Database: FraudBanking
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AssetReceivable`
--

DROP TABLE IF EXISTS `AssetReceivable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssetReceivable` (
  `asset_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `loan_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `receivable_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`asset_id`),
  KEY `loan_id` (`loan_id`),
  CONSTRAINT `assetreceivable_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `Loans` (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssetReceivable`
--

LOCK TABLES `AssetReceivable` WRITE;
/*!40000 ALTER TABLE `AssetReceivable` DISABLE KEYS */;
INSERT INTO `AssetReceivable` VALUES (1,1,1,81590.27,'2025-03-28 21:52:30'),(2,1,2,90833.33,'2025-03-28 21:52:51'),(3,1,3,90833.33,'2025-03-28 21:52:52'),(4,1,4,90833.33,'2025-03-28 21:52:53'),(5,1,5,90833.33,'2025-03-28 21:52:53'),(6,999,6,90833.33,'2025-03-28 21:53:08');
/*!40000 ALTER TABLE `AssetReceivable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CreditRequests`
--

DROP TABLE IF EXISTS `CreditRequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CreditRequests` (
  `credit_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `loan_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `credit_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`credit_id`),
  KEY `loan_id` (`loan_id`),
  CONSTRAINT `creditrequests_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `Loans` (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CreditRequests`
--

LOCK TABLES `CreditRequests` WRITE;
/*!40000 ALTER TABLE `CreditRequests` DISABLE KEYS */;
INSERT INTO `CreditRequests` VALUES (1,1,1,-100000.00,'2025-03-28 21:52:30'),(2,1,2,-100000.00,'2025-03-28 21:52:51'),(3,1,3,-100000.00,'2025-03-28 21:52:52'),(4,1,4,-100000.00,'2025-03-28 21:52:53'),(5,1,5,-100000.00,'2025-03-28 21:52:53'),(6,999,6,-100000.00,'2025-03-28 21:53:08');
/*!40000 ALTER TABLE `CreditRequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EMI`
--

DROP TABLE IF EXISTS `EMI`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EMI` (
  `emi_id` bigint NOT NULL AUTO_INCREMENT,
  `loan_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `emi_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`emi_id`),
  KEY `loan_id` (`loan_id`),
  CONSTRAINT `emi_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `Loans` (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EMI`
--

LOCK TABLES `EMI` WRITE;
/*!40000 ALTER TABLE `EMI` DISABLE KEYS */;
INSERT INTO `EMI` VALUES (1,1,1,10000.00,'2025-03-28 21:52:38'),(2,1,1,10000.00,'2025-03-28 21:53:21'),(3,2,1,10000.00,'2025-03-28 21:53:21'),(4,3,1,10000.00,'2025-03-28 21:53:21'),(5,4,1,10000.00,'2025-03-28 21:53:21'),(6,5,1,10000.00,'2025-03-28 21:53:21');
/*!40000 ALTER TABLE `EMI` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InterestPayments`
--

DROP TABLE IF EXISTS `InterestPayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InterestPayments` (
  `interest_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `loan_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date_paid` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`interest_id`),
  KEY `loan_id` (`loan_id`),
  CONSTRAINT `interestpayments_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `Loans` (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InterestPayments`
--

LOCK TABLES `InterestPayments` WRITE;
/*!40000 ALTER TABLE `InterestPayments` DISABLE KEYS */;
INSERT INTO `InterestPayments` VALUES (1,1,1,833.33,'2025-03-28 21:52:38'),(2,1,1,0.00,'2025-03-28 21:53:21'),(3,1,2,0.00,'2025-03-28 21:53:21'),(4,1,3,0.00,'2025-03-28 21:53:21'),(5,1,4,0.00,'2025-03-28 21:53:21'),(6,1,5,0.00,'2025-03-28 21:53:21');
/*!40000 ALTER TABLE `InterestPayments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LOANS`
--

DROP TABLE IF EXISTS `LOANS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LOANS` (
  `loan_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `loan_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `customer_account` varchar(20) NOT NULL,
  PRIMARY KEY (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOANS`
--

LOCK TABLES `LOANS` WRITE;
/*!40000 ALTER TABLE `LOANS` DISABLE KEYS */;
INSERT INTO `LOANS` VALUES (1,1,100000.00,'2025-03-28 21:52:30','1234567890'),(2,1,100000.00,'2025-03-28 21:52:51','1234567890'),(3,1,100000.00,'2025-03-28 21:52:52','1234567890'),(4,1,100000.00,'2025-03-28 21:52:53','1234567890'),(5,1,100000.00,'2025-03-28 21:52:53','1234567890'),(6,999,100000.00,'2025-03-28 21:53:08','9999999999');
/*!40000 ALTER TABLE `LOANS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrincipalPayments`
--

DROP TABLE IF EXISTS `PrincipalPayments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PrincipalPayments` (
  `principal_id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `loan_id` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date_paid` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`principal_id`),
  KEY `loan_id` (`loan_id`),
  CONSTRAINT `principalpayments_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `Loans` (`loan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrincipalPayments`
--

LOCK TABLES `PrincipalPayments` WRITE;
/*!40000 ALTER TABLE `PrincipalPayments` DISABLE KEYS */;
INSERT INTO `PrincipalPayments` VALUES (1,1,1,9166.67,'2025-03-28 21:52:38'),(2,1,1,10000.00,'2025-03-28 21:53:21'),(3,1,2,10000.00,'2025-03-28 21:53:21'),(4,1,3,10000.00,'2025-03-28 21:53:21'),(5,1,4,10000.00,'2025-03-28 21:53:21'),(6,1,5,10000.00,'2025-03-28 21:53:21');
/*!40000 ALTER TABLE `PrincipalPayments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-30 22:27:04
