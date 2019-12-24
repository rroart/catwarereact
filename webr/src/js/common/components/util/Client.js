/* eslint-disable no-undef */

function getPort() {
    //return 1337;
    return 8080;
}

function getHost() {
    if (process.env.NODE_ENV == "production") {
	return "www.catwarebank.tk";
    }
    return "localhost";
}

function search(query, cb) {
    return fetch(`http://` + getHost() + `:` + getPort() + query, {
    accept: 'application/json',
    headers: {
	  'content-type': 'application/json',
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .catch((error) => console.log(error.message));
}

function post(query, data, cb) {
    console.log(JSON.stringify(data))
    return fetch(`http://` + getHost() + `:` + getPort() + query, {
    accept: 'application/json',
    headers: {
	  'content-type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .catch((error) => console.log(error.message));
}

function f(p) {
    console.log(p);
    console.log(Object.keys(p));
    console.log(typeof p);
    return p;
}

function checkStatus(response) {
    console.log(Object.keys( response));
  if (response.status < 200 || response.status >= 300) {
      console.log(response)
  }
  return response;
}

function checkStatusNot(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

async function mywait(response) {
    const result = await response.json();
    return result;
}

function parseJSON(response) {
    console.log(response.status);
    console.log(response);
    //return Promise.resolve(response);
	//.json();
    //resolve(response);
    //return response.json();
    //const some = response.json();
    //console.log(some);
    //console.log(Object.keys(some));
    //console.log(some.PromiseValue);
    return [ response.status, response ];
}

const Client = { search, post };
export default Client;
