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
    // postItem();
    console.log("All Items available...\n");
    readItems();
    // start();
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

            // console.log(item_ID, item, category, price, quantity);
            // console.log(item_ID);
            console.table([{
                itemID: item_ID[count],
                item: item[count],
                category: category[count],
                price: price[count],
                quantity: quantity[count]
            }]);
            count++;
            readItems();
            // var itemTable = [{ ItemID: item_ID, Items: item, Category: category, Price: price, Quantity: quantity}];
            // console.table(itemTable);
        } else {
            console.log(item_ID);
            (console.log("...End List"));
            // start();
            // connection.end();
        }
    // }).then(function (initiate) {
    //     start();
    });
};

inquirer.prompt([{
    name: "selectPurchase",
    type: "list",
    message: "Select the ItemID for the item you would like to purchase",
    choices: item_ID
}, {
    name: "purchaseQuantity",
    type: "input",
    message: "How many would you like?"
}]).then(function (purchase) {
    itemPurchased = parseInt(purchase.selectPurchase);
    quantityBought = parseInt(purchase.purchaseQuantity);
    console.log('Buying: ' + quantityBought + ' of ' + itemPurchased);
    // if (itemPurchased < 11) {
    //     purchaseItem(itemPurchased, quantityBought);
    // } else {
    //     console.log("Please select an item ID");
    // }
},function (error) {
    console.error('uh oh: ', error);   // 'uh oh: something bad happened’
});

// var start = function () {
//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;
//         inquirer.prompt({
//             name: "selectPurchase",
//             type: "list",
//             message: "Select the ItemID for the item you would like to purchase",
//             choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//         }, {
//             name: "purchaseQuantity",
//             type: "input",
//             message: "How many would you like?"
//         }).then(function (answer) {
//             itemPurchased = parseInt(answer.selectPurchase);
//             quantityBought = parseInt(answer.purchaseQuantity);
//             if (itemPurchased < 11) {
//                 purchaseItem(itemPurchased, quantityBought);
//             } else {
//                 console.log("Please select an item ID");
//             }
//         });
//     });
// };

var purchaseItem = function (itemChoice, quantityPurchased) {
    if (quantityPurchased <= quantity[itemChoice]) {
        console.log("Processing Purchase...\n");
        quantity = quantity[itemChoice] - quantityPurchased;
        var query = connection.query(
            "UPDATE products SET ? WHERE ?", [{
                    stock_quantity: quantity
                },
                {
                    item_id: itemChoice
                }
            ],
            function (err, res) {
                console.log(item[itemChoice] + " Purchased!\n");
                console.log('Total: ' + (price[itemChoice] * quantity));
            }
        );

        // logs the actual query being run
        console.log(query.sql);
        // connection.end();
    } else {
        console.log('Insufficient Quantity');
    }
};