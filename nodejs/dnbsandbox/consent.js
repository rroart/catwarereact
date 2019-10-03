const common = require('./common')

const request = require('../dnb/request')

const psd2endpoint = 'sandboxapi.psd.dnb.no'

module.exports = function consent() {
    const req = common.createRequest({
	    host: psd2endpoint, 
	    path: '/v1/consents',
	    method: 'POST',
	    data: data1,
    });
    var date = new Date();
    date.setMonth(date.getMonth() + 2);
    validUntil = date.toISOString().split('T')[0];
    console.log(validUntil);
    console.log(req);
    return request(req);
}

const data1 = {
    "validUntil": "2019-12-03",
    "frequencyPerDay": 3,
    "access": {
        "balances": [],
        "accounts": [],
        "transactions": []
    },
    "recurringIndicator": true,
    "combinedServiceIndicator": false
};
