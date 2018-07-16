DROP DATABASE IF EXISTS `bamazonDB`;

CREATE DATABASE `bamazonDB`;

USE `bamazonDB`;

CREATE TABLE `products` (
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(30) NOT NULL, 
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(10),
	PRIMARY KEY (item_id)
);

INSERT INTO `products` (product_name, department_name, price, stock_quantity)
VALUES ('Bose Noise-Cancelling Headphones', 'Electronics', 234.99, 25),
('Sennheiser IE 80 S', 'Electronics', 349.99, 10),
('Darkest Dungeon', 'Video Games', 25, 75),
('Kings Quest', 'Video Games', 30, 60),
('Dont Starve', 'Video Games',  20, 63),
('Firewatch', 'Video Games', 30, 68),
('Samsung TV Soundbar', 'Electronics', 284.99, 55),
('10-Port USB Hub', 'Electronics', 17.99, 4),
('Nvidia GTX1080TI', 'Computer Parts', 809.99, 1),
('Radeon RX Vega56', 'Computer Parts', 519.99, 2);

SELECT * FROM `products`;