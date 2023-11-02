
var IRIS_COLOR			=	"rgba(200,80,0,255)",
	IRIS_RADIUS_COLOR	=	"rgba(255,255,255,255)"
	IRIS_RADIUS_FILL	=	"rgba(255,255,255,0.1)"
	GAZE_COLOR		=	"rgba(240,96,0,255)",
	BLACK_COLOR		=	"#000000",
	POINTS_COLOR		=	"rgba(0,255,255,255)",
	SPLINES_COLOR		=	"rgba(176,196,222,160)",
	X_AXIS_COLOR		=	"rgba(255,0,0,0.2)",
	Y_AXIS_COLOR		=	"rgba(0,0,255,0.2)",
	Z_AXIS_COLOR		=	"rgba(0,255,0,0.2)",
	EMOTION_BLUE		=	"rgba(0,0,255,1)",
	MALE_GENDER		=	"rgba(0,0,255,0.8)",
	FEMALE_GENDER		=	"rgba(255,0,0,0.8)",
	GRAY_COLOR		=	"rgba(128,128,128,1)",
	GREEN_COLOR		=	"rgba(0,255,0,1)";
	
var CHIN_POINTS	= "#8080FF",
	INNER_LIP_POINTS	=	"#EC0000",
	OUTER_LIP_POINTS	=	"#EC0000",
	NOSE_COLOR		=	"#646464",
	IRIS_COLOR		=	"#FFFF64",
	EYES_COLOR		=	"#FF8F20",
	EYES_COLOR_CLOSED	=	"#FF0000",
	CHEEKS_COLOR		=	"#646464",
	EYEBROWS_COLOR		= 	"#E3FE49",
	HAIR_COLOR		= 	"#646464",
	GAZE_COLOR		=	"#00FF00";
	
var CALIB_COLOR = "#EC0000",
	ESTIM_COLOR = "#23238E";
	
	
var styles = {'LINE' : 0, 'LINELOOP' : 1, 'POINT' : 2, 'SPLINE' : 3}

var splineResolution = 5;

/*
* Draw spline
*/
function drawSpline2D(points, color, resolution)
{
	var oldWidth = canCon.lineWidth;
	var step = 1 / resolution;

	canCon.beginPath();
	canCon.strokeStyle = color;
	canCon.lineWidth = 0.05;
	canCon.moveTo(points[0], points[1]);

	var newPoints = [];

	for (var i = 0; i < resolution; i++)
	{
		var t = step * i;
		var B0 = Math.pow((1-t), 3)
		var B1 = 3 * t * Math.pow((1-t), 2);
		var B2 = 3 * Math.pow(t, 2) * (1-t)
		var B3 = Math.pow(t, 3);

		var px = (B0 * points[0]) + (B1 * points[2]) + (B2 * points[4]) + (B3 * points[6]);
		var py = (B0 * points[1]) + (B1 * points[3]) + (B2 * points[5]) + (B3 * points[7]);

		newPoints.push([px, py]);
	}

	newPoints.push([points[6], points[7]]);

	for (var i = 1; i < newPoints.length; i++)
	{
		canCon.lineTo(newPoints[i][0], newPoints[i][1]);
		canCon.stroke();
	}

	canCon.closePath();
	canCon.lineWidth = oldWidth;
}

/*
* Draw lines using canvas draw methods
*/
function drawPoints2D(points, pointsNum, style, featurePoints2D, color, radius, drawQuality, useAlpha=false)
{
	if (typeof drawQuality === 'undefined') drawQuality = false;

	V = [];

	canCon.beginPath();
	canCon.closePath();
	
	var n = 0;
	for (var i = 0; i < pointsNum*2; i+=2){
		if (featurePoints2D.FPIsDefined(points[i],points[i+1]) === true){
			var x = featurePoints2D.getFPPos(points[i],points[i+1])[0]*canvas.width;
			var y = (1 - featurePoints2D.getFPPos(points[i],points[i+1])[1])*canvas.height;

			var quality = featurePoints2D.getFPQuality(points[i],points[i+1]);

			if (style === styles.SPLINE)
				createKnot(x,y);
			else
			{
				if (style === styles.POINT){

					if(drawQuality && quality >= 0)
					{
						alphaChannel = useAlpha ? Math.max(quality, 0.3) : 1.0;
						colorCircle = `rgba(0,0,0,${alphaChannel.toFixed(2)})`;
					}
					else
					{
						colorCircle = `rgba(0,0,0,1.0)`;
					}
					canCon.beginPath();

					canCon.fillStyle = colorCircle;
					canCon.arc(x,y,radius,0,2*Math.PI,true);
					canCon.closePath();
					canCon.fill();
					//
					colorPoint = color;
					if (drawQuality && quality >= 0)
					{
						alphaChannel = useAlpha ? Math.max(quality, 0.5) : 1.0;
						colorPoint = `rgba(${(255 - quality*255).toFixed(0)},${(quality*255).toFixed(0)},0,${alphaChannel.toFixed(2)})`;
					}
					canCon.beginPath();
					canCon.fillStyle = colorPoint;
					canCon.arc(x,y,radius*0.6,0,2*Math.PI,true);
					canCon.closePath();
					canCon.fill();
				}
				if (style === styles.LINE){
					if (n%2 === 0){
						canCon.beginPath();
						canCon.moveTo(x,y);
					}
					else {
						canCon.lineTo(x,y);
						canCon.strokeStyle = color;
						canCon.stroke();
						canCon.closePath();
					}
				}
				if (style === styles.LINELOOP){
					if (n==0){
						canCon.beginPath();
						canCon.moveTo(x,y);
					}
					else{
						canCon.lineTo(x,y);
						canCon.strokeStyle = color;
						canCon.stroke();
						canCon.closePath();
						canCon.beginPath();
						canCon.moveTo(x,y);
					}
				}
			}
			
			n++;
		}
	}

	if (style === styles.SPLINE)
	{
		updateSplines();

		colorSpline = color;
		if(drawQuality && quality >= 0)
		{
			alphaChannel = useAlpha ? Math.max(quality*0.62, 0.2) : 0.62;
			colorSpline = `rgba(176,196,222,${alphaChannel.toFixed(2)})`;
		}

		for (var m = 0; m < S.length;m++)
		{
			for (var l = 0; l < S[m].length; l += 2)
			{
				drawSpline2D(S[m], colorSpline, splineResolution);
			}
		}
	}
	
	
			
	if (style == styles.LINELOOP){
		var x = featurePoints2D.getFPPos(points[0],points[1])[0]*canvas.width;
		var y = (1 - featurePoints2D.getFPPos(points[0],points[1])[1])*canvas.height;
		canCon.lineTo(x,y);
		canCon.strokeStyle = color;
		canCon.stroke();
		canCon.closePath();
	}
}

/*
* Draw irises 
*/
function drawIrises(faceData, width, height)
{
    var irisRadius = faceData.getIrisRadius();
    
    if (irisRadius[0] > 0 || irisRadius[1] > 0)
    {
        var featurePoints2D = faceData.getFeaturePoints2D();
        
        var fpGroup = 3;
        var fpIndex = [5,6];
        
        for (var irisIndex = 0; irisIndex < 2; irisIndex+=1)
        {
            if (irisRadius[irisIndex] > 0)
            {
                if (featurePoints2D.FPIsDefined(fpGroup,fpIndex[irisIndex]))
                {
                    var x = featurePoints2D.getFPPos(fpGroup,fpIndex[irisIndex])[0]*width;
                    var y = (1 - featurePoints2D.getFPPos(fpGroup,fpIndex[irisIndex])[1])*height;
                    //
                    canCon.beginPath();
                    canCon.strokeStyle = IRIS_RADIUS_COLOR;
                    canCon.lineWidth = 1;
                    canCon.fillStyle = IRIS_RADIUS_FILL;
                    canCon.arc(x,y,irisRadius[irisIndex],0,2*Math.PI,true);
                    canCon.closePath();
                    canCon.stroke();
                    canCon.fill();
                }
            }
        }
    }
}

/**
* Draw facial features
* <br/><br/>
* @param {FaceDataVector} faceData - Array of {@link FaceData|FaceData} objects containing the tracking results
* @param {bool} drawQuality 
* Extracts location of feature points from faceData. Calls drawPoints2D() function for drawing feature points and lines between points on canvas.
*/
function drawFaceFeatures(faceData, drawQuality)
{
	if (typeof drawQuality === 'undefined') drawQuality = false;

	var radius = (faceData.faceScale / mWidth) * 10;
	
	var chinPoints = [
		2,	1,
	]

	drawPoints2D(chinPoints, 1, styles.POINT,  faceData.getFeaturePoints2D(),POINTS_COLOR, radius, drawQuality);

	
	var innerLipPoints = [
		2,	2,
		2,	6,
		2,	4,
		2,	8,
		2,	3,
		2,	9,
		2,	5,
		2,	7,
	]

	var upperInnerLipPoints = [
		2,	5,
		2,	7,
		2,	2,
		2,	6,
		2,	4,
	]

	var lowerInnerLipPoints = [
		2,	5,
		2,	9,
		2,	3,
		2,	8,
		2,	4,
	]

	drawPoints2D(upperInnerLipPoints, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(lowerInnerLipPoints, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(innerLipPoints, 8, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality);

	var outerLipPoints = [
		8,	1,
		8,	10,
		8,	5,
		8,	3,
		8,	7,
		8,	2,
		8,	8,
		8,	4,
		8,	6,
		8,	9,
	]

	var upperOuterLipPointsLeft = [
		8,	4,
		8,	6,
		8,	9,
		8,	1,
	]

	var upperOuterLipPointsRight = [
		8,	1,
		8,	10,
		8,	5,
		8,	3,
	]

	var lowerOuterLipPoints = [
		8,	4,
		8,	8,
		8,	2,
		8,	7,
		8,	3,
	]

	drawPoints2D(upperOuterLipPointsLeft, 4, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(upperOuterLipPointsRight, 4, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(lowerOuterLipPoints, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(outerLipPoints, 10, styles.POINT,faceData.getFeaturePoints2D(),POINTS_COLOR, radius, drawQuality);

	var nosePoints = [
		9,	5,
		9,	4,
		9,	3,
		9,	15,
		14, 22,
		14, 23,
		14, 24,
		14, 25
	]
	var noseLinesPoints = [
		9,	5,
		9,	3,
		9,	4
	]
	var noseLinesPoints2 = [
		9,	3,
		14,	22,
		14, 23,
		14, 24,
		14, 25
	]

	drawPoints2D(nosePoints, 8, styles.POINT,faceData.getFeaturePoints2D(),POINTS_COLOR,radius, drawQuality);
	drawPoints2D(noseLinesPoints, 3, styles.SPLINE,faceData.getFeaturePoints2D(),SPLINES_COLOR);
	drawPoints2D(noseLinesPoints2, 5, styles.SPLINE,faceData.getFeaturePoints2D(),SPLINES_COLOR);

	if(faceData.getEyeClosure()[0])
	{
		//if eye is open, draw the iris
		var irisPoints = [
			3,	6,
		]
		drawPoints2D(irisPoints, 1,styles.POINT, faceData.getFeaturePoints2D(),IRIS_COLOR,radius);
	}
	
	if(faceData.getEyeClosure()[1])
	{
		//if eye is open, draw the iris
		var irisPoints = [
			3,	5,
		]
		drawPoints2D(irisPoints, 1,styles.POINT, faceData.getFeaturePoints2D(),IRIS_COLOR,radius);
	}

	var eyesPointsR = [
		3,	2,
		3,	4,
		3,	8,
		3,	10,
		3,	12,
		3,	14,
		12, 6,
		12, 8,
		12, 10,
		12, 12,
	]
	var eyesPointsL = [
		3,	1,
		3,	3,
		3,	7,
		3,	9,
		3,	11,
		3,	13,
		12, 5,
		12, 7,
		12, 9,
		12, 11,
	]
	var rightEyeOuterUpper = [
		3,	12,
		3,	14,
		3,	8,
	]
	var rightEyeOuterLower = [
		3,	12,
		3,	10,
		3,	8,
	]
	var rightEyeInnerUpper = [
		3,	12,
		12, 10,
		3,	2,
		12, 6,
		3,	8,
	]
	var rightEyeInnerLower = [
		3,	12,
		12, 12,
		3,	4,
		12,	8,
		3,	8,
	]

	var leftEyeOuterUpper = [
		3,	11,
		3,	13,
		3,	7,
	]
	var leftEyeOuterLower = [
		3,	11,
		3,	9,
		3,	7,
	]
	var leftEyeInnerUpper = [
		3,	11,
		12, 9,
		3,	1,
		12, 5,
		3,	7,
	]
	var leftEyeInnerLower = [
		3,	11,
		12, 11,
		3,	3,
		12,	7,
		3,	7,
	]

	//draw points for right eye
	if(faceData.getEyeClosure()[1])
	{
		drawPoints2D(eyesPointsR, 10, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality);
	}
	else if (!faceData.getEyeClosure()[1])
	{
		drawPoints2D(eyesPointsR, 10, styles.POINT, faceData.getFeaturePoints2D(), BLACK_COLOR, radius);
	}

	//draw points for left eye
	if(faceData.getEyeClosure()[0])
	{
		drawPoints2D(eyesPointsL, 10, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality);
	}
	else if (!faceData.getEyeClosure()[0])
	{
		drawPoints2D(eyesPointsL, 10, styles.POINT, faceData.getFeaturePoints2D(), BLACK_COLOR, radius);
	}

	//draw lines for both eyes
	drawPoints2D(rightEyeOuterUpper, 3, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(rightEyeOuterLower, 3, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(rightEyeInnerUpper, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(rightEyeInnerLower, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	//
	drawPoints2D(leftEyeOuterUpper, 3, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(leftEyeOuterLower, 3, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(leftEyeInnerUpper, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(leftEyeInnerLower, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);

	//draw eyebrows
	var eyebrowPoints = [
		4,	1,
		4,	2,
		4,	3,
		4,	4,
		4,	5,
		4,	6,
		14, 1,
		14, 2,
		14, 3,
		14, 4,
	]
	var leftEyebrow = [
		4,	6,
		14, 4,
		4,	4,
		14, 2,
		4,	2,
	]
	var rightEyebrow = [
		4,	1,
		14, 1,
		4,	3,
		14, 3,
		4,	5,
	]

	drawPoints2D(leftEyebrow, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(rightEyebrow, 5, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(eyebrowPoints, 10, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality);

	var leftEar = [
		10, 11,
		10, 1,
		10, 13,
		10, 3,
		10, 15,
		10, 5,
		10, 19,
	]
	var rightEar = [
		10, 12,
		10, 2,
		10, 14,
		10, 4,
		10, 16,
		10, 6,
		10, 20
	]
	var earPoints = [
		10, 1,
		10, 2,
		10, 3,
		10, 4,
		10, 5,
		10, 6,
		10, 7,
		10, 8,
		10, 9,
		10, 10,
		10, 11,
		10, 12,
		10, 13,
		10, 14,
		10, 15,
		10, 16,
		10, 17,
		10, 18,
		10, 19,
		10, 20,
		10, 21,
		10, 22,
		10, 23,
		10, 24,
	]

	drawPoints2D(leftEar, 7, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(rightEar, 7, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR);
	drawPoints2D(earPoints, 24, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality);

	// visible contour
	var contourPointsPhysical = [
		15,	1,
		15,	3,
		15,	5,
		15,	7,
		15,	9,
		15,	11,
		15,	13,
		15,	15,
		15,	17,
		15,	16,
		15,	14,
		15,	12,
		15,	10,
		15,	8,
		15,	6,
		15,	4,
		15,	2
	]
	
	drawPoints2D(contourPointsPhysical, 17, styles.SPLINE, faceData.getFeaturePoints2D(), SPLINES_COLOR, true);
	drawPoints2D(contourPointsPhysical, 17, styles.POINT, faceData.getFeaturePoints2D(), POINTS_COLOR, radius, drawQuality, true);
}

/**
* Draw tracking quality bar on canvas
* <br/><br/>
* @param {float} quality - Estimated tracking quality level for the current frame. The value is between 0 and 1. 
*/
function drawTrackingQualityBar(quality)
{
	canCon.translate(mWidth, 0);
	canCon.scale(-1, 1);

	var barHeight = 20;
	var barWidth = 100;
	var barPosX = mWidth*0.1;
	var barPosY = mHeight*0.9;
	var barColor = "rgba("+ (255 - quality*255).toFixed(0) + "," + (quality*255).toFixed(0) + ",0,1.0)";

	var barColor 
	//background rectangle
	canCon.beginPath();
	canCon.rect(barPosX, barPosY, barWidth, barHeight);
	canCon.fillStyle = GRAY_COLOR;
	canCon.closePath();
	canCon.fill();
	//green rectangle
	barWidth = quality * 100;
	canCon.beginPath();
	canCon.rect(barPosX, barPosY, barWidth, barHeight);
	canCon.fillStyle = barColor;
	canCon.closePath();
	canCon.fill();
	//
	canCon.translate(mWidth, 0);
	canCon.scale(-1, 1);
}

/**
* Draw name of recognized person
* <br/><br/>
* @param {float} x - x value of the upper left corner of a rectangle to be displayed
* @param {float} y - y value of the upper left corner of a rectangle to be displayed
* Draws name of the recognized face on cavas.
*/
function drawName(x,y,name)
{
		canCon.translate(mWidth, 0);
		canCon.scale(-1, 1);
		canCon.fillStyle="rgba(255,255,255,0.5)";
		canCon.fillRect(x,y-10,100,25);
		canCon.beginPath();
		canCon.fillStyle="black";
		canCon.font = "15px Arial";
		canCon.fillText(""+ name, x+6, y+6);
		canCon.closePath();
		canCon.translate(mWidth, 0);
		canCon.scale(-1, 1);    
}

/**
* Initializes, updates and renders 3d models
* <br/><br/>
* Creates mesh from vertices, head translation and head rotation data extracted from faceData, updates given mesh and renders it.
*/
function draw3DModel()
{
	if(!meshCreated)
	{
		if(faceModelMesh)
			scene.remove(faceModelMesh);
		if(faceModelGeometry)
			faceModelGeometry.dispose();

		var texCoordsStatic = TfaceDataArray.get(0).getFaceModelTextureCoordsStatic();
					
		tempUV = [[]];

		var triangles = TfaceDataArray.get(0).getFaceModelTriangles();
		for(var i = 0; i < triangles.length; i += 3)
		{					
			face = [
			new THREE.Vector2(
				texCoordsStatic[
					triangles[i] * 2
					], 
				texCoordsStatic[
					triangles[i] * 2 + 1
					]
				),
				
			new THREE.Vector2(
				texCoordsStatic[
					triangles[i + 1] * 2
					], 
				texCoordsStatic[
					triangles[i + 1] * 2 + 1
					]
				),
				
			new THREE.Vector2(
				texCoordsStatic[
					triangles[i + 2] * 2
					], 
				texCoordsStatic[
					triangles[i + 2] * 2 + 1
					]
				)
			];									
			
			tempUV[0].push(face);
		}

		faceModelGeometry = new THREE.Geometry();
		//faceModelTriangleCount
		
		var triangles = TfaceData.getFaceModelTriangles();
		for(i=0;i<TfaceData.faceModelTriangleCount*3;i+=3)
		{	
			var testFace = new THREE.Face3(triangles[i],triangles[i+1], triangles[i+2] ) ;
			faceModelGeometry.faces.push(testFace);
		}
		
		var wireframeVertices = TfaceData.getFaceModelVertices();
		for(i=0;i<TfaceData.faceModelVertexCount*3;i+=3)
		{
			var v = new THREE.Vector3(-wireframeVertices[i],wireframeVertices[i+1],wireframeVertices[i+2]);
			faceModelGeometry.vertices.push(v);
		}

		faceModelGeometry.faceVertexUvs = tempUV;
		faceModelGeometry.uvsNeedUpdate = true;
		
		faceModelMesh = new THREE.Mesh(faceModelGeometry,  materialTiger);
				
		faceModelMesh.position.set(TfaceData.getFaceTranslation()[0], TfaceData.getFaceTranslation()[1], -TfaceData.getFaceTranslation()[2]);
		faceModelMesh.rotation.set(TfaceData.getFaceRotation()[0], -TfaceData.getFaceRotation()[1], -TfaceData.getFaceRotation()[2]);
		scene.add(faceModelMesh);
		renderer.render(scene, v_camera);
		
		if(statusWireframe)
		{
			faceModelMesh.material = materialWireframe;
			faceModelMesh.material.needsUpdate = true;
			renderer.render(scene, v_camera);
		}
	
		meshCreated = true;
	}
	else
	{
		var wireframeVertices = TfaceData.getFaceModelVertices();
		for(i=0;i<TfaceData.faceModelVertexCount;i++)
		{
			faceModelMesh.geometry.vertices[ i ].x = -wireframeVertices[3*i];
			faceModelMesh.geometry.vertices[ i ].y = wireframeVertices[3*i+1];
			faceModelMesh.geometry.vertices[ i ].z = wireframeVertices[3*i+2];
		}

		faceModelMesh.geometry.verticesNeedUpdate = true;
	
		faceModelMesh.position.set(TfaceData.getFaceTranslation()[0], TfaceData.getFaceTranslation()[1], -TfaceData.getFaceTranslation()[2]);
		faceModelMesh.rotation.set(TfaceData.getFaceRotation()[0], -TfaceData.getFaceRotation()[1], -TfaceData.getFaceRotation()[2]);
		faceModelMesh.rotation.order = "YXZ";
	}
	renderer.render(scene, v_camera);
}

/**
* Draw face axes
* <br/><br/>
* @param {FaceDataVector} faceData - Array of {@link FaceData|FaceData} objects containing the tracking results
* Draws axis of the face applying rotational matrix calculated from 3D rotation values obtained from faceData
* and projecting results on 2D canvas as line with initial point in the position of eyes.
*/
function drawFaceModelAxes(faceData)
{
	
	var r = faceData.getFaceRotation();
	var f = faceData.cameraFocus;

	if(!faceData.getFeaturePoints3D())
		return;

	var fp1 = faceData.getFeaturePoints3D().getFP(4,1);
	var fp2 = faceData.getFeaturePoints3D().getFP(4,2);
	
	var t = [
		(fp1.getPos(0) + fp2.getPos(0)) / 2,
		(fp1.getPos(1) + fp2.getPos(1)) / 2,
		(fp1.getPos(2) + fp2.getPos(2)) / 2
	];
	
	var sinrx = Math.sin(r[0]);
	var sinry = Math.sin(r[1] + Math.PI);
	var sinrz = Math.sin(r[2]);
	var cosrx = Math.cos(r[0]);
	var cosry = Math.cos(r[1] + Math.PI);
	var cosrz = Math.cos(r[2]);
	
	//set the rotation matrix
	var R00 = cosry*cosrz+sinrx*sinry*sinrz;
	var R01 = -cosry*sinrz+sinrx*sinry*cosrz;
	var R02 = cosrx*sinry;
	var R10 = cosrx*sinrz;
	var R11 = cosrx*cosrz;
	var R12 = -sinrx;
	var R20 = -sinry*cosrz+sinrx*cosry*sinrz;
	var R21 = sinry*sinrz+sinrx*cosry*cosrz;
	var R22 = cosrx*cosry;
	
	var vertices = [
		0,	0,	0,
		-0.07,	0,	0,
		0,	0,	0,
		0,	0.07,	0,
		0,	0,	0,
		0,	0,	0.07,
	];

	var vertices2D = [];
	
	// variables for aspect correction
	var x_offset = 1;
	var y_offset = 1;
	var w = canvas.width;
	var h = canvas.height;
	if (w > h)
		x_offset = w / h;
	else if (w < h)
		y_offset = h / w;
	
	//loop over all vertices
	for (var i = 0; i < 6; i++)
	{
		var x0 = vertices[3*i+0];
		var y0 = vertices[3*i+1];
		var z0 = vertices[3*i+2];

		//scale, rotation and translation added
		var x1 = R00*x0 + R01*y0 + R02*z0 + t[0];
		var y1 = R10*x0 + R11*y0 + R12*z0 + t[1];
		var z1 = R20*x0 + R21*y0 + R22*z0 + t[2];
		var fdz = f / z1;
		//projection
		var x = fdz*x1;
		var y = fdz*y1;
		// to screen space
		vertices2D[2*i+0] = ((x * -0.5 / x_offset) + 0.5) * w;
		vertices2D[2*i+1] = (1.0 - ((y *  0.5 / y_offset) + 0.5)) * h;
	}
	
	//draw x axis
	canCon.beginPath();
	canCon.moveTo(vertices2D[0],vertices2D[1]);
	canCon.lineTo(vertices2D[2],vertices2D[3]);
	canCon.strokeStyle = X_AXIS_COLOR;
	canCon.lineWidth = 3;
	canCon.stroke();
	canCon.closePath();
	
	//draw y axis
	canCon.beginPath();
	canCon.moveTo(vertices2D[4],vertices2D[5]);
	canCon.lineTo(vertices2D[6],vertices2D[7]);
	canCon.strokeStyle = Y_AXIS_COLOR;
	canCon.lineWidth = 3;
	canCon.stroke();
	canCon.closePath();

	//draw z axis
	canCon.beginPath();
	canCon.moveTo(vertices2D[8],vertices2D[9]);
	canCon.lineTo(vertices2D[10],vertices2D[11]);
	canCon.strokeStyle = Z_AXIS_COLOR;
	canCon.lineWidth = 3;
	canCon.stroke();
	canCon.closePath();
	
	fp1.delete();
	fp2.delete();
}

/**
* Draw gaze
* <br/><br/
* @param {FaceDataVector} faceData - Array of {@link FaceData|FaceData} objects containing the tracking results
* Projects 3D gaze information (gazeDirectionGlobal) to 2D and draws on canvas.
*/
function drawGaze(faceData){
	
	if (!faceData.getEyeClosure()[1])
		return;
	
	var eye_r = faceData.getGazeDirectionGlobal();
	var f = faceData.cameraFocus;
	
	if(!faceData.getFeaturePoints3D())
		return;

	var leye = faceData.getFeaturePoints3D().getFP(3,5);
	var reye = faceData.getFeaturePoints3D().getFP(3,6);
	
	var t = [];
	
	if (leye.defined && reye.defined)
	{
		//left eye vector origin
		t.push(leye.getPos(0));
		t.push(leye.getPos(1));
		t.push(leye.getPos(2));
		//left eye vector end
		t.push(leye.getPos(0));
		t.push(leye.getPos(1));
		t.push(leye.getPos(2));
		//right eye vector origin
		t.push(reye.getPos(0));
		t.push(reye.getPos(1));
		t.push(reye.getPos(2));
		//right eye vector end
		t.push(reye.getPos(0));
		t.push(reye.getPos(1));
		t.push(reye.getPos(2));
	}
	
	var sinrx = Math.sin(eye_r[0]);
	var sinry = Math.sin(eye_r[1] + Math.PI);
	var sinrz = Math.sin(eye_r[2]);
	var cosrx = Math.cos(eye_r[0]);
	var cosry = Math.cos(eye_r[1] + Math.PI);
	var cosrz = Math.cos(eye_r[2]);
	
	//set the rotation matrix
	var R00 = cosry*cosrz+sinrx*sinry*sinrz;
	var R01 = -cosry*sinrz+sinrx*sinry*cosrz;
	var R02 = cosrx*sinry;
	var R10 = cosrx*sinrz;
	var R11 = cosrx*cosrz;
	var R12 = -sinrx;
	var R20 = -sinry*cosrz+sinrx*cosry*sinrz;
	var R21 = sinry*sinrz+sinrx*cosry*cosrz;
	var R22 = cosrx*cosry;
	
	var vertices = [
		0, 0, 0,    //left eye vector origin
		0, 0, 0.04, //left eye vector end
		0, 0, 0,    //right eye vector origin
		0, 0, 0.04  //right eye vector end
	];
	
	var vertices2D = [];
	
	// variables for aspect correction
	var x_offset = 1;
	var y_offset = 1;
	var w = canvas.width;
	var h = canvas.height;
	if (w > h)
		x_offset = w / h;
	else if (w < h)
		y_offset = h / w;
	
	//loop over all vertices
	for (var i = 0; i < 4; i++)
	{
		var x0 = vertices[3*i+0];
		var y0 = vertices[3*i+1];
		var z0 = vertices[3*i+2];

		//scale, rotation and translation added
		var x1 = R00*x0 + R01*y0 + R02*z0 + t[3*i+0];
		var y1 = R10*x0 + R11*y0 + R12*z0 + t[3*i+1];
		var z1 = R20*x0 + R21*y0 + R22*z0 + t[3*i+2];
		var fdz = f / z1;
		//projection
		var x = fdz*x1;
		var y = fdz*y1;
		// to screen space
		vertices2D[2*i+0] = ((x * -0.5 / x_offset) + 0.5) * w;
		vertices2D[2*i+1] = (1.0 - ((y *  0.5 / y_offset) + 0.5)) * h;
	}
	
	//draw left eye gaze
	canCon.beginPath();
	canCon.moveTo(vertices2D[0],vertices2D[1]);
	canCon.lineTo(vertices2D[2],vertices2D[3]);
	canCon.strokeStyle = GAZE_COLOR;
	canCon.lineWidth = 2;
	canCon.stroke();
	canCon.closePath();
	
	//draw right eye gaze
	canCon.beginPath();
	canCon.moveTo(vertices2D[4],vertices2D[5]);
	canCon.lineTo(vertices2D[6],vertices2D[7]);
	canCon.strokeStyle = GAZE_COLOR;
	canCon.lineWidth = 2;
	canCon.stroke();

	leye.delete();
	reye.delete();
}

/**
* Draws the box with gender, age and emotion estimation.
* <br/><br/>
* @param {array} emotion_values - estimated values for each emotion
* @param {float} gender - estimated gender
* @param {int} age - estimated age
* @param {int} index - used by detector for multiple faces
* @param {int} mode - used to determine the operating mode
*/
function drawGenderAgeEmotions(emotion_values,gender,age,index,mode)
{		
	if (mode === MODE_TRACK)
	{
		fd = TfaceDataArray.get(index);
	}
	else
	{
		fd = DfaceDataArray.get(index);
	}
	
	calculateBackgroundSize();

	var x;
	var y;
	var xOffset = 5;
	var yOffset = 15
	
	var down = fd.getFeaturePoints2D().getFPPos(2,1);
	var left = fd.getFeaturePoints2D().getFPPos(4,5);
	var right = fd.getFeaturePoints2D().getFPPos(4,6);
	var up = fd.getFeaturePoints2D().getFPPos(11,1);
	
	if (up[1] * canvas.height - backgroundHeight < canvas.height)
	{
		x = (1 - up[0])*canvas.width;
		y = (1 - up[1])*canvas.height;
	}

	if (right[0] * canvas.width > backgroundWidth)
	{
		x = (1 - right[0])*canvas.width;
		y = (1 - right[1])*canvas.height;
	}

	if ((left[0] * canvas.width + backgroundWidth) < canvas.width)
	{
		x = (1-left[0]-backgroundPercW)*canvas.width;
		y = (1-left[1])*canvas.height;
	}

	if ((down[1] * canvas.height > backgroundHeight) && ((down[0] * canvas.width + backgroundWidth) < canvas.width) )
	{
		x = (1 - down[0])*canvas.width;
		y = (1 - down[1])*canvas.height;
	}

	var emotionPos = 2;

	var emotions = ["Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral"];
	canCon.fillStyle="rgba(255,255,255,0.5)";
	
	canCon.fillRect(x,y,backgroundWidth,backgroundHeight);
	
	if(withinConstraints()) 
	{
		if(drawGender && drawAge)
		{
			canCon.beginPath();
			canCon.fillStyle="black";
			canCon.font = fontSize.toString() + "px Arial";
			if(gender === 1 && age > 0)
			{
				canCon.fillText("MALE, Age: "+ Math.round(age),x+xOffset,y+yOffset);
			}
			else if(gender === 0 && age > 0)
			{
				canCon.fillText("FEMALE, Age: "+ Math.round(age),x+xOffset,y+yOffset);
			}
			else
			{
				canCon.fillText("--, Age: -- ",x+xOffset,y+yOffset);
			}
			canCon.closePath();
		}
		else if(drawGender)
		{
			canCon.beginPath();
			canCon.fillStyle="black";
			canCon.font = fontSize.toString() + "px Arial";
			if(gender === 1)
			{
				canCon.fillText("Gender: MALE",x+xOffset,y+yOffset);
			}
			else if(gender === 0)
			{
				canCon.fillText("Gender: FEMALE",x+xOffset,y+yOffset);
			}
			else
			{
				canCon.fillText("Gender: --",x+xOffset,y+yOffset);
			}
			canCon.closePath();
		}
		else if(drawAge)
		{
			canCon.beginPath();
			canCon.fillStyle="black";
			canCon.font = fontSize.toString() + "px Arial";
			if(age > 0)
				canCon.fillText("Age: "+ Math.round(age),x+xOffset,y+yOffset);
			else
				canCon.fillText("Age: -- ",x+xOffset,y+yOffset);
			canCon.closePath();
			
		}
		
		if(drawEmotions && (drawAge || drawGender))
		{
			canCon.beginPath();
			canCon.moveTo(x+xOffset,y+yOffset + 6);
			canCon.lineTo(x+xOffset+backgroundLine,y+yOffset+6);
			canCon.strokeStyle = "black";
			canCon.lineWidth = 1;
			canCon.stroke();
			canCon.closePath();
		}

		if(drawEmotions)
		{
			for(var j = 0; j < numberOfEmotions; ++j)
			{
				var length = emotion_values[j] * (backgroundWidth-emotionsBarOffset-xOffset*3); 
				canCon.beginPath();
				canCon.fillStyle="black";
				canCon.font = fontSize.toString() + "px Arial";
				canCon.fillText(emotions[j],x + xOffset,y + yOffset + (j + emotionPos) * verticalStep);
				canCon.moveTo(x + xOffset + emotionsBarOffset,y + yOffset - 3 + (j + emotionPos) * verticalStep);
				canCon.lineTo(x + xOffset + emotionsBarOffset + length,y + yOffset - 3 + (j + emotionPos) * verticalStep);
				canCon.strokeStyle = EMOTION_BLUE;
				canCon.lineWidth = 6;
				canCon.stroke();
				canCon.closePath();
			}
		}
	}
	else
	{
		canCon.beginPath();
		canCon.fillStyle="red";
		canCon.font = fontSize.toString() + "px Arial";
		canCon.fillText("Age, gender and emotion ",x+xOffset,y+yOffset*backgroundHeight/backgroundHeightMax);
		canCon.fillText("estimation available ",x+xOffset,y+yOffset*backgroundHeight/backgroundHeightMax*2);
		canCon.fillText("only in frontal pose",x+xOffset,y+yOffset*backgroundHeight/backgroundHeightMax*3);
		canCon.fillText("and if face is fairly",x+xOffset,y+yOffset*backgroundHeight/backgroundHeightMax*4);
		canCon.fillText("close to the camera.",x+xOffset,y+yOffset*backgroundHeight/backgroundHeightMax*5);
		
		canCon.closePath();
	}
}

/**
* Calculates size of the rectangle used as the background for displaying analysis data and size of its components
* <br/><br/>
* Parameters:
*/
function calculateBackgroundSize()
{	
	backgroundWidthMax = 180;
	backgroundHeightMax = 120;

	if(withinConstraints())
	{
		if(drawEmotions)
		{
			fontSizePerc = 15/backgroundWidthMax;	
			
		}
		else
		{
			backgroundWidthMax = 130;
			backgroundHeightMax = 25;
			fontSizePerc = 15/backgroundWidthMax;
		}
	}
	else
	{
		backgroundWidthMax = 180;
		backgroundHeightMax = 80;
		fontSizePerc = 15/backgroundWidthMax;
		
	}
	
	backgroundPercW = backgroundWidthMax/canvas.width;
	backgroundPercH = backgroundHeightMax/canvas.height;		
	backgroundWidth = canvas.width * backgroundPercW;
	backgroundHeight = canvas.height * backgroundPercH;
	
	verticalStepMax = 12;
	verticalStepPerc = verticalStepMax/backgroundHeightMax;
	verticalStep = backgroundHeight * verticalStepPerc;		
	
	emotionsBarOffsetMax = 70;
	emotionsBarOffsetPerc = emotionsBarOffsetMax/backgroundWidthMax;
	emotionsBarOffset = backgroundWidth * emotionsBarOffsetPerc + 1;

	backgroundLine = backgroundWidth * 0.9;
	
	fontSize = backgroundWidth*fontSizePerc;	
}

/**
* Calculates face position if it is within constraints face analysis data is drawn, otherwise warning message is displayed
* <br/><br/>
*/
function withinConstraints()
{
	var faceRotationApparent = fd.getFaceRotationApparent();
	//
	var head_pitch_compensated_rad = faceRotationApparent[0];
	var head_yaw_compensated_rad = faceRotationApparent[1];
	var head_roll_rad = faceRotationApparent[2];
	//
	var head_pitch_compensated_deg = head_pitch_compensated_rad * 180 / Math.PI;
	var head_yaw_compensated_deg = head_yaw_compensated_rad * 180 / Math.PI;
	var head_roll_deg = head_roll_rad * 180 / Math.PI;
	//
	var CONSTRAINT_ANGLE = 40;
	//
	if (Math.abs(head_pitch_compensated_deg) > CONSTRAINT_ANGLE || 
		Math.abs(head_yaw_compensated_deg) > CONSTRAINT_ANGLE || 
		Math.abs(head_roll_deg) > CONSTRAINT_ANGLE || 
		fd.faceScale < 40)
	{
		return false;
	}
	return true;
}

/**
* Draws location of screen space gaze points
* <br/><br/>
* Parameters:
* @param {float} x x coordinate of the point in normalized screen coordinates
* @param {float} y y coordinate of the point in normalized screen coordinates
* @param {int} inState - state of gaze estimator:<br/>    
	* - Estimator is off, inState is equal to 0.<br/>
	* - Estimator is calibrating, inState is equal to 1.<br/>
	* - Estimator is estimating, inState is equal to 2.
*/
function drawScreenSpaceGaze(x, y, inState)
{
	if(inState == 0)
	{
		gazeCanCon.beginPath();
		gazeCanCon.fillStyle = '#FFFFFF';
		gazeCanCon.arc(x * gazeCanvas.width,y * gazeCanvas.height,10,0,2*Math.PI,true);
		gazeCanCon.closePath();
		gazeCanCon.fill();
	}
	
	if (inState == 1 || inState == 2)
	{
		gazeCanCon.beginPath();
		gazeCanCon.fillStyle = '#000000';
		gazeCanCon.arc(x * gazeCanvas.width,y * gazeCanvas.height,12,0,2*Math.PI,true);
		gazeCanCon.closePath();
		gazeCanCon.fill();
	}
	
	if(inState == 1)
	{
		gazeCanCon.beginPath();
		gazeCanCon.fillStyle = CALIB_COLOR;
		gazeCanCon.arc(x * gazeCanvas.width,y * gazeCanvas.height,10,0,2*Math.PI,true);
		gazeCanCon.closePath();
		gazeCanCon.fill();
	}
	
	if(inState == 2)
	{
		gazeCanCon.beginPath();
		gazeCanCon.fillStyle = ESTIM_COLOR;
		gazeCanCon.arc(x * gazeCanvas.width,y * gazeCanvas.height,10,0,2*Math.PI,true);
		gazeCanCon.closePath();
		gazeCanCon.fill();
	}
}

/**
* Matrix multiplication helper function
* <br/><br/>
*/
function multiplyMatrix(m1, m2, M, N, P) {
	
	var res = [];
	for(var i = 0; i < M; ++i)
	{
		for(var j = 0; j < P; ++j)
		{
			var sum = 0;
			for(var k = 0; k < N; ++k)
			{
				sum = sum + m1[i*N+k] * m2[k*P+j];
			}
			res[i*P+j] = sum;
		}
	}
	
	return res;
}
