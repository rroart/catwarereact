const fs = require('fs')

const asv4 = require('../dnb/asv4')

const uuidv4 = require('uuid/v4')

function createAmzDate() {
    return new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
}

const psd2endpoint = 'sandboxapi.psd.dnb.no'

exports.createRequest = function createRequest({
    path,
    method = 'POST',
    data,
    queryString = '',
    ssn,
    consentid,
}) {
    const options = {
	host: psd2endpoint,
	key: fs.readFileSync('key/private.key'),
	cert: fs.readFileSync('key/certificate.pem'),
	headers: {
	    Host: psd2endpoint,
	    Accept: 'application/json',
	    'Content-type': 'application/json',
	    "X-Request-ID": uuidv4(),
	    "TPP-Redirect-URI": "http://0.0.0.0:3083",
	    "PSU-IP-Address": "212.251.233.248",
	    "PSU-User-Agent": "Chrome",
	},
	path,
	method,
    };
    if (queryString !== '') {
	options.path += `?${queryString}`;
    }
    if (ssn != undefined && ssn !== '') {
	options.headers["PSU-ID"] = ssn;
    }
    if (consentid != undefined && consentid !== '') {
	options.headers['Consent-ID'] = consentid;
    }
    if (data) {
	options.data = JSON.stringify(data);
	//options.headers['x-amz-content-sha256'] = asv4.hash(options.data, 'hex');
    }
    if (path.includes('token')) {
	options.headers.Authorization = asv4.sign(options, clientId, clientSecret);
    }
    return options;
}
