var Observable = require("FuseJS/Observable");

function goSalesScreen() {
	router.goto("sellingPage");
}

function goStockDiary() {
	router.goto("stockPage")
}

function goSalesReport() {
	router.goto("salesReport")
}

module.exports = {
	goStockDiary,
	goSalesScreen,
	goSalesReport
}