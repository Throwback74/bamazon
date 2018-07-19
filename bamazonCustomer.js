var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var item_ID = [];
var item = [];
var category = [];
var price = [];
var quantity = [];
var count = 0;
var itemPurchased = 11;
var quantityBought = 0;

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
    console.log("All Items available...\n");
    readItems();
});

var readItems = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
            if (count < res.length) {
                item_ID.push(JSON.stringify(res[count].item_id));
                item.push(res[count].product_name);
                category.push(res[count].department_name);
                price.push(res[count].price);
                quantity.push(res[count].stock_quantity);
            count++;
            readItems();
            
        } else {
            console.table(res);
            (console.log("...End List"));
            promptID(res);
            }
    });
};


var promptID = function (res) {
    inquirer.prompt([{
            name: "selectPurchase",
            type: "list",
            message: "Select the ItemID for the item you would like to purchase",
            choices: item_ID //['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] 
        }, {
            name: "purchaseQuantity",
            type: "input",
            message: "How many would you like?"
        }]).then(function (purchase) {
            itemPurchased = parseInt(purchase.selectPurchase);
            quantityBought = parseInt(purchase.purchaseQuantity);
            console.log('Buying: ' + quantityBought + " " + item[itemPurchased-1]); //fix line to ref item name
            if (itemPurchased < 11) {
                purchaseItem(itemPurchased, quantityBought, res);
            } else {
                console.log("Please select an item ID");
            }            
        }, function (error) {
            console.error('uh oh: ', error); // 'uh oh: something bad happened’
            });
};

var purchaseItem = function (itemChoice, quantityPurchased, res) {
    var itemChoiceIndex = (itemChoice-1);    
    if (quantityPurchased <= quantity[itemChoiceIndex]) {
        console.log("Processing Purchase...\n");
        quantity = quantity[itemChoiceIndex] - quantityPurchased;
        var query = connection.query(
            "UPDATE products SET ? WHERE ?", [{
                    stock_quantity: quantity
                },
                {
                    item_id: itemChoice
                }
            ],
            function (err, res) {
                console.log(item[itemChoiceIndex] + " Purchased!\n");
                console.log('Total: $' + (price[itemChoiceIndex] * quantityPurchased));
            }
        );

        // logs the actual query being run
        console.log(query.sql);
        // connection.end();
    } else {
        console.log('Insufficient Quantity');
    }
    connection.end();
};

// module.exports = {
//     connection: connection,
    
// };

// module.exports.connection = connection;