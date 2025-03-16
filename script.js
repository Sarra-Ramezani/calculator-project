"use script";

let btnValue = 0; //stores target button value
let currentOperation = ""; //stores the whole operation step by step
let result = 0; // stores the result of current operation
let lastOperand; //stores the last operand if needed
let operationsList = []; //stores previous operations
const history = document.querySelector("#history");
const calculator = document.querySelector(".calculator");
const historyButton = document.querySelector("#history-btn");
const previousOperationsList = document.querySelector("#previous-operations");
const historyButtonIcon = document.querySelector("#history-btn > img");
const clearHistoryBtn = document.querySelector("#clear-history-btn");

historyButton.addEventListener("click", () => {
  console.log(historyButtonIcon);
  if (history.classList.contains("show")) {
    // hide history, show calculator
    history.classList.remove("show");
    calculator.style.opacity = "1";
    historyButtonIcon.classList.remove("rotating-icon");
  } else {
    // show history, hide calculator
    history.style.display = "flex";
    calculator.style.opacity = "0";
    history.classList.add("show");
    historyButtonIcon.classList.add("rotating-icon");
  }

  displayOperationHistory();
  operationsList = [];
});

//clear local storage
clearHistoryBtn.addEventListener("click", () => {
  console.log(localStorage.key);
  localStorage.clear();
  previousOperationsList.innerHTML = "";
});

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
      currentOperation = calculate(currentOperation);
    } else if (btnValue === "clear") {
      currentOperation = clear(currentOperation);
    } else if (btnValue === "clear-all") {
      result = currentOperation = clearAll(currentOperation);
    } else if (btnValue === ".") {
      currentOperation = addDecimalPoint(currentOperation);
    } else if (btnValue === "negative") {
      currentOperation = convertToNegative(currentOperation);
    } else if (btnValue === "%") {
      currentOperation = percentageCalculator(currentOperation);
    }
  });

document.addEventListener("keydown", (event) => {
  const key = event.key;
  console.log(key);
  //check if the target button is operand or basic operators
  if (/[0-9+-/*]/.test(key)) {
    //add target button's value to currentOperation until clicking the equals (=)
    currentOperation += key.toString();
    displayResult(currentOperation);
  } else if (key === "=" || key === "Enter")
    currentOperation = calculate(currentOperation);
  else if (key === "c" || key === "Backspace")
    currentOperation = clear(currentOperation);
  else if (key === ".") currentOperation = addDecimalPoint(currentOperation);
  else if (key === "n") currentOperation = convertToNegative(currentOperation);
  else if (key === "%")
    currentOperation = percentageCalculator(currentOperation);
  else if (key === "Escape") currentOperation = clearAll(currentOperation);
});

function calculate(currentOperation) {
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
    //add current operation to list
    currentOperation += `=${result}`;
    postOperation(currentOperation);

    //to continue the opertaion, we set result to currentOperation
    currentOperation = Number(result);
    displayPreviousOperation(currentOperation);
    displayResult(result);
    return currentOperation;
  }
}

function clear(currentOperation) {
  //remove the last item of currentOperation

  console.log(currentOperation);
  console.log(currentOperation.length);
  currentOperation = String(currentOperation).substring(
    0,
    String(currentOperation).length - 1
  );

  //check if currentOperation is empty, show 0 as result
  currentOperation.length === 0
    ? displayResult(0)
    : displayResult(currentOperation);
  return currentOperation;
}

function clearAll(currentOperation) {
  //reset currentOperation and result
  currentOperation = result = "";
  displayPreviousOperation(0);
  displayResult(0);
  return currentOperation;
}
//display passed argument in the #result
function displayResult(value) {
  document.querySelector("#result").textContent = value;
}

function addDecimalPoint(currentOperation) {
  lastOperand = getLastOperand(currentOperation);
  //check if last operand has . and prevent from adding it more than once
  if (!lastOperand.includes(".")) {
    currentOperation += ".";
  }
  displayResult(currentOperation);
  return currentOperation;
}

function convertToNegative(currentOperation) {
  lastOperand = String(getLastOperand(currentOperation));
  //replace the last operand with converted negative operand
  currentOperation =
    String(currentOperation).substring(
      0,
      String(currentOperation).length - lastOperand.length
    ) + `-(${lastOperand})`;

  displayResult(currentOperation);
  return currentOperation;
}

function percentageCalculator(currentOperation) {
  lastOperand = String(getLastOperand(currentOperation));
  //replace the last operand with operand * 0.01
  currentOperation =
    String(currentOperation).substring(
      0,
      String(currentOperation).length - lastOperand.length
    ) + `${lastOperand * 0.01}`;

  displayResult(currentOperation);
  return currentOperation;
}

//display passed argument in the #operation
function displayPreviousOperation(value) {
  document.querySelector("#operation").textContent = value;
}

function getLastOperand(operation) {
  const regex = /[^0-9.%]+/;
  if (regex.test(operation)) {
    //split string by anything that is not a digit, . or % and create an array of operands
    const operandsArray = operation.split(regex);
    //return the last operand
    return operandsArray[operandsArray.length - 1];
  } else {
    return operation;
  }
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

//get the whole operation each time and store it in a list and display the list
function postOperation(operation) {
  const data = {
    expression: operation,
  };

  fetch(
    "https://tt0-sincere-einstein.circumeo-apps.net/api/save-calculation/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayOperationHistory() {
  let data = "";
  fetch("https://tt0-sincere-einstein.circumeo-apps.net/api/history/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  previousOperationsList.innerHTML = "";
  list = JSON.parse(data) || [];
  list.forEach((element) => {
    previousOperationsList.innerHTML += `${element} <br>`;
  });
}
