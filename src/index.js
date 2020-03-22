function eval() {
    // Do not use eval!!!
    return;
}

const OPEN_BRACKET = '(';
const CLOSE_BRACKET = ')';
const DIVISION = '/';
const MULTIPLICATION = '*';
const SUBTRACTION = '-';
const ADDITION = '+';

function validateBrackets(expression) {

    let regEx = /[\\(\\)]/g;

    let brackets = expression.match(regEx) || [];
    let openBrackets = [];
    while (brackets.length > 0) {
        let bracket = brackets.shift();
        let isOpenBracket = bracket === OPEN_BRACKET;
        let isCloseBracket = bracket === CLOSE_BRACKET;
        if (isOpenBracket && isCloseBracket) {
            isOpenBracket = openBrackets.indexOf(bracket) < 0;
        }
        if (isOpenBracket) {
            openBrackets.push(bracket);
        } else {

            if (isCloseBracket) {
                let lastOpenBracket = openBrackets.pop();
                if (lastOpenBracket !== OPEN_BRACKET) {
                    return false;
                }
            } else {
                break;
            }
        }
    }
    return brackets.length === 0 && openBrackets.length === 0;
}

function createExpressionTree(expressionItems) {
    let expressionTree = [];
    while (expressionItems.length > 0) {
        let item = expressionItems.shift();
        if (item === CLOSE_BRACKET) {
            break;
        } else if (item === OPEN_BRACKET) {
            expressionTree.push(createExpressionTree(expressionItems));
        } else {
            expressionTree.push(item);
        }
    }
    return createAdditionalGroups(expressionTree);
}

function createAdditionalGroups(expressionGroups) {
    while (expressionGroups.length > 3) {
        let devisionIndex = expressionGroups.indexOf(DIVISION);
        let multiplicationIndex = expressionGroups.indexOf(MULTIPLICATION);
        let index = devisionIndex;
        if ((devisionIndex >= 0) && (multiplicationIndex >= 0)) {
            index = Math.min(devisionIndex, multiplicationIndex);
        } else if (multiplicationIndex >= 0) {
            index = multiplicationIndex;
        }
        if (index >= 0) {
            let newGroup = expressionGroups.splice(index - 1, 3);
            expressionGroups.splice(index - 1, 0, newGroup);
        } else {
            break;
        }
    }
    return expressionGroups;
}

function calculate(expressionTree) {
    if (Array.isArray(expressionTree)) {
        let leftOperand = calculate(expressionTree.shift());
        while (expressionTree.length > 0) {
            let operator = expressionTree.shift();
            let rightOperand = calculate(expressionTree.shift());
            switch (operator) {
                case MULTIPLICATION:
                    leftOperand *= rightOperand;
                    break;
                case SUBTRACTION:
                    leftOperand -= rightOperand;
                    break;
                case DIVISION:
                    if (rightOperand === 0) {
                        throw new Error("TypeError: Division by zero.");
                    }
                    leftOperand /= rightOperand;
                    break;
                case ADDITION:
                    leftOperand += rightOperand;
                    break;
                default:
                    throw new Error(`${operator} is not supported`);
            }
        }
        return leftOperand;
    } else return parseInt(expressionTree);

}

function expressionCalculator(expr) {
    if (!validateBrackets(expr)) {
        throw new Error("ExpressionError: Brackets must be paired");
    }
    let expressionItems = expr.match(/(\d+)|[\\(\\)\\+-\\*\\/]/g);

    let expressionTree = createExpressionTree(expressionItems);
    let result = calculate(expressionTree);
    return Number(result.toFixed(4));
}

module.exports = {
    expressionCalculator
}