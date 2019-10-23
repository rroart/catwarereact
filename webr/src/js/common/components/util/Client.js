/* eslint-disable no-undef */
function search(query, cb) {
  return fetch(`http://localhost:1337` + query, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb)
    .catch((error) => console.log(error.message));
}

function post(query, data, cb) {
    console.log(JSON.stringify(data))
  return fetch(`http://localhost:1337` + query, {
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

function checkStatusNot(response) {
  if (response.status < 200 || response.status >= 300) {
      console.log(response)
  }
  return response;
}

function checkStatus(response) {
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

function parseJSON(response) {
  return response.json();
}

const Client = { search, post };
export default Client;
