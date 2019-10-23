var Datastore = require('nedb');
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
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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

app.post('/consents', (req, res) => {
    console.log(req.body)
    var db = new Datastore({ filename : '/tmp/nedb' });
    db.loadDatabase(function(err) { console.log(err) })
    db.findOne({ psuid : req.body.psuid }, function(err, doc) {
	console.log('Found user:' + err + ' ' + doc);
	if (doc === null) {
	    (async() => {
		console.log("body");
		console.log(req.body.psuid);
		const result = await consent.post(req.body.psuid).catch((err) => console.log('caught it'));
		//console.log(result);
		if (result.code === 200 || result.code === 201) {
		    console.log("consid" + result.body.consentId);
		    /*
		      db.update({ psuid : req.body.psuid }, { $set: { consentid : result.body.consentId } }, { }, function (err, numReplaced) {
		      if ( err ) {
		      console.log("error---->" + err);
		      } else {
		      console.log("replaced---->" + numReplaced);
		      }
		      });
		    */
		    db.insert({ psuid : req.body.psuid, consentid : result.body.consentId }, function (err, numReplaced) {
			if ( err ) {
			    console.log("error---->" + err);
			} else {
			    console.log("replaced---->" + numReplaced);
			}
		    });
		    db.findOne({ psuid : req.body.psuid }, function(err, doc) {
			console.log('Found user:' + err + ' ' + doc);
		    })
		    db.find({}).exec(function (err, docs) {console.log(docs);});
		    res.json( result.body._links.scaRedirect);
		} else {
		    console.log("error")
		    res.status(result.code)
		    res.json(result.body)
		}
	    })()
	    console.log("here")
	} else {
	    console.log("found");
	    (async() => {
		console.log("getting href");
		const result = await consent.get(req.body.psuid, doc.consentid).catch((err) => console.log('caught it'));
		if (result.code === 200 || result.code === 201) {
		    res.json(result.body._links.scaRedirect);
		} else {
		    res.json();
		}
	    })()
	}
    })
})

app.get('/consents/:psuid', (req, res) => {
    (async() => {
	const result = await consent.post(req.params.psuid, req.params.consentid).catch((err) => console.log('caught it'));
	console.log(result);

	res.json({ consentId : result.consentId });
    })()
    //res.json("end2")
})

app.get('/accounts/DNB/:psuid', (req, res) => {
    var db = new Datastore({ filename : '/tmp/nedb' });
    db.loadDatabase(function(err) { console.log(err) })
    db.find({}).exec(function (err, docs) {console.log(docs);});
    db.findOne({ psuid : req.params.psuid }, function(err, doc) {
	console.log('Found user:' + err + ' ' + doc);
	console.log(doc.consentid);
	(async() => {
	    const result = await account(doc.consentid).catch((err) => console.log('caught it'));
	    if (result.code === 200 || result.code === 201) {
		console.log("accounts" + result);
		console.log(result)
		console.log(result.body);
		console.log(typeof result.body.accounts[0]);
		var l = []
		var i;
		for (i = 0; i < result.body.accounts.length; i++) {
		    l.push(result.body.accounts[i].bban); 
		}
		res.json({ accounts : l });
	    } else {
                console.log("error")
		console.log(result.code)
		console.log(result.body)
                res.status(result.code)
                res.json(result.body)
            }
	})()
    })
})

app.get('/accounts/pay/:ssn/:creditor/:creditorname/:debtor/:amount', (req, res) => {
    //account(req.params.consentid);
    (async() => {
	const result = await pay(req.params.ssn, req.params.creditor, req.params.creditorname, req.params.debtor, req.params.amount).catch((err) => console.log('caught it'));
	console.log(result);
	res.json({ paymentId : result.paymentId, href : result._links.scaRedirect.href });
	//res.json({ result : result });
    })()
    //res.json("end2")
})

app.post('/accounts/pay', (req, res) => {
    //account(req.params.consentid);
    (async() => {
	console.log("headers")
	console.log(JSON.stringify(req.headers));
	console.log("postbody")
	console.log(req.body.customer)
	console.log(req.body.psuid)
	console.log(req.body.creditor)
	console.log(req.body.debtor)
	console.log(req.body.amount)
	const result = await pay(req.body.psuid, req.body.creditor, req.body.creditorname, req.body.debtor, req.body.amount).catch((err) => console.log('caught it'));
	console.log(result);
	console.log(result.body);
	res.json({ paymentId : result.body.paymentId, href : result.body._links.scaRedirect.href });
	//res.json({ result : result });
    })()
    //res.json("end2")
})

// Starting server
app.listen('1337')
