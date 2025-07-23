document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let displayValue = '0';

    function updateDisplay() {
        display.textContent = displayValue;
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand === true) {
            currentInput = digit;
            displayValue = (firstOperand !== null ? firstOperand : '') + (operator !== null ? ' ' + operator + ' ' : '') + currentInput;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
            if (operator === null) {
                displayValue = currentInput;
            } else {
                displayValue = (firstOperand !== null ? firstOperand : '') + ' ' + operator + ' ' + currentInput;
            }
        }
        updateDisplay();
    }

    function inputDecimal(dot) {
        if (waitingForSecondOperand === true) {
            currentInput = '0.';
            displayValue = (firstOperand !== null ? firstOperand : '') + (operator !== null ? ' ' + operator + ' ' : '') + currentInput;
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes(dot)) {
            currentInput += dot;
            if (operator === null) {
                displayValue = currentInput;
            } else {
                displayValue = (firstOperand !== null ? firstOperand : '') + ' ' + operator + ' ' + currentInput;
            }
            updateDisplay();
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);
        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            displayValue = firstOperand + ' ' + operator + ' ';
            updateDisplay();
            return;
        }
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            if (result === 'Error') {
                displayValue = 'Error';
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                currentInput = '0';
                updateDisplay();
                return;
            }
            currentInput = String(result);
            firstOperand = result;
        }
        waitingForSecondOperand = true;
        operator = nextOperator;
        displayValue = (firstOperand !== null ? firstOperand : '') + ' ' + operator + ' ';
        updateDisplay();
    }

    const performCalculation = {
        '/': (firstOperand, secondOperand) => secondOperand === 0 ? 'Error' : firstOperand / secondOperand,
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    };

    function resetCalculator() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        displayValue = '0';
        updateDisplay();
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { target } = event;
            if (target.classList.contains('number')) {
                inputDigit(target.dataset.number);
                return;
            }
            if (target.classList.contains('decimal')) {
                inputDecimal(target.dataset.number);
                return;
            }
            if (target.classList.contains('operator')) {
                handleOperator(target.dataset.operator);
                return;
            }
            if (target.classList.contains('clear')) {
                resetCalculator();
                return;
            }
            if (target.classList.contains('equals')) {
                if (operator && firstOperand !== null) {
                    const inputValue = parseFloat(currentInput);
                    const result = performCalculation[operator](firstOperand, inputValue);
                    if (result === 'Error') {
                        displayValue = 'Error';
                        firstOperand = null;
                        operator = null;
                        waitingForSecondOperand = false;
                        currentInput = '0';
                        updateDisplay();
                        return;
                    }
                    currentInput = String(result);
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                    displayValue = currentInput;
                    updateDisplay();
                }
                return;
            }
        });
    });

    updateDisplay();
});
