var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var lowItemID = [];
var lowItem = [];
var lowItemCat = [];
var lowItemPrice = [];
var lowItemInv = [];
function invReduce(value, index, array) {
    return value.stock_quantity < 5;
}
var lowInv = function(res) {
    var invReduction = res.filter(invReduce);
    console.log(invReduction);
    console.table(invReduction);
        for(var h = 0; h < invReduction.length; h++){
            if(invReduction[h].stock_quantity < 5){
                lowItemID.push(JSON.stringify(invReduction[h].item_id));
                lowItem.push(invReduction[h].product_name);
                lowItemCat.push(invReduction[h].department_name);
                lowItemPrice.push(invReduction[h].price);
                lowItemInv.push(invReduction[h].stock_quantity);
            }
            
            // console.log("ID: " + lowItemID + "item: " + lowItem + "Category: " + lowItemCat + "Price: " + lowItemPrice + "Inventory: " + lowItemInv);
    }   
    console.log(lowItemID);
};

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
    checkInv();
});

var checkInv = function() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log("res" + JSON.stringify(res));
            inquirer.prompt([{
                name: "chooseProcess",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }]).then(function (choice) {
                console.log(choice);
                if(choice.chooseProcess === 'View Products for Sale'){
                    console.table(res);
                    // console.log(query.sql);
                    // checkInv();
                    continueUpdate();
                }
                else if(choice.chooseProcess === 'View Low Inventory'){
                    lowInv(res);
                    continueUpdate();
                }
                else if(choice.chooseProcess === 'Add to Inventory'){
                    lowInv(res);
                    inquirer.prompt([{
                        name: "selectInvUpdate",
                        type: "list",
                        message: "Which item would you like to restock?",
                        choices: lowItemID
                    }, {
                        name: "restockQuantity",
                        type: "input",
                        message: "How many should be ordered for our inventory?"
                    }]).then(function (updateInv) {
                        updatedItem = parseInt(updateInv.selectInvUpdate);
                        quantityOrdered = parseInt(updateInv.restockQuantity);
                        console.log("Purchased " + quantityOrdered + " of " + lowItem[updatedItem-1] + " and added to stock");
                        if(true){
                            addInventory(updatedItem, quantityOrdered, res);
                            // console.log(query.sql);
                        }
                        continueUpdate();
                    });
                    
                }
                else if(choice.chooseProcess === 'Add New Product'){
                    console.table(res);
                    addNewInvItem(res);                    
                }
                else {
                    console.log("Please select an action");
                    checkInv();
                }
            });
    });
};

var addInventory = function(updatedItem, quantityOrdered, res) {
    var updatedItemIndex = (updatedItem-1);
    console.log("Adding to Inventory...\n");
    
    lowItemInv = lowItemInv[updatedItemIndex] + quantityOrdered;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: lowItemInv
            },
            {
                item_id: updatedItem
            }
        ],
        function (err, res) {
            console.log("\n" + lowItem[updatedItemIndex] + " Restocked!\n");
        }
    );
    // console.log(query.sql);
    // connection.end();
};

var addNewInvItem = function(res) {
    inquirer.prompt([{
        name: "addNewProduct",
        type: "input",
        message: "What Product would you like to add to the inventory?",
    },{
        name: "setDepartment",
        type: "input",
        message: "What department would you like this product to be in?"
    }, {
        name: "setPrice",
        type: "input",
        message: "What should the product's price be?"
    }, {
        name: "setQuantity",
        type: "input",
        message: "How many should we stock?"
    }]).then(function(answer) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.addNewProduct,
                department_name: answer.setDepartment,
                price: answer.setPrice,
                stock_quantity: answer.setQuantity
            },
            function(err) {
                if (err) throw err;
                console.log("Your new product has been added successfully!");
                checkInv();
            }
        );
    });
};

var continueUpdate = function() {
    inquirer.prompt([{
        name: "continueUpdating",
        type: "confirm",
        message: "Would you like to continue and make an order?"
    }]).then(function(reQuery) {
        console.log(reQuery);
        if(reQuery.continueUpdating === true) {
            checkInv();
        }else {
            console.log("Thank you!");
            connection.end();
        }
    });
};


// var lowInv = function(res) {
//     var invReduction = res.filter(invReduce);
//     console.table(invReduction);
    // for(var h = 0; h < res.length; h++){
    //     if(res[h].stock_quantity < 5){
    //     lowItemID.push(JSON.stringify(res[h].item_id));
    //     lowItem.push(res[h].product_name);
    //     lowItemCat.push(res[h].department_name);
    //     lowItemPrice.push(res[h].price);
    //     lowItemInv.push(res[h].stock_quantity);
    //     }
    // }    
// };

// var numbers = [4, 9, 16, 25];
// var over18 = numbers.filter(myFunction);

// function myFunction(value, index, array) {
//     return value > 18;
// }

// var invReduction = results.filter(invReduce);