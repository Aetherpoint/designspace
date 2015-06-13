// Inspired by http://superpolator.com/ and https://github.com/LettError/mutatorMath
// Thanks to Erik Van Blokland and Nick Sherman.

// By Andrew Johnson (http://www.aetherpoint.com/)

// Might be nifty for some calculations
// var d = require('euclidean-distance');

/* Rounding function */
function roundNum(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

/* Percentage to decimal conversion */
function percentageToDec (percentage) {
	var value = 0;
	value = percentage / 100;
	return value;
}

/* Decimenal to percentage conversion */
function decToPercent (dec) {
	var value = 0;
	value = dec * 100;
	return value;
}

// Parameters: two coordinate points (Arrays), 
// and amount of skew of 0.0 - 1.0 (decimal)
function point(arrays, amount) {
	var dimensions = [];

	var skew = ((Math.max(arrays[0], arrays[1]) - Math.min(arrays[0], arrays[1])) * percentageToDec(amount)) + Math.min(arrays[0], arrays[1]);
	return skew;
}	

// Parameters: set of coordinate points (Arrays),
// and dimension to interpolate across (int)
function calcSpace (coordinates, coordDimension, xSkew, ySkew) {  

	// HORIZONTAL X
	// This should scale to any dimension
	// Interpolate between the set of the first two points
	var betweenTwoX = point(([coordinates[0][coordDimension], coordinates[1][coordDimension]]), xSkew);
	// console.log('First Two: ' + betweenTwo);

	// Interpolate between the set of the second two coordinates
	var betweenTwoOthersX = point(([coordinates[2][coordDimension], coordinates[3][coordDimension]]), xSkew);
	// console.log('Second Two: ' + betweenTwoOthers);

	// Interpolate between both of those set coordinates.
	var sumTotalX = point(([betweenTwoX, betweenTwoOthersX]), ySkew);


	// VERTICAL Y
	// Interpolate between the set of the first two points
	var betweenTwoY = point(([coordinates[0][coordDimension], coordinates[2][coordDimension]]), ySkew);
	// console.log('First Two: ' + betweenTwo);

	// Interpolate between the set of the second two coordinates
	var betweenTwoOthersY = point(([coordinates[1][coordDimension], coordinates[3][coordDimension]]), ySkew);
	// console.log('Second Two: ' + betweenTwoOthers);

	// Interpolate between both of those set coordinates.
	var sumTotalY = point(([betweenTwoY, betweenTwoOthersY]), xSkew);

	// console.log('sumTotalX: ' + sumTotalX);
	// console.log('sumTotalY: ' + sumTotalY);

	var sumTotal = point(([sumTotalY, sumTotalY]), 50);

	// Return those the final interpolated coordinates.
	return sumTotal;
}

// All credit to The Designer