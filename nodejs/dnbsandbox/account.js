const common = require('./common')

const request = require('../dnb/request')

const psd2endpoint = 'sandboxapi.psd.dnb.no'

module.exports = function account(consentid) {
    const req = common.createRequest({
	    host: psd2endpoint, 
	    path: '/v1/accounts',
	    method: 'GET',
	consentid: consentid,
    });
    console.log(req);
    return request(req);
}

