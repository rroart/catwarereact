// Import packages
const express = require('express')
const morgan = require('morgan')
// App
const app = express()
// Morgan
app.use(morgan('tiny'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// First route
app.get('/', (req, res) => {
    res.json({ message: 'Hello world' })
})
app.get('/misc/payex/firmanavn/suggest/:firma', (req, res) => {
    console.log(req.params.firma)
    liste = ['Hello world', 'Catware']
    var found
    for (var elem in liste) {
	console.log(liste[elem]);
	if (liste[elem].startsWith(req.params.firma)) {
	    found = elem;
	}
    }
    if (found == undefined) {
	res.json('')
    } else {
	console.log(liste[found])
	res.json(liste[found])
    }
    //res.json({ firmanavn: liste[found] })
})
app.get('/misc/payex/firmanavn/search/:firma', (req, res) => {
    res.json({ orgnr : 918399038, firmanavn : "Catware AS", navn : "Catware AS", faktureringsadresse : { adresse : "Åkebergveien 12", postnummer : 0650, poststed : "Oslo" }, besoksadresse : { adresse : "Åkebergveien 12", postnummer : 0650, poststed : "Oslo" } })
})
// Starting server
app.listen('1337')
