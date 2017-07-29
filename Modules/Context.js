var alasql = require("Libs/alasql.js");
var Observable = require("FuseJS/Observable");
var products = Observable();
var sales = Observable();
var products_sales = Observable();
var store = Observable();
var totalamount = Observable(0);
var product = Observable();
var switchFromUpdateToAdd = Observable(false);
var salesmade = Observable();
var totalDailySales = Observable(0);

alasql('CREATE localStorage DATABASE IF NOT EXISTS instacalc1');
alasql('ATTACH localStorage DATABASE instacalc1');
alasql('USE instacalc1');
alasql('CREATE TABLE IF NOT EXISTS product (id INT PRIMARY KEY NOT NULL, name STRING, price MONEY, quantity INT, batchno STRING, expiringdate STRING, category_id INT)');
alasql('CREATE TABLE IF NOT EXISTS sales (id INT PRIMARY KEY NOT NULL, totalamount MONEY, created_at STRING, products_sold STRING)');
alasql('CREATE TABLE IF NOT EXISTS category (id INT PRIMARY KEY NOT NULL, name STRING)');

function expireTracker(datestring) {
    var color
	var today = new Date()
	var expiringdate = checkExpiringDateFormat(datestring)

	if (expiringdate != null) {
	if (today > expiringdate) {

    color = "#fc423e"

	} else {
    var diff = expiringdate.getTime() - today.getTime()
    diff = Math.floor(diff/(1000*60*60*24))
    if (diff <= 30) {
      color = "#fcb370"

    }else {
      color = "#b2ccf8"
    }
  }


	} else {
    color = "#b2ccf8"

	}
  return color
}

	function checkExpiringDateFormat(datestring) {
	var result = datestring.match(/\d/)
	if (result !=null) {
		return new Date(datestring)
	}
	return null

}

function renderDateString(datestring) {
		var result = datestring.match(/\d/)
		if (result != null) {
			return new Date(datestring).toDateString()
		}
		return datestring
}


function getProducts() {
	var res = alasql('SELECT * FROM product ORDER BY name ASC');
	store.replaceAll(res);
	store.forEach(function(product) {
	   product.expireTracker = Observable()
       product.bb = Observable()
       product.bb.value = "BB : "+ product.expiringdate
       product.expireTracker.value = expireTracker(product.expiringdate)
       products.add(product)
	});
}

getProducts();


/*function getProductsByCategory(cat_id) {
	var res = alasql('SELECT * FROM product WHERE category_id = cat_id');
	store.replaceAll(res);
	store.forEach(function(product) {
	   product.expireTracker = Observable()
       product.bb = Observable()
       product.bb.value = "BB : "+ product.expiringdate
       product.expireTracker.value = expireTracker(product.expiringdate)
       products.add(product)
	});
}*/

function addProduct(name, price, batchno, expiringdate, quantity) {
	var productbb = "BB : "+ renderDateString(expiringdate)
	var product_id = (Math.floor(Math.random() * 5000000) + products.length);
	//products.add({id: product_id, name: name, price: Number(price), batchno: batchno, expiringdate: renderDateString(expiringdate), quantity: Number(quantity), bb: productbb, expireTracker: expireTracker(expiringdate)});
	alasql('SELECT * INTO product FROM ?',[[
		{id: product_id, name: name, price: Number(price), batchno: batchno, expiringdate: renderDateString(expiringdate), quantity: Number(quantity)}]]);	
	products.clear();
	getProducts();
}

function addSales() {
	var sales_id = (Math.floor(Math.random() * 50000000000) + products_sales.length);
	var store_array = [];
	products_sales.forEach(function(products) {
		store_array.push(products)
	});

	sales.add({id: sales_id, totalamount: totalamount.value, created_at: new Date(Date.now()).toDateString(), products_sold: JSON.stringify(store_array)});
	alasql('SELECT * INTO sales FROM ?',[[
		{id: sales_id, totalamount: totalamount.value, created_at: new Date(Date.now()).toDateString(), products_sold: JSON.stringify(store_array)}]]);	
}


function getSales(date) {
	totalDailySales.value = 0;
	salesmade.clear();
	var d = new Date(date).toDateString()
	var res = alasql('SELECT * FROM sales ORDER BY created_at DESC');
	//alasql('DELETE FROM sales')
	res.forEach(function(sale) {
		if (sale.created_at == d) {
			sale.products_sold = JSON.parse(sale.products_sold)
			salesmade.add(sale)
		}
	})

	salesmade.forEach(function(sale) {
		totalDailySales.value = totalDailySales.value + sale.totalamount
	})
	//console.log(JSON.stringify(salesmade.value))
}

function updateProduct(id, name, batchno, quantity, expiringdate, price) {
	  for (var i = 0; i < products.length; i++) {
        var product = products.getAt(i);
        if (product.id == id) {
            product.name = name;
            product.batchno = batchno;
            product.quantity= Number(quantity);
            product.expiringdate = renderDateString(expiringdate);
            product.price = Number(price);
            product.bb = "BB : "+ product.expiringdate
            product.expireTracker = expireTracker(expiringdate);
            products.replaceAt(i, product);    
            break;
        }
    }
    //alasql('UPDATE product SET name = name, batchno = batchno, quantity = quantity, price = price, expiringdate = expiringdate WHERE id = id')
    alasql('DELETE FROM product WHERE id = id');
    products.forEach(function(product) {
    	alasql('SELECT * INTO product FROM ?',[[
		{id: product.id, name: product.name, price: Number(product.price), batchno: product.batchno, expiringdate: renderDateString(product.expiringdate), quantity: Number(product.quantity)}]]);	
	
    })
    products.clear();
    getProducts();
}

function editProductSalesPrice(id, price, quantity) {
	for (var i = 0; i < products_sales.length; i++) {
        var product = products_sales.getAt(i);
        if (product.id == id) {
            product.price = Number(price);
            product.quantity = quantity
            products_sales.replaceAt(i, product);    
            break;
        }
    }
    totalamount.value = 0;
	products_sales.forEach(function(product) {
		totalamount.value = (totalamount.value + (product.price * product.quantity));
	});
}

function closeSales() {
	products_sales.forEach(function(prod) {
		for (var i = 0; i < products.length; i++) {
        var product = products.getAt(i);
        if (product.id == prod.id) {
            product.quantity= product.quantity - Number(prod.quantity);
            products.replaceAt(i, product);    
            break;
        }
    }
    var id = prod.id
    alasql('DELETE FROM product WHERE id = id');
    products.forEach(function(product) {
    	alasql('SELECT * INTO product FROM ?',[[
		{id: product.id, name: product.name, price: Number(product.price), batchno: product.batchno, expiringdate: renderDateString(product.expiringdate), quantity: Number(product.quantity)}]]);	
	
    })
	})
	addSales();
	products_sales.clear();
}

function editProductSales(id, name, batchno, quantity, expiringdate, price) {
	  for (var i = 0; i < products.length; i++) {
        var product = products.getAt(i);
        if (product.id == id) {
            product.name = name;
            product.batchno = batchno;
          //  product.quantity= product.quantity - Number(quantity);
            product.expiringdate = renderDateString(expiringdate);
            product.price = Number(price);
            product.bb = "BB : "+ product.expiringdate
            product.expireTracker = expireTracker(expiringdate);
            products.replaceAt(i, product); 
            editProductSalesPrice(id, price, Number(quantity))   
            break;
        }
    }
    //alasql('UPDATE product SET name = name, batchno = batchno, quantity = quantity, price = price, expiringdate = expiringdate WHERE id = id')
    alasql('DELETE FROM product WHERE id = id');
    products.forEach(function(product) {
    	alasql('SELECT * INTO product FROM ?',[[
		{id: product.id, name: product.name, price: Number(product.price), batchno: product.batchno, expiringdate: renderDateString(product.expiringdate), quantity: Number(product.quantity)}]]);	
	
    })
    products.clear();
    getProducts();
}

function deleteProduct(product) {
	products.remove(product);
	var id = product.id
	alasql('DELETE FROM product WHERE id = id');
	products.forEach(function(product) {
    	alasql('SELECT * INTO product FROM ?',[[
		{id: product.id, name: product.name, price: Number(product.price), batchno: product.batchno, expiringdate: renderDateString(product.expiringdate), quantity: Number(product.quantity)}]]);	
	
    })
    products.clear();
    getProducts();
}

function addProductSales(id, name, price, quantity, batchno, expiringdate) {
	totalamount.value = 0;
	products_sales.add({id: id, name: name, price: Number(price), quantity: Number(quantity), batchno: batchno, expiringdate: expiringdate});
	products_sales.forEach(function(product) {
		totalamount.value = (totalamount.value + (product.price * product.quantity));
	});
}

function removeProductSales(product) {
	totalamount.value = 0;
	products_sales.remove(product);
	products_sales.forEach(function(product) {
		totalamount.value = (totalamount.value + (product.price * product.quantity));
	});
}



module.exports = {
	alasql,
	products,
	salesmade,
	products_sales,
	getProducts,
	addProduct,
	addSales,
	updateProduct,
	addProductSales,
	removeProductSales,
	editProductSales,
	totalamount,
	product,
	switchFromUpdateToAdd,
	deleteProduct,
	closeSales,
	getSales,
	sales,
	totalDailySales
}