var mWidth = 0;
var mHeight = 0;
var maxFacesTracker = 0;
var maxFacesDetector = 0;
var numOfFaces = 0;
var faceIndex = 0;
var trackerStatus = 0;
var options = 0;
//
var NUM_EMOTIONS = 7;
//
var emotionAverageList = [];
var GenderAverage = [];
var AgeAverage = [];
//
var TfaceDataNoseOld = [];
var AgeDetect = [];
var GenderDetect = [];
var emotionListDetect = [];
//
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
if (ENVIRONMENT_IS_WORKER)
{
	var locationObj = self.location;
}

self.onmessage = function (msg) {
	switch (msg.data.aTopic) {
		case 'resolution':
			mWidth = msg.data.mWidth;
			mHeight = msg.data.mHeight;
			maxFacesTracker = msg.data.maxFacesTracker;
			maxFacesDetector = msg.data.maxFacesDetector;
			break;
		case 'sendFrameTrack':
			imageData = new Uint8ClampedArray(msg.data.imageData);
			analyserControlOptions = JSON.parse(msg.data.analyserControlOptions);
			trackerStatus = JSON.parse(msg.data.numFaces);
			
			if (analyserInitialized)
			{
				//obtain FaceData in ArrayBuffer
				faceDataBuffer = msg.data.inFaceData; 
				//create typedArray object from ArrayBuffer
				faceDataBufferFloatArray = new Float32Array(faceDataBuffer);
				m_faceDataArrayTrack.get(0).deserializeBuffer(faceDataBufferFloatArray);
			}
			trackAnalysis();
			break;
		case 'sendFrameDetect':
			imageData = new Uint8ClampedArray(msg.data.imageData);
			numOfFaces = msg.data.numFaces;
			if (analyserInitialized)
			{
				var DfaceDataStringArray = msg.data.inFaceData.split("||", maxFacesDetector);
				
				for(var i = 0; i < numOfFaces; i++)
				{
					m_faceDataArrayDetect.get(i).deserializeJson(DfaceDataStringArray[i]);
				}
			}
			
			detectAnalysis();
			break;

		case 'trackStatus':
			faceIndex = msg.data.faceIndex;
			resetAnalysisParameters(faceIndex);
			break;
		default:
			throw 'no aTopic on incoming message to Worker';
	}
}


licenseName = "728-647-708-712-368-939-525-416-088-305-748.vlc"
licenseURL = "728-647-708-712-368-939-525-416-088-305-748.vlc"
var locateFile = function(dataFileName) {var relativePath = "../../lib/" + dataFileName; return relativePath};
VisageModule = {
   locateFile: locateFile,
   preRun: [function() {
		VisageModule.FS_createPreloadedFile('/', licenseName, licenseURL, true, false, function(){ },  function(){ console.log("Loading License Failed!") });
        VisageModule.FS_createPreloadedFile('/', 'NeuralNet.cfg', "../../lib/NeuralNet.cfg", true, false);        
    }],

   onRuntimeInitialized: onModuleInitialized
}



importScripts('../../lib/visageSDK.js');
importScripts('../../lib/visageAnalysisData.js');


function onModuleInitialized()
{
	//wait for initialization if the first message has not yet arrived from the main thread
	//it is enough to check only one value set in onmessage event with the topic 'resolution'
	if (mWidth === 0)
	{
		setTimeout(onModuleInitialized, 100);
		return
	}

	ppixels = VisageModule._malloc(mWidth*mHeight*4);
	pixels = new Uint8Array(VisageModule.HEAPU8.buffer, ppixels, mWidth*mHeight*4);
	
	alert = function(msg) 
	{ 
		console.log(msg); 
	}
	
	VisageModule.initializeLicenseManager(licenseName);
	m_FaceAnalyser = new VisageModule.VisageFaceAnalyser();
	
	m_faceDataArrayTrack = new VisageModule.FaceDataVector();
	m_faceDataArrayDetect = new VisageModule.FaceDataVector();
	
	m_AnalysisDataArrayTrack = new VisageModule.AnalysisDataVector();
	m_AnalysisDataArrayDetect = new VisageModule.AnalysisDataVector();
	
	
	for (var i = 0; i < maxFacesTracker; ++i)
	{
		m_faceDataArrayTrack.push_back(new VisageModule.FaceData());
		m_AnalysisDataArrayTrack.push_back(new VisageModule.AnalysisData());
	}

	for(var i = 0; i < maxFacesDetector; ++i)
	{
		m_faceDataArrayDetect.push_back(new VisageModule.FaceData());
		m_AnalysisDataArrayDetect.push_back(new VisageModule.AnalysisData());
	}
	
	for(var i = 0; i < maxFacesTracker; ++i)
	{
		emotionAverageList[i] = [0,0,0,0,0,0,0];
		
		GenderAverage[i] = 0;

		AgeAverage[i] = 0;
		
		TfaceDataNoseOld[i] = [];
	}
	
	for(var i = 0; i < maxFacesDetector; ++i)
	{
		emotionListDetect[i] = [0,0,0,0,0,0,0];
		AgeDetect[i] = -1;
		GenderDetect[i] = -1;
	}
	
	analyserInitialized = true;
	self.postMessage({aTopic:'initialization done'});
	
}

/**
* Resets analysis parameters for particular tracked face.
*/
function resetAnalysisParameters(faceIndex)
{
	emotionAverageList[faceIndex] = [0,0,0,0,0,0,0];

	GenderAverage[faceIndex] = -1;

	AgeAverage[faceIndex] = -1;
	
	TfaceDataNoseOld[faceIndex] = [];
	
	m_FaceAnalyser.resetStreamAnalysis(faceIndex);

	self.postMessage({aTopic:'analysis reset', emotions : emotionAverageList, gender: GenderAverage, age: AgeAverage});
}


/**
* If TrackStatus is OK (i.e equal to 1) calls function for estimating and filtering the values of age, gender and emotions for each 
* particular tracked face.
*/
function trackAnalysis()
{
	if (analyserInitialized)
	{
		for(var i=0; i<imageData.length; i+=1)
		{
			pixels[i] = imageData[i];
		}
		
		if(analyserControlOptions[0] == true)
			options |= VisageModule.VFAFlags.VFA_EMOTION.value;
		if(analyserControlOptions[1] == true)
			options |= VisageModule.VFAFlags.VFA_GENDER.value;
		if(analyserControlOptions[2] == true)
			options |= VisageModule.VFAFlags.VFA_AGE.value;
		
		for(var index = 0; index < maxFacesTracker; ++index)
		{
			if(trackerStatus[index] === 1 && trackTest(index))
			{
				faceData = m_faceDataArrayTrack.get(index);
				analysisData = m_AnalysisDataArrayTrack.get(index);
				callAnalysis_stream(faceData, analysisData, index, options);
			}
			else
				resetAnalysisParameters(index);
		}
	}
	
	self.postMessage({aTopic:'analysis results track', emotions : emotionAverageList, gender: GenderAverage, age: AgeAverage});
}

/**
* Performs emotion, age and gender analysis for a video stream and a given face (faceIndex). 
* Results are saved to different lists for a faceIndex face.
*/
function callAnalysis_stream(faceData, analysisData, faceIndex, options)
{
	const status = m_FaceAnalyser.analyseStream(mWidth, mHeight, ppixels, faceData, options, analysisData, faceIndex);
	
	var emotionValid = analysisData.getEmotionsValid();
	if (emotionValid)
	{
		var emotions = analysisData.getEmotionProbabilities();
		for(var j = 0; j < NUM_EMOTIONS; j++)
			{
				emotionAverageList[faceIndex][j] = emotions[j];
			}
	}
	
	var genderValid = analysisData.getGenderValid();
	if (genderValid)
	{
		var gender = analysisData.getGender();
		GenderAverage[faceIndex] = gender;
	}
	
	var ageValid = analysisData.getAgeValid();
	if (ageValid)
	{
		var age = analysisData.getAge();
		AgeAverage[faceIndex] = age;
	}
	
	else
	{
		return;
	}
}

/**
* Performs emotion, age and gender analysis for an image and a given face (faceIndex). 
* Results are saved to different lists for a faceIndex face.
*/
function callAnalysis_image(faceData, analysisData, faceIndex, options)
{
	if(withinConstraints(faceIndex))
	{
		const status = m_FaceAnalyser.analyseImage(mWidth, mHeight, ppixels, faceData, options, analysisData);
		var emotionsArray = [];
		var emotionValid = analysisData.getEmotionsValid();
		if (emotionValid)
		{
			for (var j = 0; j < NUM_EMOTIONS; ++j)
			{
				var emotions = analysisData.getEmotionProbabilities();
				emotionsArray.push(emotions[j]);
				emotionListDetect[faceIndex][j] = emotionsArray[j];
			}
		}
		
		var genderValid = analysisData.getGenderValid();
		if (genderValid)
		{
			var gender = analysisData.getGender();
			GenderDetect[faceIndex] = gender;
		}
		
		var ageValid = analysisData.getAgeValid();
		if (ageValid)
		{
			var age = analysisData.getAge();
			AgeDetect[faceIndex] = age;
		}
	}
}

/**
* If face position is within constraints performs face analysis
*/
function withinConstraints(faceIndex)
{
	var head_pitch_compensated_rad = m_faceDataArrayDetect.get(faceIndex).getFaceRotationApparent()[0];
	var head_yaw_compensated_rad = m_faceDataArrayDetect.get(faceIndex).getFaceRotationApparent()[1];
	var head_roll_rad = m_faceDataArrayDetect.get(faceIndex).getFaceRotationApparent()[2];
	
	var head_pitch_compensated_deg = head_pitch_compensated_rad * 180 / Math.PI
	var head_yaw_compensated_deg =  head_yaw_compensated_rad * 180 / Math.PI
	var head_roll_deg = head_roll_rad * 180 / Math.PI

	var CONSTRAINT_ANGLE = 40;
	
	if (Math.abs(head_pitch_compensated_deg) > CONSTRAINT_ANGLE || 
		Math.abs(head_yaw_compensated_deg) > CONSTRAINT_ANGLE || 
		Math.abs(head_roll_deg) > CONSTRAINT_ANGLE || 
		m_faceDataArrayDetect.get(faceIndex).faceScale < 40)
	{
		return false;
	}
	return true;	
}

/**
* Test if the face from the last frame is the same in this frame (used by tracker)
*/
function trackTest(faceIndex)
{
	var allowedDiff = 0.1;
	var faceData = m_faceDataArrayTrack.get(faceIndex);
	var factorDiffX = allowedDiff * faceData.faceScale / mWidth;
	var factorDiffY = allowedDiff * faceData.faceScale / mHeight;
	if(TfaceDataNoseOld[faceIndex].length == 0)
	{
		TfaceDataNoseOld[faceIndex] = [faceData.getFeaturePoints2D().getFPPos(12,1)[0],faceData.getFeaturePoints2D().getFPPos(12,1)[1]];
		return true;
	}
	else
	{
		if(
		((faceData.getFeaturePoints2D().getFPPos(12,1)[0] >= (TfaceDataNoseOld[faceIndex][0] - factorDiffX)) && 
		(faceData.getFeaturePoints2D().getFPPos(12,1)[0] <= (TfaceDataNoseOld[faceIndex][0] + factorDiffX)))
		|| 
		((faceData.getFeaturePoints2D().getFPPos(12,1)[1] >= (TfaceDataNoseOld[faceIndex][1] - factorDiffY)) && 
		(faceData.getFeaturePoints2D().getFPPos(12,1)[1] <= (TfaceDataNoseOld[faceIndex][1] + factorDiffY)))
		)
		{
			TfaceDataNoseOld[faceIndex] = [faceData.getFeaturePoints2D().getFPPos(12,1)[0],faceData.getFeaturePoints2D().getFPPos(12,1)[1]];
			return true;
		}
		else
		{
			TfaceDataNoseOld[faceIndex] = [faceData.getFeaturePoints2D().getFPPos(12,1)[0],faceData.getFeaturePoints2D().getFPPos(12,1)[1]];
			return false;
		}
	}
}

/**
* Calls function for estimating age, gender and emotions for each detected face on image.
*/
function detectAnalysis()
{
	for(var i=0; i<imageData.length; i+=1)
	{
		pixels[i] = imageData[i];
	}
	
	for (var i = 0; i < numOfFaces; i++)
	{
		callAnalysis_image(m_faceDataArrayDetect.get(i), m_AnalysisDataArrayDetect.get(i), i, options);
	}
	
	self.postMessage({aTopic:'analysis results detect', emotions: emotionListDetect, gender: GenderDetect, age: AgeDetect});
	
}
