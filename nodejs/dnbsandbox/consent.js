const common = require('./common')

const request = require('../dnb/request')

const psd2endpoint = 'sandboxapi.psd.dnb.no'

exports.post = function post(psuid) {
    const req = common.createRequest({
	    host: psd2endpoint, 
	    path: '/v1/consents',
	    method: 'POST',
	data: data1,
	psuid: psuid,
    });
    console.log(req);
    return request(req);
}

exports.get = function get(psuid, consentid) {
    const req = common.createRequest({
	    host: psd2endpoint, 
	    path: '/v1/consents',
	    method: 'POST',
	data: data1,
	psuid: psuid,
	consentid: consentid,
    });
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
