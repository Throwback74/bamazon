var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var item_ID = [];
var item = [];
var category = [];
var price = [];
var quantity = [];
var count = 0;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // postItem();
    console.log("All Items available...\n");
    readItems();
});

var readItems = function () {
    // console.log("All Items available...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // for (var i = 0; i < res.length; i++) {
        if (count < res.length) {
            item_ID.push(res[count].item_id);
            item.push(res[count].product_name);
            category.push(res[count].department_name);
            price.push(res[count].price);
            quantity.push(res[count].stock_quantity);
            // connection.end();

            console.log(item_ID, item, category, price, quantity);
            // console.log(item_ID);
            console.table([{
                itemID: item_ID,
                item: item,
                category: category,
                price: price,
                quantity: quantity
            }]);
            count++;
            readItems();
            // var itemTable = [{ ItemID: item_ID, Items: item, Category: category, Price: price, Quantity: quantity}];
            // console.table(itemTable);
        } else {
            (console.log("Still broken"));
        }
    });
};