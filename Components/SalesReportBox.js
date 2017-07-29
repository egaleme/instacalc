var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

var date = Observable();
var todaysDate = Observable();
todaysDate.value = '';

Context.salesmade.clear();
Context.totalDailySales.value = 0;

function getSales() {
	Context.getSales(date.value);
	today(date.value);
	date.value = ''	
}

var salesmade = Context.salesmade.map(function(x) {
	return x
})

function today(x) {
	todaysDate.value = new Date(x).toDateString()
}

var totalDailySales = Context.totalDailySales.map(function(x) {
	return `Total Sales : =N= `+ x.toFixed(2)
})

module.exports = {
	getSales,
	sales: salesmade,
	totalDailySales,
	date,
	todaysDate
}
