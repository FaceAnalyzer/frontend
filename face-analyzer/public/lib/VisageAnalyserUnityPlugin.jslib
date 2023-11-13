/**
* <br/>
* The VisageAnalyserUnityPlugin is a native plugin (see <a href=https://docs.unity3d.com/Manual/NativePlugins.html>Native Plugins</a>)
* written in JavaScript for Unity. 
* The plugin exposes face analysis features of visage|SDK for use in Unity WebGL build.
* <br/>	<br/>
* The plugin code is placed in VisageAnalyserUnityPlugin.jslib file and can be found in /lib folder.
* <br/>	<br/>

*
* <h3>&emsp;Dependencies </h3>
* The plugin depends on visageSDK.js file that loads visageSDK.data and visageAnalysisData.js that loads visageAnalysisData.data. 
* Therefore, visageSDK.js has to be loaded along with visageAnalysisData.js script 
* by calling {@link module:VisageTrackerUnityPlugin._preloadExternalJS|_preloadExternalJS}
* function with the scripts' path relative to the main .html file.
* <br>
* For example, if visageAnalysisData.js is placed in the same folder as the main .html file:
* <pre class="prettyprint source"><code>
* 	VisageTrackerNative._preloadExternalJS("visageSDK.js.js");
* 	VisageTrackerNative._preloadExternalJS("visageAnalysisData.js");
*
* </code></pre>
* visageAnalysisData.data file, can be placed at any location on the server relative to the WEBGL build outputed main index.html file,
* by setting the data path using {@link module:VisageTrackerUnityPlugin._setDataPath|_setDataPath} function. 
* <br/>
* Note that calling the {@link module:VisageTrackerUnityPlugin._setDataPath|_setDataPath} function will change the search path of all .data files.
* <h3>&emsp;Usage </h3>
* For the functions to be accessible from C#, a C# wrapper interface is used.
* The example can be seen in the following function:
* <pre class="prettyprint source"><code>
* 	[DllImport("__Internal")]
* 	public static extern void _initAnalyser(string initCallback);
*
* </code></pre>
* The usage is demonstrated in VisageTrackerUnityDemo sample, VisageTrackerNative.HTML5.cs file. All C# scripts are located in Assets/Scripts folder of the project. 
* <br/>
* The frame that will be forwarded to the functions for estimating age, gender and emotions has to be processed before using VisageTracker.
*<br/>
*<br/>
*
* <h3>&emsp;Callbacks</h3>
* Generally, it is common to use callback functions in JavaScript, due to its asynchronous nature. 
*
* <br/>
* Within the plugin, some functions are implemented so they expect a <b>callback function name</b> as a parameter.
* Callback functions are defined in C# code.
* Examples can be seen in {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} function.
* <br/><br/>
* 
* 
* 
* @exports VisageAnalyserUnityPlugin
* <br/>
*/

var VisageAnalyserUnityPlugin = 
{	
	/*
	* Declares {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} dependency on 
	* {@link module:VisageAnalyserUnityPlugin.mInitVis|mInitVis} and {@link module:VisageAnalyserUnityPlugin.mLicenseInitialize|mLicenseInitialize} parameter.
	*/
	_initAnalyser__deps:['mInitVis', 'mLicenseInitialize'],
	
	/**
	* Initializes VisageAnalyser.
	* <br/>
	* In order to use VisageAnalyser functions visageAnalysisData.data must be preloaded with visageAnalysisData.js script by calling 
	* {@link module:VisageTrackerUnityPlugin._preloadExternalJS|_preloadExternalJS} function
	* at the very beginning of the code execution. The recommendation is to call this function in Awake() function in Unity.
	*
	* Parameter <i>callback</i> is name of function defined in Unity script.
	* An example of a callback function definition and {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} function call:
	* <pre class="prettyprint source"><code>
	*	//callback function
	*	void initAnalyserCallback()
	*	{
	*		Debug.Log("AnalyserInited");
	*		AnalyserInitialized = true;
	*	}
	*	//call of the _initAnalyser() function:
	*	VisageTrackerNative._initAnalyser("initAnalyserCallback");
	* </code></pre>
	*
	* <br/>
	* @param {string} callback - <b>the name</b> of the callback function.
	*/
	_initAnalyser: function(callback)
	{	
		if(typeof mCallbackAnalyser === 'undefined')
		{
			mCallbackAnalyser = UTF8ToString(callback);
		}
	
		if(!_mInitVis || !_mLicenseInitialize)
		{
			setTimeout(__initAnalyser, 2, callback);
			return;
		}	
			
		analyser = new VisageModule.VisageFaceAnalyser();	
	
		SendMessage('Analyser', mCallbackAnalyser);	
		
		delete mCallbackAnalyser;
	},
	
	
	_releaseAnalyser: function()
	{
		if(typeof analyser !== 'undefined')
		{
			analyser.delete();
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._analyseImage|_analyseImage} dependency on 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels},
	* {@link module:VisageTrackerUnityPlugin.VFAReturnCode|VFAReturnCode},
	* {@link module:VisageTrackerUnityPlugin.AnalysisData|AnalysisData} variables.
	*/
	__analyseImage__deps: ['ppixels', 'VFAReturnCode', 'AnalysisData'],
	
	/**
	* Performs the specified face analysis tasks on a given image.
	* <br/>
	* This function is primarily intended for performing face analysis on a single image, or consecutive unrelated images.
	* As such, it outputs raw, unfiltered estimation data without smoothing or averaging.
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @param {number} options - Bitwise combination of {@link VFAFlags} which determines the analysis operations to be performed.
	* @param {Array} resultsArray - 12-dimension float array where the results of the performed face analysis will be stored. Array elements correspond with {@link AnalysisData} class elements.
	* @return {VFAReturnCode} Return code indicating status of performed face analysis. 
	*/
	_analyseImage: function(faceIndex, options, resultsArray)
	{
		if(typeof analyser === 'undefined')
			return VisageModule.VFAReturnCode.DataUninitialized.value;

		var mWidth = w;
		var mHeight = h;
		var faceData = faceDataArray.get(faceIndex);

		var localData = new VisageModule.AnalysisData();
		var resultsArrayView = new Float32Array(unityGame.Module.buffer, resultsArray, 12);

		var returnCode = analyser.analyseImage(mWidth, mHeight, _ppixels, faceData, options, localData);

		resultsArrayView[0] = localData.getAge();
		resultsArrayView[1] = localData.getAgeValid();
		resultsArrayView[2] = localData.getGender();
		resultsArrayView[3] = localData.getGenderValid();
		var emotions = localData.getEmotionProbabilities();
		for (var i = 0; i < 7; ++i)
		{
			resultsArrayView[i+4] = emotions[i];
		}
		resultsArrayView[11] = localData.getEmotionsValid();
		localData.delete();

		return returnCode;
	},

	/*
	* Declares {@link module:VisageTrackerUnityPlugin._analyseStream|_analyseStream} dependency on 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels},
	* {@link module:VisageTrackerUnityPlugin.VFAReturnCode|VFAReturnCode},
	* {@link module:VisageTrackerUnityPlugin.AnalysisData|AnalysisData} variables.
	*/
	__analyseStream__deps: ['ppixels', 'VFAReturnCode', 'AnalysisData'],
	
	/**
	* Performs the specified face analysis tasks on a given frame.
	* <br/>
	* This function is primarily intended for performing face analysis on a continuous stream of related frames, such as a video or camera feed.
	* Sampling face analysis data from multiple frames can increase estimation accuracy by averaging the result over multiple frames.
	* Internally, the suitability of frames chosen for analysis is continually evaluted based on head pose and overall tracking quality.
	* This guarantees that the analysis buffer is always working with the best available frames, ensuring highest possible estimation accuracy.
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @param {number} options - Bitwise combination of {@link VFAFlags} which determines the analysis operations to be performed.
	* @param {Array} resultsArray - 12-dimension float array where the results of the performed face analysis will be stored. Array elements correspond with {@link AnalysisData} class elements.
	* @return {VFAReturnCode} Return code indicating status of performed face analysis. 
	*/
	_analyseStream: function(faceIndex, options, resultsArray)
	{
		if(typeof analyser === 'undefined')
			return VisageModule.VFAReturnCode.DataUninitialized.value;

		var mWidth = w;
		var mHeight = h;
		var faceData = faceDataArray.get(faceIndex);

		var localData = new VisageModule.AnalysisData();
		var resultsArrayView = new Float32Array(unityGame.Module.buffer, resultsArray, 12);

		var returnCode = analyser.analyseStream(mWidth, mHeight, _ppixels, faceData, options, localData, faceIndex);

		resultsArrayView[0] = localData.getAge();
		resultsArrayView[1] = localData.getAgeValid();
		resultsArrayView[2] = localData.getGender();
		resultsArrayView[3] = localData.getGenderValid();
		var emotions = localData.getEmotionProbabilities();
		for (var i = 0; i < 7; ++i)
		{
			resultsArrayView[i+4] = emotions[i];
		}
		resultsArrayView[11] = localData.getEmotionsValid();
		localData.delete();

		return returnCode;
	},

	/* Declares {@link module:VisageTrackerUnityPlugin._resetStreamAnalysis|_resetStreamAnalysis} dependency on 
	* {@link module:VisageTrackerUnityPlugin.faceIndex|faceIndex} variable.
	*/
	_resetStreamAnalysis: ['faceIndex'],
	
	/**
	* Resets face analysis. 
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_resetStreamAnalysis: function(faceIndex)
	{
		analyser.resetStreamAnalysis(faceIndex);
	}
	
};

mergeInto(LibraryManager.library, VisageAnalyserUnityPlugin);

	
