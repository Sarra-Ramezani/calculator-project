"use script";

let btnValue = 0; //stores target button value
let currentOperation = ""; //stores the whole operation step by step
let result = 0; // stores the result of current operation
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
      displayPreviousOperation(currentOperation);
      //convert the currentOperation to mathematical operation then store the result
      result = new Function(`return ${currentOperation}`)();
      //to continue the opertaion, we set result to currentOperation
      currentOperation = result;
      displayResult(result);
    } else if (btnValue === "clear") {
      //remove the last item of currentOperation
      currentOperation = currentOperation.slice(0, -1);
      displayResult(currentOperation);
    } else if (btnValue === "clear-all") {
      //reset currentOperation and result
      currentOperation = "";
      result = "";
      displayPreviousOperation(0);
      displayResult(0);
    } else if (btnValue === ".") {
      //check if last operand has . and prevent from adding it more than once
      if (!getLastOperand(currentOperation).includes(".")) {
        currentOperation += btnValue.toString();
      }
      displayResult(currentOperation);
    } else if (btnValue === "negative") {
      //replace the last operand with converted negative operand
      currentOperation = currentOperation.replace(
        `${getLastOperand(currentOperation)}`,
        `(-${getLastOperand(currentOperation)})`
      );
      displayResult(currentOperation);
    } else if (btnValue === "%") {
      //replace the last operand with operand*0.01
      currentOperation = currentOperation.replace(
        `${getLastOperand(currentOperation)}`,
        `${getLastOperand(currentOperation) * 0.01}`
      );
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
