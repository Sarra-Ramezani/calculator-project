"use script";

let btnValue = 0; //stores target button value
let currentOperation = ""; //stores the whole operation step by step
let result = 0; // stores the result of current operation
let lastOperand;
//1. listen for click on parent, instead of each button child
//2. store value of the clicked button in btnValue
document
  .querySelector("#calc-btn-container")
  .addEventListener("click", (event) => {
    //closest() returns the closest button parent so when we click on svg, it gets its button parent's value
    const button = event.target.closest("button");

    //check if a button was found
    if (button) {
      btnValue = button.value;
    }

    console.log(btnValue);
    //check if the target button is operand or basic operators
    if (
      btnValue != "equals" &&
      btnValue != "clear" &&
      btnValue != "clear-all" &&
      btnValue != "." &&
      btnValue != "negative" &&
      btnValue != "%"
    ) {
      //add target button's value to currentOperation until clicking the equals (=)
      currentOperation += btnValue.toString();
      displayResult(currentOperation);
    } else if (btnValue === "equals") {
      //check if there is any division by zero
      if (checkZeroDivision(currentOperation))
        alert("You can't divide by zero! Try another operation.");
      else {
        //convert the currentOperation to mathematical operation then store the result
        result = new Function(`return ${currentOperation}`)();
        //check if result is decimal and has repeating decimals (+5 decimal places), then set decimal limiation to 4
        if (result.toString().includes(".")) {
          result = decimalPlaces(result) < 5 ? result : result.toFixed(4);
        }
        //to continue the opertaion, we set result to currentOperation
        currentOperation = result;
        displayPreviousOperation(currentOperation);
        displayResult(result);
      }
    } else if (btnValue === "clear") {
      //remove the last item of currentOperation
      currentOperation = currentOperation.slice(0, -1);
      //check if currentOperation is empty, show 0 as result
      currentOperation.length === 0
        ? displayResult(0)
        : displayResult(currentOperation);
    } else if (btnValue === "clear-all") {
      //reset currentOperation and result
      currentOperation = "";
      result = "";
      displayPreviousOperation(0);
      displayResult(0);
    } else if (btnValue === ".") {
      lastOperand = getLastOperand(currentOperation);
      //check if last operand has . and prevent from adding it more than once
      if (!lastOperand.includes(".")) {
        currentOperation += btnValue.toString();
      }
      displayResult(currentOperation);
    } else if (btnValue === "negative") {
      lastOperand = getLastOperand(currentOperation);
      //replace the last operand with converted negative operand
      currentOperation =
        currentOperation.substring(
          0,
          currentOperation.lastIndexOf(lastOperand)
        ) + `(-${lastOperand})`;
      displayResult(currentOperation);
    } else if (btnValue === "%") {
      lastOperand = getLastOperand(currentOperation);
      //replace the last operand with operand*0.01
      currentOperation =
        currentOperation.substring(
          0,
          currentOperation.lastIndexOf(lastOperand)
        ) + `${lastOperand * 0.01}`;
      displayResult(currentOperation);
    }
  });

//display passed argument in the #result
function displayResult(value) {
  document.querySelector("#result").textContent = value;
}

//display passed argument in the #operation
function displayPreviousOperation(value) {
  document.querySelector("#operation").textContent = value;
}

function getLastOperand(operation) {
  //split string by anything that is not a digit, . or % and create an array of operands
  const operandsArray = operation.split(/[^0-9.%]+/);
  //return the last operand
  return operandsArray[operandsArray.length - 1];
}

function decimalPlaces(num) {
  //separate integer and decimal parts by .
  const numDigits = num.toString().split(".");
  //return number of decimal places
  return numDigits.length > 0 ? numDigits[1].length : 0;
}

function checkZeroDivision(operation) {
  //regex = any number that is followed by /0
  const regex = /\d+\/0/;
  //check if there is any number/0 in operation
  return regex.test(operation);
}
