// Inspired by http://superpolator.com/ and https://github.com/LettError/mutatorMath
// Thanks to Erik Van Blokland and Nick Sherman.

// By Andrew Johnson (http://www.aetherpoint.com/)

var elmids = ['space'];

var x, y = 0;
var xSkew = 0;
var ySkew = 0;

// Bars for the coordinates
var xbar = document.getElementById('xbar');
var ybar = document.getElementById('ybar');

var exportedMarkup = document.getElementById("exportedMarkup"); // Input to dumb interpolated markup into
var resultSVG = document.getElementById("resultSVGMarkup"); 

// Remove function
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Get X and Y position of the elm (from: vishalsays.wordpress.com)
function getXYpos(elm) {
  x = elm.offsetLeft;
  y = elm.offsetTop;

  elm = elm.offsetParent;

  while(elm != null) {
    x = parseInt(x) + parseInt(elm.offsetLeft);
    y = parseInt(y) + parseInt(elm.offsetTop);
    elm = elm.offsetParent;
  }

  // Returns an object with "xp" (Left), "=yp" (Top) position
  return {'xp':x, 'yp':y};
}

function roundNum(value, decimals) {
    return Number(Math.round(value+'e'+0)+'e-'+0);
}

// Convert mouse position into percentage percents towards a certain master
function getPercents(xCoord, yCoord) {
	xSkew = (x / document.getElementById(elmids).offsetWidth) * 100;
	ySkew = (y / document.getElementById(elmids).offsetHeight) * 100;

  updateBars(roundNum(xSkew, 0), roundNum(ySkew, 0));
	document.getElementById('percents').innerHTML = 'Percents: X='+ roundNum(xSkew, 0)+', Y=' + roundNum(ySkew, 0);
}

// Update the bar positions
function updateBars(xCoord, yCoord) {
  xbar.style.top = yCoord + '%';
  ybar.style.left = xCoord + '%';
}

// Get X, Y coords, and display Mouse coordinates
function getCoords(e) {
  var xy_pos = getXYpos(this);

	x = e.pageX;
	y = e.pageY;

  x = x - xy_pos['xp'];
  y = y - xy_pos['yp'];

  getPercents(x, y);

  // Update the SVG whenever the mouse position changes in our design space
  setSVG(document.getElementById('result-svg'));
}	

var instancePointCount = 0; // Keeps track of what instance goes to what point
// List of repeating colors for the instances
var colorList = ['#8BCACC', '#A93F46', '#E39B53', '#9F58A3', '#94CA63', '#DD5757', '#579F7C', '#C97CB3'];

// Add an instance
function setInstance(e) {
  var xy_pos = getXYpos(this);

  x = e.pageX;
  y = e.pageY;

  x = x - xy_pos['xp'];
  y = y - xy_pos['yp'];

  var div = document.createElement('div');
  div.className = 'instance ' + instancePointCount;
  div.id = 'instanceId' + instancePointCount;
  div.style.backgroundColor = (colorList[(instancePointCount % 8)]);
  
  document.getElementById('instances').appendChild(div);

  // Set the points
  var instancePoint = document.createElement('div');

  instancePoint.className = 'instancePoint';
  instancePoint.id = 'instanceIdPoint' + instancePointCount;
  instancePoint.style.top = y + 'px';
  instancePoint.style.left = x + 'px';
  instancePoint.style.borderColor = (colorList[(instancePointCount % 8)]);

  document.getElementById('space').appendChild(instancePoint);
  div.innerHTML = '<div><div class="instanceNumber"></div><div onclick="removeInstance(this), removeInstancePoint(this)" id="close">×</div></div>';


  // Set save the instances exported SVG
  var instanceSVG = document.createElement('div');
  instanceSVG.className = 'instanceSVG';
  instanceSVG.id = 'instanceSVG' + instancePointCount;

  instanceSVG.innerHTML = saveSVG(document.getElementById('result-svg'));

  document.getElementById('instanceId' + instancePointCount).children[0].children[0].appendChild(instanceSVG);

  // TODO: Export SVG markup for each instance so users can save an instance
  // var s = new XMLSerializer();
  // var d = document.getElementById('result-svg').getAttribute('polygon');
  // var str = s.serializeToString(d);
  // alert(str);

  // var resultSVG = document.getElementById('result-svg').view;
  // var svgDoc = resultSVG.contentDocument;
  // var polygon = svgDoc.polygon;

  var instanceCode = document.createElement('div');
  instanceCode.className = 'instanceCode';
  instanceCode.id = 'instanceCode' + instancePointCount;
  instanceCode.innerHTML = '<div contenteditable="true">' + roundNum(xSkew, 0) + ", " + roundNum(ySkew, 0);  + '</div>';

  document.getElementById('instanceId' + instancePointCount).children[0].children[0].appendChild(instanceCode);

  instancePointCount++;
}

function removeInstance(input) {
    document.getElementById('instances').removeChild( input.parentNode.parentNode );
    instancePointCount--;
}

function removeInstancePoint(input, count) {
    var id = input.parentNode.parentNode.className.split(' ')[1].toString();

    instancePointCount++;
    // console.log(instancePointCount);

    var el = document.getElementById('instanceIdPoint' + (id));
    el.remove();
}

// Register onmousemove, and onclick the each element with ID stored in elmids
for(var i=0; i<elmids.length; i++) {
  if(document.getElementById(elmids[i])) {
    document.getElementById(elmids[i]).onmousemove = getCoords;
    document.getElementById(elmids[i]).onclick = getCoords;

    document.getElementById(elmids[i]).onclick = setInstance;
  }
}

// Take an SVG's innerHTML (with a polygon) and return just the floating point numbers.
function formatToSVG (element, generatedArray) {

  var list = ''; // A string value to shove our array into.
  var newSVG = ''; // New SVG to embed

  // Format our array to fit into SVG markup
  for (var i = 0; i < generatedArray.length; i++) {
    list += generatedArray[i] + ' ';
  }

  newSVG = '<polygon fill="#000" points="' + list + '"></polygon>';

  return newSVG;
}

// Grab the points of the SVG from specified index
function getSVG(element, pointNum, svgElementNumber) {
  var coordinatePoints = [];
  var coordinatePointsSecondContour = [];

  try {
    coordinatePoints = [element.children[svgElementNumber].animatedPoints[pointNum].x, element.children[svgElementNumber].animatedPoints[pointNum].y];
    // TODO: Impement multiple contours 
    // coordinatePointsSecondContour = [element.children[svgElementNumber].animatedPoints[pointNum].x, element.children[svgElementNumber].animatedPoints[pointNum].y];
  }
  catch (err) {
    document.getElementById("status").innerHTML = "Please enter <a href='https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Getting_Started' target='0'>valid SVG</a> points.";
  }

	return coordinatePoints;
}

// Take the calculate all existing points based off of mouse position
// Parameters: A generated array based off existing SVG elements
function updateAllPoints(generatedArray) {
  var updatedArray = [];
  var masterArray = [];
  var svgElementNumber = 0;

  for (var i = 0; i < generatedArray.length; i++) {
    masterArray = [[roundNum(getSVG(document.getElementById("master_1"), i, svgElementNumber)[0], 0), 
                    roundNum(getSVG(document.getElementById("master_1"), i, svgElementNumber)[1], 0)], 
                    [roundNum(getSVG(document.getElementById("master_2"), i, svgElementNumber)[0], 0), 
                    roundNum(getSVG(document.getElementById("master_2"), i, svgElementNumber)[1], 0)], 
                    [roundNum(getSVG(document.getElementById("master_3"), i, svgElementNumber)[0], 0), 
                    roundNum(getSVG(document.getElementById("master_3"), i, svgElementNumber)[1], 0)], 
                    [roundNum(getSVG(document.getElementById("master_4"), i, svgElementNumber)[0], 0), 
                    roundNum(getSVG(document.getElementById("master_4"), i, svgElementNumber)[1], 0)]];


    // Push an array for each calculation for the X and Y coordinates
    updatedArray.push([roundNum(calcSpace(masterArray, 0, xSkew, ySkew), 0), roundNum(calcSpace(masterArray, 1, xSkew, ySkew), 0)]);
  }

  // console.log(masterArray);
  return updatedArray;
}

// Updates the entire SVG
function setSVG(element) {
  var list;
  var svgElementNumber = 0; // If we have multiple polygons in the SVG, selects them in order
  var pointAmount = (element.children[svgElementNumber].animatedPoints).length;
  var generatedArray = [];

  // Take each set of points from the element argument and add it to an array.
  for (var i = 0; i < pointAmount; i++) {
    generatedArray.push([element.children[svgElementNumber].animatedPoints[i].x, element.children[svgElementNumber].animatedPoints[i].y]);
  }

  // SVG nodes are read only, so we have to update the SVG via innerHTML
  element.innerHTML = formatToSVG(element, updateAllPoints(generatedArray));
}

// Currently accepts SVGs with two decimal places
function saveSVG(element) {
  var list;
  var svgElementNumber = 0; // If we have multiple polygons in the SVG, selects them in order
  var pointAmount = (element.children[svgElementNumber].animatedPoints).length;
  var generatedArray = [];

  // // Take each set of points from the element argument and add it to an array.
  // for (var i = 0; i < pointAmount; i++) {
  //   generatedArray.push([roundNum(element.children[svgElementNumber].animatedPoints[i].x, 0), roundNum(element.children[svgElementNumber].animatedPoints[i].y, 0)]);
  // }

  //console.log(resultSVG.children[0].innerHTML);

  return resultSVG.innerHTML;
}

// Add the interpolated result to the page
setSVG(document.getElementById('result-svg'));

// Load our SVG
function setMasters() {
  // Update each one of the inputs
  document.getElementById('master_1').innerHTML = document.getElementById('masterInput1').getAttribute('value');
  document.getElementById('master_2').innerHTML = document.getElementById('masterInput2').getAttribute('value');
  document.getElementById('master_3').innerHTML = document.getElementById('masterInput3').getAttribute('value');
  document.getElementById('master_4').innerHTML = document.getElementById('masterInput4').getAttribute('value');

  // Update the result
  setSVG(document.getElementById('result-svg'));
}

// TODO: Fix interpolation so user can make live updates.
function updateInput(e, modifications){
    document.getElementById(e).setAttribute('value', modifications);
    setMasters();
}

// TODO: Drag and drop functionality
// function handleFileSelect(evt) {
//     evt.stopPropagation();
//     evt.preventDefault();

//     var files = evt.dataTransfer.files; // FileList object.

//     // files is a FileList of File objects. List some properties.
//     var output = [];
//     for (var i = 0, f; f = files[i]; i++) {
//       output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
//                   f.size, ' bytes, last modified: ',
//                   f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
//                   '</li>');
//     }
//     console.log( output.join(''));
//   }

//   function handleDragOver(evt) {
//     evt.stopPropagation();
//     evt.preventDefault();
//     evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
//   }

//   // Setup the dnd listeners.
//   var dropZone = document.getElementById('masterInput2');
//   dropZone.addEventListener('dragover', handleDragOver, false);
//   dropZone.addEventListener('drop', handleFileSelect, false);

// document.getElementById('masterInput1').addEventListener('change', handleFileSelect, false);
// document.getElementById('masterInput2').addEventListener('change', handleFileSelect, false);
// document.getElementById('masterInput3').addEventListener('change', handleFileSelect, false);
// document.getElementById('masterInput4').addEventListener('change', handleFileSelect, false);



// All credit to The Designer
