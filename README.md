# Interpolation
[Live font interpolation](http://alistapart.com/article/live-font-interpolation-on-the-web) is just another method to try and gain a more systemized control over type in the huge amounts of contexts it can live. It can be quite complex (multi-dimensional, multiple contours/overlapping paths, etc – ask Erik Van Blokland) but also has a lot of potential. 

SVGs are a great way to experiment with shapes and points but are ultimately limited by the fact they weren't originally designed to work as fonts (which already have heavily optimized file formats). Ideally, we'll move towards a [variable font](http://alistapart.com/blog/post/variable-fonts-for-responsive-design) format that's at home on the web without compromising on power.

Designspace is just some code for interpolating SVGs. It's currently split into two main files. 

### designspace.js
Handles the math for interpolation – currently set at four masters for simple polygons – and cannot scale its dimensionality. Also holds utility stuff like rounding and decimal/percentage converters.

### interpolation-ui.js
Provides functionality for the interface, including setting and getting SVG points, calculating inputs that feed into  interpolation and making general updates.

You can see an example of it in use [here](http://aetherpoint.com/lab/designspace/).
