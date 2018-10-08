const symbols = {
    currency: "$",
    percent: "%"
}

const marginFromCostAndPrice = (cost, price) => {
    return (Math.abs(price) <= 0.0001 ? 0 : (1 - (cost / price)) * 100);
}

const priceFromCostAndMargin = (cost, margin) => {
    return Math.round((cost / (1 - (margin / 100))) * 100) / 100;
}

const round = (number, decimalPlaces) => {
    if (isNaN(number)) {
        throw new TypeError(number + " is not a number!");
    }
    if (decimalPlaces == undefined || isNaN(decimalPlaces)) {
        decimalPlaces = 2;
    }
    var power = Math.pow(10, decimalPlaces);
    return Math.round(number * power) / power;
}

const formatNumber = (number, decimalPlaces) => {
    number = round(number, decimalPlaces).toFixed(decimalPlaces);
    var isNegative = number < 0;
    var numberSplit = number.toString().split('.');
    var wholePart = numberSplit[0].replace("-", "");
    var decimalPart = numberSplit[1];
    var formattedWhole = "";
    var position = 0;
    for (var i = wholePart.length - 1; i >= 0; i--) {
        formattedWhole += wholePart.charAt(position);
        if (i % 3 === 0 && i != 0) {
            formattedWhole += ",";
        }
        position++;
    }
    formattedWhole += (decimalPlaces === 0 ? "" : "." + decimalPart);
    return isNegative ? "-" + formattedWhole : formattedWhole;
}

const formatCurrency = (number) => {
    return formatCurrencyWithDecimals(number, 2);
}

const formatCurrencyOrDefault = (number, defaultValue) => {
    return number == undefined ? defaultValue : formatCurrency(number);
}

const formatCurrencyWithDecimals = (number, decimals) => {
    return symbols.currency + formatNumber(number, decimals);
}

const formatPercentage = (number:number, decimals?:number) => {
    return formatNumber(number, decimals || 2) + symbols.percent;
}

const formatPercentageOrDefault = (number, defaultValue, decimals) => {
    return number == undefined ? defaultValue : formatPercentage(number, decimals);
}

export {
    marginFromCostAndPrice,
    priceFromCostAndMargin,
    round,
    formatNumber,
    formatCurrency,
    formatCurrencyOrDefault,
    formatCurrencyWithDecimals,
    formatPercentage,
    formatPercentageOrDefault,
}
