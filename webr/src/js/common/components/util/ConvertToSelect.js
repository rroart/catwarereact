/* eslint-disable no-undef */

function convert(array) {
  console.log(typeof array);
  var myArray = [];
  for(var i in array) {
    var item = {
      label: array[i],
      value: array[i]
    }
    myArray.push(item);
  }
  console.log(typeof myArray);
  return myArray;
}

function convertAccounts(array) {
  array = array.accounts;
  console.log(array);
  console.log(typeof array);
  var myArray = [];
  for(var i in array) {
    var acc = array[i];
    var item = {
      value: acc.bban,
      label: acc.bban + " " + acc.name + " Disponibelt: " + acc.authorisedBalance,
    }
    myArray.push(item);
  }
  console.log(typeof myArray);
  console.log(myArray);
  return myArray;
}

const ConvertToSelect = { convert, convertAccounts };
export default ConvertToSelect;
