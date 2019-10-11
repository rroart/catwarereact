const dnb = require('./dnb/index');
const consent = require('./dnbsandbox/consent');
const account = require('./dnbsandbox/account');
const pay = require('./dnbsandbox/pay');
// Import packages
const express = require('express')
const morgan = require('morgan')
// App
const app = express()
// Morgan
app.use(morgan('tiny'))
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));
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

app.get('/dnb/currencies/:cur', (req, res) => {
    console.log(req.params.cur);

    (async() => {
	const currencies = await dnb.getCurrencyConversions('NOK').catch((err) => console.log('caught it'));
	res.json(currencies)
    })()

    res.json("end")

})

app.get('/dnb/consents/:personnummer', (req, res) => {
    (async() => {
	console.log("body");
	const result = await consent.post(req.params.personnummer).catch((err) => console.log('caught it'));
	console.log(result);
	res.json({ consentId : result.consentId, href : result._links.scaRedirect.href });
    })()
    //res.json("end2")
})

app.get('/dnb/consents/:personnummer/:contentid', (req, res) => {
    (async() => {
	const result = await consent.post(req.params.personnummer, req.params.consentid).catch((err) => console.log('caught it'));
	console.log(result);
	res.json({ consentId : result.consentId });
    })()
    //res.json("end2")
})

app.get('/dnb/accounts/:consentid', (req, res) => {
    account(req.params.consentid);
    (async() => {
	const result = await account(req.params.consentid).catch((err) => console.log('caught it'));
	console.log(result);
	console.log(result.accounts.length);
	console.log(typeof result.accounts[0]);
	var l = []
	var i;
	for (i = 0; i < result.accounts.length; i++) {
	    l.push(result.accounts[i].bban); 
	}
	res.json({ accounts : l });
    })()
    //res.json("end2")
})

app.get('/dnb/accounts/pay/:ssn/:creditor/:creditorname/:debtor/:amount', (req, res) => {
    //account(req.params.consentid);
    (async() => {
	const result = await pay(req.params.ssn, req.params.creditor, req.params.creditorname, req.params.debtor, req.params.amount).catch((err) => console.log('caught it'));
	console.log(result);
	res.json({ paymentId : result.paymentId, href : result._links.scaRedirect.href });
	//res.json({ result : result });
    })()
    //res.json("end2")
})

// Starting server
app.listen('1337')
