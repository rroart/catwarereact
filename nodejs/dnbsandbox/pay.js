const common = require('./common')

const request = require('../dnb/request')

const psd2endpoint = 'sandboxapi.psd.dnb.no'

module.exports = function pay(ssn, creditor, creditorname, debtor, amount) {
    const data1 = {
	"creditorAccount" : { "bban" : creditor },
	"creditorName" : creditorname,
	"debtorAccount" : { "bban" : debtor },
	"instructedAmount" : { "amount" : amount, "currency" : "NOK" },
    };
    const req = common.createRequest({
	    host: psd2endpoint, 
	    path: '/v1/payments/norwegian-domestic-credit-transfers',
	    method: 'POST',
	ssn: ssn,
	data: data1,
    });
    console.log(req);
    return request(req);
}

