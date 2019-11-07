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
  console.log(array);
  console.log(typeof array);
  var myArray = [];
  for(var i in array) {
    var acc = array[i];
    var item = {
      label: acc.bban,
      value: acc.bban + " " + acc.name + " Disponibelt: " + acc.authorizedBalance,
    }
    myArray.push(item);
  }
  console.log(typeof myArray);
  return myArray;
}

const ConvertToSelect = { convert, convertAccounts };
export default ConvertToSelect;
