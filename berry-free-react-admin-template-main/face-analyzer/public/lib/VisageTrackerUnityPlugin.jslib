/**
* <br/>
* The VisageTrackerUnityPlugin is a native plugin (see <a href=https://docs.unity3d.com/Manual/NativePlugins.html>Native Plugins</a>)
* written in JavaScript for Unity. 
* The plugin exposes face tracking features of visage|SDK for use in Unity WebGL build.
* <br/>	<br/>
* The plugin code is placed in VisageTrackerUnityPlugin.jslib file and can be found in /lib folder.
* <br/>	<br/>

*
* <h3>&emsp;Dependencies </h3>
* The plugin depends on visageSDK.js file that loads visageSDK.data. The script should be included to the project by calling 
* {@link module:VisageTrackerUnityPlugin._preloadExternalJS|_preloadExternalJS} function
* at the very beginning of the code execution. The recommendation is to call this function in Awake() function in Unity.
* For example, if visageSDK.js is placed in the same folder as the main .html file:
* <pre class="prettyprint source"><code>
* 	VisageTrackerNative._preloadExternalJS("visageSDK.js");
*
* </code></pre>
* <br/>
* Data files, including all files with .data extension and .wasm extension can be placed at any location on the server relative to the WEBGL build outputed main index.html file,
* by setting the data path using {@link module:VisageTrackerUnityPlugin._setDataPath|_setDataPath} function. 
* If the path is not specified, they are presumed to be located in the same folder where the WEBGL build outputed main index.html file is.
* Additional information on changing the location of the data file can be seen on the following link:
* <a href="VisageTracker.html#trackDep">VisageTracker Dependencies</a>
* <br/><br/>
*
* <h3>&emsp;Usage </h3>
* For the functions to be accessible from C#, a C# wrapper interface is used.
* The example can be seen in the following function:
* <pre class="prettyprint source"><code>
* 	[DllImport("__Internal")]
* 	public static extern void _openCamera(int width, int height, int mirrored, string onSucessCallbackCamera, string onErrorCallbackCamera);
*
* </code></pre>
* The usage is demonstrated in VisageTrackerUnityDemo sample, VisageTrackerNativ.HTML5.cs file. All C# scripts are located in Assets/Scripts folder of the project. 
* <br/>
* In order to use VisageTrackerUnity plugin in Unity projects visageSDK.js must be included in output index.html file (see <a href="trackerunity.html#BuildUnity">link</a>).
*<br/>
*<br/>
*
* <h3>&emsp;Callbacks</h3>
* Generally, it is common to use callback functions in JavaScript, due to its asynchronous nature. 
*
* <br/><br/>
* Within the plugin, some functions are implemented so they expect a <b>callback function name</b> as a parameter.
* Callback functions are defined in C# code.
* Examples can be seen in {@link module:VisageTrackerUnityPlugin._getCameraInfo|_getCameraInfo} function.
* <br/><br/>
* 
* 
* 
* @exports VisageTrackerUnityPlugin
* <br/>
*/

var VisageTrackerUnityPlugin = 
{
	/*
	* Indicator whether the VisageModule is loaded.
	* <br/>
	* @type {Boolean}
	*/
	mInitVis: false,
	
	/*
	* Path to the data files on server.
	* <br/>
	* @type {String}
	*/
	mDataPath: null,

	/*
	* Indicator whether the license is loaded.
	* <br/>
	* @type {Boolean}
	*/
	mLicenseLoaded: false,
	
	/*
	* Indicator whether the license is initialized.
	* <br/>
	* @type {Boolean}
	*/
	mLicenseInitialize: false,
	
	/*
	* True if initialization of VisageModule was initiated, false otherwise.
	* <br/>
	* @type {Boolean}
	*/
	mInInit: false,
	
	/*
	* Indicator whether the stream from camera is accessed.
	* <br/>
	* @type {Boolean}
	*/
	mIsStreaming: false,
	
	/*
	* Indicator whether the memory for pixels is allocated.
	* <br/>
	* @type {Boolean}
	*/
	mPixelsAllocated: false,
	
	/*
	* Possible states of the tracker:
	* <br>
	* OFF = 0,
	* OK = 1,
	* RECOVERING = 2,
	* INIT = 3
	* <br/>
	* @type {Array}
	*/
	status: ["OFF","OK","RECOVERING","INIT"],
	trackerStatus: [],
	
	/*
	* Pointer to image pixel data.
	* <br/>
	* @type {Number}
	*/
	ppixels: -1,
	
	/*
	* View to the memory.
	* <br/>
	* @type {Array}
	*/
	pixels: -1,
	
	/*
	* Array of strings used to store all urls and file names that need to be preloaded into the file system.
	* <br/>
	* @type {Array}
	*/
	files: [],
	
	/*
	* Array of strings used to store url of visageAnalysisData.js script file that loads data required for face analysis into the file system.
	* <br/>
	* @type {Array}
	*/
	data: [],
	
	/*
	* Maximum number of faces that will be tracked.
	* The default value of the parameter is 1, and the upper value is limited to 10.
	*/
	NUM_FACES: 1,
	
	/*
	* Maximum number of faces that can be tracked.
	* <br/>
	*/
	MAX_FACES: 10,
	
	/*
	* Represents the underlying pixel data for the area of the canvas denoted by the rectangle which starts at 
	* (sx, sy) and has an sw width and sh height.
	*/
	imageData: -1,

	/*
	* Declares {@link module:VisageTrackerUnityPlugin._setDataPath|_setDataPath} dependency on 
	* {@link module:VisageTrackerUnityPlugin.mDataPath|mDataPath} array.
	*/
	_setDataPath__deps: ['mDataPath'],
	
	/**
	* Stores the location of data files relative to the main index.html file.
    * <br/>
	* It has to be called before using any of the functionalities from visage|SDK. 
	* The recommendation for calling this function is within the function Awake() in Unity. 
	* <br/>
    * If the function was called with an arbitrary path, it will change the location for all <i>.data</i> files and <i>visageSDK.wasm</i> file.
    * <br/>
	* @param {string} dataPath - the path to the data files.
	*/
	_setDataPath: function(dataPath)
	{
		var dataPathString = UTF8ToString(dataPath);

		_mDataPath = dataPathString;
	},	
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._preloadFile|_preloadFile} dependency on 
	* {@link module:VisageTrackerUnityPlugin.files|files} array.
	*/
	_preloadFile__deps: ['files'],
	
	/**
	* Stores urls and names of the files that need to be preloaded into the file system.
	* It is expected that the url for each file will be relative to the main index.html file position.
	* It has to be called before using any of the functionalities from visage|SDK. 
	* The recommendation for calling this function is within the function Awake() in Unity. 
	* <br/>
	* @param {string} fileURL - the name and path to the file.
	*/
	_preloadFile: function(fileURL)
	{
		var url = UTF8ToString(fileURL);
		var fileName = url.substring(url.lastIndexOf('/')+1);
		_files.push(fileName);
		_files.push(url);
	},	
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._preloadExternalJS|_preloadExternalJS} dependency on 
	* {@link module:VisageTrackerUnityPlugin.data|data} parameter.
	*/
	_preloadExternalJS__deps: ['data'],
	
	/**
	* Stores URL and name of visageSDK library and data loading scripts into the file system.
	* It is expected that the url will be relative to the main index.html file position.
	* It has to be called before using any of the functionalities from visage|SDK. 
	* The recommendation for calling this function is within the function Awake() in Unity. 
	* <br/>
	* @param {string} fileURL - the name and path to the script file.
	*/
	_preloadExternalJS: function(fileURL)
	{
		var url = UTF8ToString(fileURL);
		_data.push(url);
	},	

	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin.mPreloadFiles|mPreloadFiles} dependency on 
	* {@link module:VisageTrackerUnityPlugin.files|files} array.
	*/
	mPreloadFiles__deps: ['files', 'mLicenseLoaded'],
	
	/*
	* Preloads files into the Emscripten's File System which urls and names are stored in {@link module:VisageTrackerUnityPlugin.files|files} array.
	* <br/>
	*/
	mPreloadFiles: function()
	{
		for(var i = 0; i < _files.length; i = i + 2)
		{
			VisageModule.FS_createPreloadedFile("/", _files[i], _files[i+1], true, false);			
		}
		_mLicenseLoaded = true;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin.mLoadJsFiles|mLoadJsFiles} dependency on  
	* {@link module:VisageTrackerUnityPlugin.data|data} array.
	* <br/>
	*/
	mLoadJsFiles__deps: ['data'],

	/*
	* Loads the visageSDK.js script and external data scripts into the Emscripten's File System from relative paths stored in {@link module:VisageTrackerUnityPlugin.data|data} array.
	* <br/>
	*/
	mLoadJsFiles: function() {

		//Sort data array so that visageSDK.js is always on the first place in the array, i.e. the first will be loaded.
		_data.sort(function(x,y){ return x.includes("visageSDK.js")  ? -1 : y == x ? 1 : 0; });

		var load = function(i) {
			var file = _data[i];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.onload = function() {
				i++;
				if(i === _data.length) {
					return;
				} else {
					load(i);
				}
			}
			script.src = file;
			document.head.appendChild(script);
		};
		load(0);
	},

	/*
	* Declares {@link module:VisageTrackerUnityPlugin.mInitVisage|mInitVisage} dependency on 
	* {@link module:VisageTrackerUnityPlugin.mInInit|mInInit}, 
	* {@link module:VisageTrackerUnityPlugin.files|files}, 
	* {@link module:VisageTrackerUnityPlugin.data|data} variables and
	* {@link module:VisageTrackerUnityPlugin.mPreloadFiles|mPreloadFiles}, 
	* {@link module:VisageTrackerUnityPlugin.mLoadJsFiles|mLoadJsFiles} functions.
	* <br/>
	*/
	mInitVisage__deps: ['mInInit', 'files', 'mPreloadFiles', 'data', 'mLoadJsFiles', 'mDataPath'],
	
	/*
	* Loads VisageModule.
	* <br/>
	* If VisageModule is loaded successfully OnRuntimeInitialized is called and {@link module:VisageTrackerUnityPlugin.mInitVis|mInitVis} is set to true, otherwise UnboundTypeError is called and {@link module:VisageTrackerUnityPlugin.mInitVis|mInitVis} is set to false.
	*/
	mInitVisage: function()
	{
		if (_mInInit)
			return;

		if(_mDataPath === null)
			_mDataPath = "."

		var locateFile = function(dataFileName) {var relativePath = _mDataPath + "/" + dataFileName; return relativePath};

		_mInInit = true;
		
		VisageModule = {

			locateFile: locateFile,

			preRun: [],

			onRuntimeInitialized: function(){_mInitVis = true;}
		}
		
		VisageModule.preRun.push(_mPreloadFiles);

		_mLoadJsFiles();

	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._initializeLicense|_initializeLicense} dependency on
	* {@link module:VisageTrackerUnityPlugin.mInitVis|mInitVis} and {@link module:VisageTrackerUnityPlugin.mLicenseLoaded|mLicenseLoaded} variables.
	* <br/>	
	*/
	_initializeLicense__deps: ['mInitVis', 'mLicenseLoaded', 'mLicenseInitialize'],
	
	/**
	* Initializes the license. 
	* It is recommended to initialize the license in the Awake() function within the unity script.
	* @param {String} license - license url as relative path from the main index.html file to the directory that contains license file(s) (e.g. licenseFilePath = "StreamingAssets/Visage Tracker/471-308-776-250-553-231-598-221-624-198-522.vlc";). 
	* <br/>
	*/
	_initializeLicense: function(license)
	{
		if(typeof mLicense === 'undefined')
		{
			mLicense = UTF8ToString(license);
		}
		
		if(!_mInitVis || !_mLicenseLoaded)
		{
			_mInitVisage();
			setTimeout(__initializeLicense, 2, license);
			return;
		}
		
		VisageModule.initializeLicenseManager(mLicense);	
		
		_mLicenseInitialize = true;
		
		delete mLicense;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._initTracker|_initTracker} dependency on {@link module:VisageTrackerUnityPlugin.mInitVis|mInitVis}, 
	* {@link module:VisageTrackerUnityPlugin.mLicenseInitialize|mLicenseInitialize},
	* {@link module:VisageTrackerUnityPlugin.MAX_FACES|MAX_FACES}, {@link module:VisageTrackerUnityPlugin.NUM_FACES|NUM_FACES},
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} and {@link module:VisageTrackerUnityPlugin.mPixelsSet|mPixelsSet} variables.
	* <br/>	
	*/
	_initTracker__deps: ['mInitVis', 'MAX_FACES', 'NUM_FACES', 'trackerStatus', 'mLicenseInitialize', 'mPixelsAllocated'],
	
	/**
	* Initializes VisageTracker.
	* <br/>
	* To change the configuration file, {@link module:VisageTrackerUnityPlugin._initTracker|_initTracker} function should be called again.
	* Callback function is called once the tracker is initialized.
	* <br>
	* Parameter <i>config</i> is string that represent the path to the tracker configuration file.
	* <br>
	* Example, if the configuration file is located in StreamingAssets/Visage Tracker folder:
	* <pre class="prettyprint source"><code>
	*	configFilePath = "StreamingAssets/Visage Tracker/Head Tracker.cfg";
	*
	* </code></pre>
	* Parameter <i>callback</i> is name of function defined in Unity script.
	* An example of a callback function definition and _initTracker() function call:
	* <pre class="prettyprint source"><code>
	*	//callback function
	*	public void CallbackInitTracker()
	*	{
	*		Debug.Log("TrackerInited");
	*		trackerInited = true;
	*	}
	*	//call of the _initTracker() function:
	*	VisageTrackerNative._initTracker(config, MAX_FACES, "CallbackInitTracker");
	* </code></pre>
	* <br/>
	* @param {string} config - the name and path to the tracker configuration file (.cfg; default configuration file is provided in lib folder; 
	* for further details see <a href="doc/VisageTracker Configuration Manual.pdf">VisageTracker Configuration Manual</a>). 
	* @param {Number} numFaces - The maximum number of faces that will be tracked. 
	* @param {string} callback - <b>the name</b> of the callback function.
	*/
	_initTracker: function(config, numFaces, callback)
	{
		if(typeof mConfig === 'undefined' && typeof mCallback === 'undefined' && typeof mNumFaces === 'undefined')
		{
			mConfig = UTF8ToString(config);
			mCallback = UTF8ToString(callback);
			mNumFaces = numFaces;
		}
		
		if(!_mInitVis || !_mLicenseInitialize || !_mPixelsAllocated)
		{
			_mInitVisage();
			setTimeout(__initTracker, 2, config, numFaces, callback);
			return;
		}
		
		if(typeof tracker !== 'undefined')
		{
			tracker.delete();
			faceDataArray.delete();
		}
		
		if (mNumFaces > _MAX_FACES)
			_NUM_FACES = _MAX_FACES;
		else
			_NUM_FACES = mNumFaces;
		
		tracker = new VisageModule.VisageTracker(mConfig);
		
		faceDataArray = new VisageModule.FaceDataVector();
		for(var i = 0; i < _NUM_FACES; ++i)
		{		
			faceDataArray.push_back(new VisageModule.FaceData());
		}
		
		_trackerStatus = [];
		
		SendMessage('Tracker', mCallback);
		
		delete mConfig;
		delete mCallback;	
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin.mAllocateMemory|mAllocateMemory} dependency on {@link module:VisageTrackerUnityPlugin.mInitVis|mInitVis}, 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels}, {@link module:VisageTrackerUnityPlugin.pixels|pixels} and {@link module:VisageTrackerUnityPlugin.mPixelsAllocated|mPixelsAllocated} 
	* variables.
	* <br/>	
	*/
	mAllocateMemory__deps: ['mInitVis', 'ppixels', 'pixels', 'mPixelsAllocated'],
	
	/*
	* Allocates memory for image data.
	* <br/>
	*/
	mAllocateMemory: function()
	{
		if (!_mInitVis)
		{
			setTimeout(_mAllocateMemory, 50);
			return;
		}
		
		_ppixels = VisageModule._malloc(w*h*4);

		_pixels = new Uint8ClampedArray(VisageModule.HEAPU8.buffer, _ppixels, w*h*4);
		
		_mPixelsAllocated = true;
		
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._openCamera|_openCamera} dependency on {@link module:VisageTrackerUnityPlugin.mAllocateMemory|mAllocateMemory} 
	* and {@link module:VisageTrackerUnityPlugin.mInitVisage|mInitVisage} functions and {@link module:VisageTrackerUnityPlugin.mIsStreaming|mIsStreaming} parameter.
	* <br/>
	*/
	_openCamera__deps: ['mAllocateMemory', 'mInitVisage', 'mIsStreaming'],
	
	/**
	* Closes camera if it is already opened.
	* <br/>
	* If the camera is initialized successfully onSuccessCallbackCamera callback function is called, otherwise onErrorCallbackCamera callback function is called.
	* Mirrors the frame if isMirrored parameter is set to 1.
	* <br/>
	* @param {Number} camWidth - camera frame width.
	* @param {Number} camHeight - camera frame height.
	* @param {Number} isMirrored - 1 or 0; if set to 1 frames will be mirrored.
	* @param {String} onSuccessCallbackCamera - the name of the callback function that is called if camera is successfully initalized.
	* @param {String} onErrorCallbackCamera - the name of the callback function that is called if initialization camera fails.
	*/
	_openCamera: function(camWidth, camHeight, isMirrored, onSuccessCallbackCamera, onErrorCallbackCamera)
	{	
		if(!_mInitVis)
			_mInitVisage();
		
		if(_mIsStreaming)
			__closeCamera();
		
		var success =  UTF8ToString(onSuccessCallbackCamera);
		var error =  UTF8ToString(onErrorCallbackCamera);
		
		canvas = document.createElement('canvas');
		canvas.id = 'c';
		document.body.appendChild(canvas);
		c = document.getElementById('c');
		c.style.display = "none";
		
		video = document.createElement('video');
		//Mobile safari requirement
		video.setAttribute("playsinline", true);
		video.id = 'v';
		document.body.appendChild(video);
		v = document.getElementById('v');
		v.style.display = "none";
		
		con = c.getContext('2d');
		w = camWidth;
		h = camHeight;
		
		_mIsStreaming = false;

			
		// Request access to video only
		navigator.mediaDevices.getUserMedia(
		{
			video: { width: w, height: h },
			audio:false
		}).then(function(stream) {
			v.srcObject = stream;
			v.play();
			window.localStream = stream;
		}).catch(function(error) {
				SendMessage('Tracker', error);
		});
	
		
		// Wait until the video stream can play
		v.addEventListener('canplay', function(e) {
			if (!_mIsStreaming) {
				c.setAttribute('width', w);
				c.setAttribute('height', h);
				
				if(isMirrored == 1)
				{
					// Reverse the canvas image
					con.translate(w, 0);
					con.scale(-1, 1);
				}
				_mIsStreaming = true;
				SendMessage('Tracker', success);
				_mAllocateMemory();
			}
		}, false);
	},
	
	/**
	* Stops camera streaming.
	* 
	* <br/>
	* @return {Boolean} If camera is already closed returns false, otherwise returns true.
	*/
	_closeCamera:function()
	{
		if(_mIsStreaming)
		{
			localStream.getVideoTracks()[0].stop();
			document.body.removeChild(canvas);
			document.body.removeChild(video);
			
			if(_ppixels !== -1 &&  _pixels !== -1)
			{
				VisageModule._free(_ppixels);
			}
			_mIsStreaming = false;
			_mPixelsAllocated = false;
			return true;
		}
		else
			return false;
	},
	
	/**
	* Captures current frame to be used for face tracking and binding on given texture. Needs to be called before {@link module:VisageTrackerUnityPlugin._track|_track} 
	* and {@link module:VisageTrackerUnityPlugin._bindTexture|_bindTexture} functions.
	* <br/>
	*/
	_grabFrame: function()
	{
		if(_mIsStreaming)
		{
			con.fillRect(0, 0, w, h);
			con.drawImage(v, 0, 0, w, h);
			
			//Access pixel data	
			_imageData =  con.getImageData(0, 0, w, h);
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getTrackerStatus|_getTrackerStatus} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} and  
	* {@link module:VisageTrackerUnityPlugin.NUM_FACES|NUM_FACES} variables.
	* <br/>
	*/
	_getTrackerStatus__deps: ['trackerStatus', 'NUM_FACES'],
	
	/**
	* Returns tracker status. 
	* @param {Array} trackStatus - array that will be filled with tracking statuses for each of the tracked faces. 
	* @param {Number} length - length of trackStatus array, should be equal to the number of faces given to the _initTracker() function(smaller of equal to 10).  
	*/
	_getTrackerStatus: function(trackStatus, length)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		var JavaScriptSharedArray = new Int32Array(unityGame.Module.buffer, trackStatus, length);
				
		for(var i = 0; i < _NUM_FACES; ++i)
		{
			JavaScriptSharedArray[i] = _trackerStatus[i];
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._track|_track} dependency on
	* {@link module:VisageTrackerUnityPlugin.imageData|imageData},
	* {@link module:VisageTrackerUnityPlugin.pixels|pixels},
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels},
	* {@link module:VisageTrackerUnityPlugin.NUM_FACES|NUM_FACES} and
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameters.
	* <br/>
	*/
	_track__deps: ['imageData', 'pixels', 'ppixels', 'NUM_FACES', 'trackerStatus'],
	
	/**
	* Performs face tracking on the captured frame (see {@link module:VisageTrackerUnityPlugin._grabFrame|_grabFrame}) and returns tracking status.
	* {@link module:VisageTrackerUnityPlugin._openCamera|_openCamera} and {@link module:VisageTrackerUnityPlugin._initTracker|_initTracker} functions
	* need to succeed before calling {@link module:VisageTrackerUnityPlugin._track|_track}.
	* <br/>
	*/
	_track: function()
	{	
		if (_imageData === -1 || _pixels === -1 || _ppixels === -1)
		{ 				
			return;
		}
	
		//Save pixel data to preallocated buffer
		for(i=0; i<_imageData.data.length; i+=1)
		{
			_pixels[i] = _imageData.data[i];
		}
		
		_trackerStatus = tracker.track(w, h, _ppixels, faceDataArray,
										VisageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
										VisageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value, 0, -1, _NUM_FACES);			
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._bindTexture|_bindTexture} dependency on {@link module:VisageTrackerUnityPlugin.imageData|imageData}
	* <br/>
	*/
	_bindTexture__deps: ['imageData'],
	
	/**
	* Update the passed texture with the current captured frame image data (see {@link module:VisageTrackerUnityPlugin._grabFrame|_grabFrame}).
	* The function expects the pointer to the created texture to be passed.
	* <br>
	* Example:
	* <pre class="prettyprint source"><code>
	* 	private Texture2D texture = null;
	* 	texture = new Texture2D(TexWidth, TexHeight, TextureFormat.RGBA32, false);
	* 	VisageTrackerNative._bindTexture(texture.GetNativeTexturePtr());
	*
	* </code></pre>
	*
	* <br/>
	* @param {Number} texture -  Pointer to an texture.
	*/
	_bindTexture: function(texture)
	{
		if(_imageData === -1)
			return;
		
		GLctx.bindTexture(GLctx.TEXTURE_2D, GL.textures[texture]);
		
		var xoffset = 0;
		var yoffset = 0;

		GLctx.texSubImage2D(GLctx.TEXTURE_2D, 0, xoffset, yoffset, GLctx.RGBA, GLctx.UNSIGNED_BYTE, _imageData);
	},
	
	/*
	* Rounding value to nearest power of two.
	* <br/>
	*/
	mGetNearestPow2: function(v)
	{
		v--;
		v|=v>>1;
		v|=v>>2;
		v|=v>>4;
		v|=v>>8;
		v|=v>>16;
		++v;
		return v;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getCameraInfo|_getCameraInfo} dependency on {@link module:VisageTrackerUnityPlugin.status|status} 
	* and {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameters.
	* <br/>
	*/
	_getCameraInfo__deps: ['status', 'trackerStatus'],
	
	/**
	* Assigns values to the given camera info parameters.
	* @param {Number} camFocus - parameter to which focal distance of the camera will be assigned. 
	* @param {Number} imgWidth - parameter to which width of the frame will be assigned. 
	* @param {Number} imgHeight - parameter to which height of the frame will be assigned. 
	* <br/>
	*/
	_getCameraInfo: function(camFocus, imgWidth, imgHeight)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		if(_trackerStatus[0] === 0)
			return;
		
		var focusArray = new Float32Array(unityGame.Module.buffer, camFocus, 1);
		var widthArray = new Int32Array(unityGame.Module.buffer, imgWidth, 1);
		var heightArray = new Int32Array(unityGame.Module.buffer, imgHeight, 1);
				
		focusArray[0] = faceDataArray.get(0).cameraFocus;
		widthArray[0] = w;
		heightArray[0] = h;
	},
	
	__getTexCoordsStatic__deps: ['status', 'trackerStatus'],
	
	_getTexCoordsStatic: function(texCoords, texCoordNumber)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		if(_trackerStatus[0] === 0)
			return;
		
		var faceData = faceDataArray.get(0);
		var texCoordsArray       = new Float32Array(unityGame.Module.buffer, texCoords, 2 * faceData.faceModelVertexCount);
		var texCoordsNumberArray = new Int32Array(unityGame.Module.buffer, texCoordNumber, 1);
				
		texCoordsNumberArray[0] = 2 * faceData.faceModelVertexCount;
		
		for(var i = 0; i < texCoordsNumberArray[0]; ++i)
		{
			texCoordsArray[i] = faceData.getFaceModelTextureCoordsStatic()[i];
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getHeadTranslation|_getHeadTranslation} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getHeadTranslation__deps: ['trackerStatus'],
	
	/**
	* Translation of the head from the camera. 
	* Parameter <i>translatation</i> is 3-dimensional array which will be filled x, y and z head translation coordinates 
	* for the particular face given with <i>faceIndex</i> parameter.
	* The coordinate system is such that when looking towards the camera, the direction of x is to the left, y iz up, and z points towards the viewer. 
	* The global origin (0,0,0) is placed at the camera. The reference point on the head is in the center between the eyes.
	* This variable is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will fill translation array with -10000 values.
	* @param {Array} translation - 3D array in which the head translation values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getHeadTranslation: function(translation, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return;
  
		var translationArray = new Float32Array(unityGame.Module.buffer, translation, 3);
		
		if(_trackerStatus[faceIndex] != 1)
		{
			for(var i = 0; i < 3; ++i)
			{
				translationArray[i] = -10000;
			}
		}
		else
		{
			for(var i = 0; i < 3; ++i)
			{
				translationArray[i] = faceDataArray.get(faceIndex).getFaceTranslation()[i];
			}
		}
			
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getHeadRotation|_getHeadRotation} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getHeadRotation__deps: ['trackerStatus'],
	
	/**
	* Rotation of the head. 
	* <br/>
	* Parameter <i>rotation</i> is three-dimensional array which will be filled x, y and z head rotation coordinates 
	* for the particular face given with <i>faceIndex</i> parameter.
	* <br/>
	* This is the estimated rotation of the head, in radians. Rotation is expressed with three values determining the rotations around the three axes x, y and z, in radians. 
	* This means that the values represent the pitch, yaw and roll of the head, respectively. The zero rotation (values 0, 0, 0) corresponds to the face looking straight ahead along the camera axis. 
	* Positive values for pitch correspond to head turning down. Positive values for yaw correspond to head turning right in the input image. 
	* Positive values for roll correspond to head rolling to the left in the input image. The values are in radians.
	* <br/>
	* This variable is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will fill rotation array with 0 values.
	* @param {Array} rotation - 3D array in which the head rotation values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getHeadRotation: function(rotation, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return;
  
		var rotationArray = new Float32Array(unityGame.Module.buffer, rotation, 3);
		
		if(_trackerStatus[faceIndex] != 1)
		{
			for(var i = 0; i < 3; ++i)
			{
				rotationArray[i] = 0;
			}
		}
		else
		{
			for(var i = 0; i < 3; ++i)
			{
				rotationArray[i] = faceDataArray.get(faceIndex).getFaceRotation()[i];
			}
		}
			
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getHeadRotationApparent|_getHeadRotationApparent} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getHeadRotationApparent__deps: ['trackerStatus'],
	
	/**
	* Rotation of the head relative to the camera. 
	* <br/>
	* Parameter <i>rotationApparent</i> is three-dimensional array which will be filled x, y and z apparent head rotation coordinates 
	* for the particular face given with <i>faceIndex</i> parameter.
	* <br/>
	* This is the estimated apparent rotation of the head, in radians. Rotation is expressed with three values determining the rotations around the three axes x, y and z, in radians. 
	* This means that the values represent the pitch, yaw and roll of the head, respectively. The zero apparent rotation (values 0, 0, 0) corresponds to the face looking straight into the camera i.e. a frontal face. 
	* Positive values for pitch correspond to head turning down. Positive values for yaw correspond to head turning right in the input image. 
	* Positive values for roll correspond to head rolling to the left in the input image. The values are in radians.
	* <br/>
	* This variable is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will fill rotation array with 0 values.
	* @param {Array} rotation - 3D array in which the head rotation values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getHeadRotationApparent: function(rotationApparent, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return;

		var rotationApparentArray = new Float32Array(unityGame.Module.buffer, rotationApparent, 3);
		
		if(_trackerStatus[faceIndex] != 1)
		{
			for(var i = 0; i < 3; ++i)
			{
				rotationApparentArray[i] = 0;
			}
		}
		else
		{
			for(var i = 0; i < 3; ++i)
			{
				rotationApparentArray[i] = faceDataArray.get(faceIndex).getFaceRotationApparent()[i];
			}
		}
			
	},

	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceBoundingBox|_getFaceBoundingBox} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceBoundingBox__deps: ['trackerStatus'],

	/**
	* Face bounding box.
	* <br/>
	* Parameter <i>rectangle</i> is a VsRect structure whose members represent x and y coordinates of the upper-left corner and the width and height of the box.
	* All members are expressed in pixels.
	* <br/>
	* This is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will fill VsRect values with -1.
	* @param {VsRect} rectangle - Structure where face bounding box's coordinates and size will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getFaceBoundingBox: function(rectangle, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
        var fbbView = new Int32Array(unityGame.Module.buffer, rectangle, 4);
 
		if(_trackerStatus[faceIndex] != 1)
		{
            for(var i = 0; i < 3; ++i)
			{
				fbbView[i] = -1;
			}
		}
		else
		{
			fbbView[0] = faceDataArray.get(faceIndex).getFaceBoundingBox().x;
			fbbView[1] = faceDataArray.get(faceIndex).getFaceBoundingBox().y;
			fbbView[2] = faceDataArray.get(faceIndex).getFaceBoundingBox().width;
			fbbView[3] = faceDataArray.get(faceIndex).getFaceBoundingBox().height;
		}
			
	},	
	
	/**
	* Index of the first feature point group. 
	* @return {Number} 2
	* <br/>
	*/
	_getFP_START_GROUP_INDEX: function()
	{
		return VisageModule.FP_START_GROUP_INDEX;
	},
	
	/**
	* Index of the last feature point group. 
	* @return {Number} 15
	* <br/>
	*/
	_getFP_END_GROUP_INDEX: function()
	{
		return VisageModule.FP_END_GROUP_INDEX;
	},
	
	/**
	* Get the size of all feature point groups. 
	* @param {Array} groupSizeArray - array in which the size of each group will be stored.
	* @param {Number} length - length of groupSizeArray array.
	* <br/>
	*/
	_getGroupSizes: function(groupSizeArray, length)
	{  
		var groupSizeArrayView = new Int32Array(unityGame.Module.buffer, groupSizeArray, length);
 
		for (var groupIndex = VisageModule.FP_START_GROUP_INDEX; groupIndex <= VisageModule.FP_END_GROUP_INDEX; ++groupIndex)
		{
			groupSizeArrayView[groupIndex - VisageModule.FP_START_GROUP_INDEX] = VisageModule.FDP.groupSize(groupIndex);
		}  
	},	
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints3DRel|_getFeaturePoints3DRel} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFeaturePoints3DRelative__deps: ['trackerStatus'],
	
	/**
	* Returns the 3D coordinates relative to the face origin, placed at the center between eyes in meters, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* Returned coordinates are in the local coordinate system of the face, with the origin (0,0,0) placed at the center between the eyes. The x-axis points laterally towards the side of the face, y-xis points up and z-axis points into the face.
	* <br/>
	* Function returns position for N feature points in the N*3-dimensional <i>positions</i> array, an indication of whether the point is defined as 0 and 1 in the N-dimensional <i>defined</i> array and detected as 0 and 1 in the N-dimensional <i>detected</i> array. 
	* The quality of each point as value between 0 and 1 is returned in <i>quality</i> array.
	* For each point, its group and index are specifically listed in the <i>groups</i> and <i>indices</i> arrays.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	// an example for points 2.1, 8.3 and 8.4
	*	const int N;
	*	int[] groups = new int[N] {2, 8, 8};
	*	int[] indices = new int[N]{ 1, 3, 4 };
	*	float[] positions3D = new float[3*N];
	*	int[] defined = new int[N];
	*	int[] detected = new int[N];
	*	float[] quality = new float[N];
	*
	*	for (int faceIndex = 0; faceIndex < MAX_FACES; faceIndex++)
	*	{
	*		VisageTrackerNative._getFeaturePoints3DRelative(N, groups, indices, positions3D, defined, detected, quality, faceIndex);
	*	}
	*
	* <b>NOTE:</b> quality information is returned exclusively within _getFeaturePoints2D() function. Therefore, this function will always return -1 for the quality of each point.
	*
	* </code></pre>
	* @param {Number} N - number of feature points. 
	* @param {Array} groups - N-dimensional array of the groups of the feature points. 
	* @param {Array} indices - N-dimensional array of the indices of the feature points within the groups. 
	* @param {Array} positions3D - N*3-dimensional array filled with resulting facial feature points positions. 
	* @param {Array} defined - N-dimensional array filled for every feature point with a value that indicates whether the point is defined. Value 1 is assigned to defined points, and 0 to undefined points. 
	* @param {Array} detected - N-dimensional array filled for every feature point with a value that indicates whether the point is detected. Value 1 is assigned to detected points, and 0 to undetected points. 
	* @param {Array} quality - N-dimensional array filled for every feature point with a value from 0 to 1, where 0 is the worst and 1 is the best quality. 
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getFeaturePoints3DRelative: function(N, groups, indices, positions3D, defined, detected, quality, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		if(_trackerStatus[faceIndex]!= 1)
		{
			return;
        }
		
		var FPGroupRelView = new Int32Array(unityGame.Module.buffer, groups, N);
		var FPIndRelView = new Int32Array(unityGame.Module.buffer, indices, N);
		
		var FPPosRelView = new Float32Array(unityGame.Module.buffer, positions3D, N*3);
		var FPDefRelView = new Int32Array(unityGame.Module.buffer, defined, N);
		var FPDetRelView = new Int32Array(unityGame.Module.buffer, detected, N);
		var FPQualRelView = new Float32Array(unityGame.Module.buffer, quality, N);
		
		var groupIndex = [];
		var pointIndex = [];
		FDP3DRel = faceDataArray.get(0).getFeaturePoints3DRelative();
		
		for(var i = 0; i < N; ++i)
		{
			groupIndex[i] = FPGroupRelView[i];
			pointIndex[i] = FPIndRelView[i];
		}
		
		indexPos = 0;
		for(var j = 0; j < N; ++j)
		{
			FPPosRelView[indexPos++] = FDP3DRel.getFPPos(groupIndex[j], pointIndex[j])[0];
			FPPosRelView[indexPos++] = FDP3DRel.getFPPos(groupIndex[j], pointIndex[j])[1];
			FPPosRelView[indexPos++] = FDP3DRel.getFPPos(groupIndex[j], pointIndex[j])[2];
			FPDefRelView[j] = FDP3DRel.FPIsDefined(groupIndex[j], pointIndex[j]);
			FPDetRelView[j] = FDP3DRel.FPIsDetected(groupIndex[j], pointIndex[j]);
			FPQualRelView[j] = FDP3DRel.getFPQuality(groupIndex[j], pointIndex[j]);
		}
	}, 
			
    /*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints3D|_getFeaturePoints3D} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFeaturePoints3D__deps: ['trackerStatus'],
	
	/**
	* Returns the global 3D feature point position in meters, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* The coordinate system is such that when looking towards the camera, the direction of x is to the left, y iz up, and z points towards the viewer. The global origin (0,0,0) is placed at the camera.
	* <br/>
	* Function returns position for N feature points in the N*3-dimensional <i>positions</i> array, an indication of whether the point is defined as 0 and 1 in the N-dimensional <i>defined</i> array and detected as 0 and 1 in the N-dimensional <i>detected</i> array. 
	* The quality of each point as value between 0 and 1 is returned in <i>quality</i> array.
	* For each point, its group and index are specifically listed in the <i>groups</i> and <i>indices</i> arrays.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	// an example for points 2.1, 8.3 and 8.4
	*	const int N;
	*	int[] groups = new int[N] {2, 8, 8};
	*	int[] indices = new int[N]{ 1, 3, 4 };
	*	float[] positions3D = new float[3*N];
	*	int[] defined = new int[N];
	*	int[] detected = new int[N];
	*	float[] quality = new float[N];
	*
	*	for (int faceIndex = 0; faceIndex < MAX_FACES; faceIndex++)
	*	{
	*		VisageTrackerNative._getFeaturePoints3D(N, groups, indices, positions3D, defined, detected, quality, faceIndex);
	*	}
	*
	* <b>NOTE:</b> quality information is returned exclusively within _getFeaturePoints2D() function. Therefore, this function will always return -1 for the quality of each point.
	*
	* </code></pre>
	* @param {Number} N - number of feature points. 
	* @param {Array} groups - N-dimensional array of the groups of the feature points. 
	* @param {Array} indices - N-dimensional array of the indices of the feature points within the groups. 
	* @param {Array} positions3D - N*3-dimensional array filled with resulting facial feature points positions. 
	* @param {Array} defined - N-dimensional array filled for every feature point with a value that indicates whether the point is defined. Value 1 is assigned to defined points, and 0 to undefined points. 
	* @param {Array} detected - N-dimensional array filled for every feature point with a value that indicates whether the point is detected. Value 1 is assigned to detected points, and 0 to undetected points. 
	* @param {Array} quality - N-dimensional array filled for every feature point with a value from 0 to 1, where 0 is the worst and 1 is the best quality. 
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getFeaturePoints3D: function(N, groups, indices, positions3D, defined, detected, quality, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		if(_trackerStatus[faceIndex]!=1)
		{
			return;
        }
	
        var FPGroupView = new Int32Array(unityGame.Module.buffer, groups, N);
		var FPIndView = new Int32Array(unityGame.Module.buffer, indices, N);
		
		var FPPosView = new Float32Array(unityGame.Module.buffer, positions3D, N*3);
		var FPDefView = new Int32Array(unityGame.Module.buffer, defined, N);
		var FPDetView = new Int32Array(unityGame.Module.buffer, detected, N);
		var FPQualView = new Float32Array(unityGame.Module.buffer, quality, N);
		
		var groupIndex = [];
		var pointIndex = [];
		FDP3D = faceDataArray.get(0).getFeaturePoints3D();
		
		for(var i = 0; i < N; ++i)
		{
			groupIndex[i] = FPGroupView[i];
			pointIndex[i] = FPIndView[i];
		}
		
		indexPos = 0;
		for(var j = 0; j < N; ++j)
		{
			FPPosView[indexPos++] = FDP3D.getFPPos(groupIndex[j], pointIndex[j])[0];
			FPPosView[indexPos++] = FDP3D.getFPPos(groupIndex[j], pointIndex[j])[1];
			FPPosView[indexPos++] = FDP3D.getFPPos(groupIndex[j], pointIndex[j])[2];
			FPDefView[j] = FDP3D.FPIsDefined(groupIndex[j], pointIndex[j]);
			FPDetView[j] = FDP3D.FPIsDetected(groupIndex[j], pointIndex[j]);
			FPQualView[j] = FDP3D.getFPQuality(groupIndex[j], pointIndex[j]);
		}
	},
    
    /*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints2D|_getFeaturePoints2D} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFeaturePoints2D__deps: ['trackerStatus'],
	
	/**
	* Returns the feature points position in normalized 2D screen coordinates, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* The 2D feature point coordinates are normalised to image size so that the lower left corner of the image has coordinates 0,0 and upper right corner 1,1.
	* <br/>
	* Function returns position for N feature points in the N*2-dimensional <i>positions</i> array, an indication of whether the point is defined as 0 and 1 in the N-dimensional <i>defined</i> array and detected as 0 and 1 in the N-dimensional <i>detected</i> array. 
	* The quality of each point as value between 0 and 1 is returned in <i>quality</i> array.
	* For each point, its group and index are specifically listed in the <i>groups</i> and <i>indices</i> arrays.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	// an example for points 2.1, 8.3 and 8.4
	*	const int N;
	*	int[] groups = new int[N] {2, 8, 8};
	*	int[] indices = new int[N]{ 1, 3, 4 };
	*	float[] positions2D = new float[2*N];
	*	int[] defined = new int[N];
	*	int[] detected = new int[N];
	*	float[] quality = new float[N];
	*
	*	for (int faceIndex = 0; faceIndex < MAX_FACES; faceIndex++)
	*	{
    *		VisageTrackerNative._getFeaturePoints2D(N, groups, indices, positions2D, defined, detected, quality, faceIndex);
	*	}
	*
	* </code></pre>
	* @param {Number} N - number of feature points. 
	* @param {Array} groups - N-dimensional array of the groups of the feature points. 
	* @param {Array} indices - N-dimensional array of the indices of the feature points within the groups. 
	* @param {Array} positions2D - N*2-dimensional array filled with resulting facial feature points positions. 
	* @param {Array} defined - N-dimensional array filled for every feature point with a value that indicates whether the point is defined. Value 1 is assigned to defined points, and 0 to undefined points. 
	* @param {Array} detected - N-dimensional array filled for every feature point with a value that indicates whether the point is detected. Value 1 is assigned to detected points, and 0 to undetected points. 
	* @param {Array} quality - N-dimensional array filled for every feature point with a value from 0 to 1, where 0 is the worst and 1 is the best quality. 
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getFeaturePoints2D: function(N, groups, indices, positions2D, defined, detected, quality, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
        {
			return;
		}
        
		if(_trackerStatus[faceIndex]!=1)
		{
			return;
        }
        
	    var FPGroupView = new Int32Array(unityGame.Module.buffer, groups, N);
        
		var FPIndView = new Int32Array(unityGame.Module.buffer, indices, N);
        
		var FPPosView = new Float32Array(unityGame.Module.buffer, positions2D, N*2);
		var FPDefView = new Int32Array(unityGame.Module.buffer, defined, N);
		var FPDetView = new Int32Array(unityGame.Module.buffer, detected, N);
		var FPQualView = new Float32Array(unityGame.Module.buffer, quality, N);
		
		var groupIndex = [];
		var pointIndex = [];
		FDP2D = faceDataArray.get(0).getFeaturePoints2D();
        
		for(var i = 0; i < N; ++i)
		{
			groupIndex[i] = FPGroupView[i];
			pointIndex[i] = FPIndView[i];
		}
		
		indexPos = 0;
		for(var j = 0; j < N; ++j)
		{
			FPPosView[indexPos++] = FDP2D.getFPPos(groupIndex[j], pointIndex[j])[0];
			FPPosView[indexPos++] = FDP2D.getFPPos(groupIndex[j], pointIndex[j])[1];
			FPDefView[j] = FDP2D.FPIsDefined(groupIndex[j], pointIndex[j]);
			FPDetView[j] = FDP2D.FPIsDetected(groupIndex[j], pointIndex[j]);
			FPQualView[j] = FDP2D.getFPQuality(groupIndex[j], pointIndex[j]);
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints3DRel|_getFeaturePoints3DRel} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getAllFeaturePoints3DRelative__deps: ['trackerStatus'],
	
	/**
	* Returns for all feature points the position in 3D coordinates relative to the face origin, placed at the center between eyes in meters, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* Returned coordinates are in the local coordinate system of the face, with the origin (0,0,0) placed at the center between the eyes. The x-axis points laterally towards the side of the face, y-xis points up and z-axis points into the face.
	* <br/>
	* For example, first feature point is 2.1, therefore first six values in featurePointArray array will be filled with the following values:
	* <pre class="prettyprint source"><code>
	* 	featurePointArray = [x_(2.1), y_(2.1), z_(2.1), defined_(2.1), detected_(2.1), quality_(2.1), ...]
	* </code></pre>
	* <br/>
	* An example of use in Unity: 
	* <pre class="prettyprint source"><code>
	*	//array which will be filled with values
	*	public float[] featurePointArray = new float[1000];
	*	
	*	//call of the _getAllFeaturePoints3DRelative() function
	*	VisageTrackerNative._getAllFeaturePoints3DRelative(featurePointArray, featurePointArray.Length, faceIndex);
	*	
	* </code></pre>
	*
	* <b>NOTE:</b> quality information is returned exclusively within _getAllFeaturePoints2D() function. Therefore, this function will always return -1 for the quality of each point.
	*
	* @param {Array} featurePointArray - array in which the position in x, y and z coordinates, indication whether the point is defined and detected and 
	* feature point quality will be stored.
	* @param {Number} length - length of featurePointArray.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*
	*/
	_getAllFeaturePoints3DRelative: function(featurePointArray, length, faceIndex)
	{
		if(_trackerStatus === -1 || typeof tracker === 'undefined')
		   return;
		  
		if(_trackerStatus[0] != 1)
		{
			return;
		}
		 
		var FeaturePointsView = new Float32Array(unityGame.Module.buffer, featurePointArray, length);
		 
		FDP3DRel = faceDataArray.get(0).getFeaturePoints3DRelative();
		  
		var index = 0;
		for (var groupIndex = VisageModule.FP_START_GROUP_INDEX; groupIndex <= VisageModule.FP_END_GROUP_INDEX; ++groupIndex)
		{
			for (var pointIndex = 1; pointIndex <= VisageModule.FDP.groupSize(groupIndex); ++pointIndex)
			{
				FeaturePointsView[index++] = FDP3DRel.getFPPos(groupIndex, pointIndex)[0];
				FeaturePointsView[index++] = FDP3DRel.getFPPos(groupIndex, pointIndex)[1];
				FeaturePointsView[index++] = FDP3DRel.getFPPos(groupIndex, pointIndex)[2];
				FeaturePointsView[index++] = FDP3DRel.FPIsDefined(groupIndex, pointIndex)[3];
				FeaturePointsView[index++] = FDP3DRel.FPIsDetected(groupIndex, pointIndex)[4];
				FeaturePointsView[index++] = FDP3DRel.getFPQuality(groupIndex, pointIndex)[5];	
		    }
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints3D|_getFeaturePoints3D} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getAllFeaturePoints3D__deps: ['trackerStatus'],
	
	/**
	* Returns for all feature points the global 3D position in meters, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* The coordinate system is such that when looking towards the camera, the direction of x is to the left, y iz up, and z points towards the viewer. The global origin (0,0,0) is placed at the camera.
	* <br/>
	* For example, first feature point is 2.1, therefore first six values in featurePointArray array will be filled with the following values:
	* <pre class="prettyprint source"><code>
	* 	featurePointArray = [x_(2.1), y_(2.1), z_(2.1), defined_(2.1), detected_(2.1), quality_(2.1), ...]
	* </code></pre>
	* An example of use in Unity: 
	* <pre class="prettyprint source"><code>
	*	//array which will be filled with values
	*	public float[] featurePointArray = new float[1000];
	*	
	*	//call of the _getAllFeaturePoints3D() function
	*	VisageTrackerNative._getAllFeaturePoints3D(featurePointArray, featurePointArray.Length, faceIndex);
	*
	* </code></pre>
	*
	* <b>NOTE:</b> quality information is returned exclusively within _getAllFeaturePoints2D() function. Therefore, this function will always return -1 for the quality of each point.
	*
	* @param {Array} featurePointArray - array in which the position in x, y and z coordinates, indication whether the point is defined and detected and 
	* feature point quality will be stored.
	* @param {Number} length - length of featurePointArray.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*
	*/
	_getAllFeaturePoints3D: function(featurePointArray, length, faceIndex)
	{				
		if(_trackerStatus === -1 || typeof tracker === 'undefined')
		   return;
		  
		if(_trackerStatus[0] != 1)
		{
			return;
		}
		 
		var FeaturePointsView = new Float32Array(unityGame.Module.buffer, featurePointArray, length);
		 
		FDP3D = faceDataArray.get(faceIndex).getFeaturePoints3D();
		  
		var index = 0;
		for (var groupIndex = VisageModule.FP_START_GROUP_INDEX; groupIndex <= VisageModule.FP_END_GROUP_INDEX; ++groupIndex)
		{
			for (var pointIndex = 1; pointIndex <= VisageModule.FDP.groupSize(groupIndex); ++pointIndex)
			{
				FeaturePointsView[index++] = FDP3D.getFPPos(groupIndex, pointIndex)[0];
				FeaturePointsView[index++] = FDP3D.getFPPos(groupIndex, pointIndex)[1];
				FeaturePointsView[index++] = FDP3D.getFPPos(groupIndex, pointIndex)[2];
				FeaturePointsView[index++] = FDP3D.FPIsDefined(groupIndex, pointIndex)[3];
				FeaturePointsView[index++] = FDP3D.FPIsDetected(groupIndex, pointIndex)[4];
				FeaturePointsView[index++] = FDP3D.getFPQuality(groupIndex, pointIndex)[5];
		    }
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFeaturePoints2D|_getFeaturePoints2D} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getAllFeaturePoints2D__deps: ['trackerStatus'],
	
	/**
	* Returns for all feature points the position in normalized 2D screen coordinates, indicator whether the point is defined, indicator whether the point is detected or estimated
	* and feature point quality for the given faceIndex. 
	* <br/>
	* The 2D feature point coordinates are normalised to image size so that the lower left corner of the image has coordinates 0,0 and upper right corner 1,1.
	* <br/>
	* For example, first feature point is 2.1, therefore first five values in featurePointArray array will be filled with the following values:
	* <pre class="prettyprint source"><code>
	* 	featurePointArray = [x_(2.1), y_(2.1), defined_(2.1), detected_(2.1), quality_(2.1), ...]
	* </code></pre>
	* An example of use in Unity: 
	* <pre class="prettyprint source"><code>
	*	//array which will be filled with values
	*	public float[] featurePointArray = new float[1000];
	*	
	*	//call of the _getAllFeaturePoints2D() function
	*	VisageTrackerNative._getAllFeaturePoints2D(featurePointArray, featurePointArray.Length, faceIndex);
	*
	* </code></pre>
	*
	* @param {Array} featurePointArray - array in which the position in normalized 2D screen coordinates, indication whether the point is defined and detected and 
	* feature point quality will be stored.
	* @param {Number} length - length of featurePointArray.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*
	*/
	_getAllFeaturePoints2D: function(featurePointArray, length, faceIndex)
	{
		if(_trackerStatus === -1 || typeof tracker === 'undefined')
		   return;
		  
		if(_trackerStatus[faceIndex] != 1)
		{
			return;
		}
		 
		var FeaturePointsView = new Float32Array(unityGame.Module.buffer, featurePointArray, length);
		 
		FDP2D = faceDataArray.get(faceIndex).getFeaturePoints2D();  
		  
		var index = 0;
		for (var groupIndex = VisageModule.FP_START_GROUP_INDEX; groupIndex <= VisageModule.FP_END_GROUP_INDEX; ++groupIndex)
		{
			for (var pointIndex = 1; pointIndex <= VisageModule.FDP.groupSize(groupIndex); ++pointIndex)
			{
				FeaturePointsView[index++] = FDP2D.getFPPos(groupIndex, pointIndex)[0];
				FeaturePointsView[index++] = FDP2D.getFPPos(groupIndex, pointIndex)[1];
				FeaturePointsView[index++] = FDP2D.FPIsDefined(groupIndex, pointIndex)[3];
				FeaturePointsView[index++] = FDP2D.FPIsDetected(groupIndex, pointIndex)[4];
				FeaturePointsView[index++] = FDP2D.getFPQuality(groupIndex, pointIndex)[5];
		    }
		}
	},

	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelVertexCount|_getFaceModelVertexCount} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceModelVertexCount__deps: ['trackerStatus'],
	
	/**
	* Number of vertices in the 3D face model. 
	* <br/>
	* This variable is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will be set to 0.
	* @return {Number} If tracker is tracking, returns vertex count, otherwise 0.
	* <br/>
	*/
	_getFaceModelVertexCount: function()
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined')
			return 0;
		
		var faceIndex = _firstTrackerStatusOK();
			
		if(faceIndex != -1)
			return faceDataArray.get(faceIndex).faceModelVertexCount;
		
		return 0;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelVertices|_getFaceModelVertices} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceModelVertices__deps: ['trackerStatus'],
	
	/**
	* Array of vertex coordinates of the 3D face model. 
	* <br/>
	* The coordinates are in the local coordinate system of the face, with the origin (0,0,0) placed at the center between the eyes. 
	* The x-axis points laterally towards the side of the face, y-axis points up and z-axis points into the face.
	* <br/>
	* Function returns vertices position in the vertexNumber*3-dimensional <i>vertices</i> array, where vertexNumber is value 
	* obtained from _getFaceModelVertexCount() function, for the particular faceIndex.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	//define MaxVertices value that will be larger than the real number of vertices
	*	public const int MaxVertices = 1024;
	*	private float[] vertices = new float[MaxVertices * 3];
	*	
	*	//call of _getFaceModelVertices() function
	*	 VisageTrackerNative._getFaceModelVertices(vertices, faceIndex);
	*	
	*
	* </code></pre>
	* @param {Array} vertices - array in which the values of vertex coordinates will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getFaceModelVertices: function(vertices, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined') // izbaciti -1 ili ne
			return;
			
		if(_trackerStatus[faceIndex] != 1)
			return;
		
		var faceData = faceDataArray.get(faceIndex);
		var faceModelVertices = faceData.getFaceModelVertices();
		var vertexNumber = faceData.faceModelVertexCount;
		
		var verticesArrayView = new Float32Array(unityGame.Module.buffer, vertices, vertexNumber*3);
		
		//get vertices
		for (var i = 0; i < vertexNumber*3; ++i)
		{
			verticesArrayView[i] = faceModelVertices[i];
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelVerticesProjected|_getFaceModelVerticesProjected} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceModelVerticesProjected__deps: ['trackerStatus'],
	
	/**
	* Array of projected (image space) vertex coordinates of the 3D face model. 
	* <br/>
	* The 2D coordinates are normalised to image size so that the lower left corner of the image has coordinates 0,0 and upper right corner 1,1.
	* <br/>
	* Function returns vertices position in the vertexNumber*2-dimensional <i>verticesProjected</i> array, where vertexNumber is value 
	* obtained from _getFaceModelVertexCount() function, for the particular faceIndex.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	//define MaxVertices value that will be larger than the real number of vertices
	*	public const int MaxVertices = 1024;
	*	private float[] verticesProjected = new float[MaxVertices * 2];
	*	
	*	//call of _getFaceModelVerticesProjected() function
	*	 VisageTrackerNative._getFaceModelVerticesProjected(verticesProjected, faceIndex);
	*
	* </code></pre>
	*
	* @param {Array} verticesProjected - array in which the values of projected vertex coordinates will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getFaceModelVerticesProjected: function(verticesProjected, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined') // izbaciti -1 ili ne
			return;
			
		if(_trackerStatus[faceIndex] != 1)
			return;
		
		var faceData = faceDataArray.get(faceIndex);
		var faceModelVerticesProjected = faceData.getFaceModelVerticesProjected();
		var vertexNumber = faceData.faceModelVertexCount;
		
		var verticesProjectedArray = new Float32Array(unityGame.Module.buffer, verticesProjected, vertexNumber*2);
				
		//get vertices projected
		for (var i = 0; i < vertexNumber*2; ++i)
		{
			verticesProjectedArray = faceModelVerticesProjected[i];
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelTriangleCount|_getFaceModelTriangleCount} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceModelTriangleCount__deps: ['trackerStatus'],
	
	/**
	* Number of triangles in the 3D face model. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK), otherwise it will be set to 0.
	* @return {Number} If tracker is tracking, returns triangle count, otherwise 0.
	* <br/>
	*/
	_getFaceModelTriangleCount: function()
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined')
			return 0;
		
		var faceIndex = _firstTrackerStatusOK();
			
		if(faceIndex != -1)
			return faceDataArray.get(faceIndex).faceModelTriangleCount;
		
		return 0;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelTriangles|_getFaceModelTriangles} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceModelTriangles__deps: ['trackerStatus'],
	
	/**
	* Triangles array for the 3D face model. 
	* <br/>
	* Each triangle is described by three indices into the list of vertices (see _getFaceModelVertices() function).
	* <br/>
	* Function returns triangles coordinates in the triangleNumber*3-dimensional <i>triangles</i> array, where triangleNumber is value 
	* obtained from _getFaceModelTriangleCount() function, for the particular faceIndex.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	//define MaxTriangles value that will be larger than the real number of triangles
	*	public const int MaxTriangles = 2048;
	*	private int[] triangles = new int[MaxTriangles * 3];
	*	
	*	//call of _getFaceModelTriangles() function
	*	VisageTrackerNative._getFaceModelTriangles(triangles, faceIndex);
	*	
	* </code></pre>
	* @param {Array} triangles - array in which values of triangle coordinates will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getFaceModelTriangles: function(triangles, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined') // izbaciti -1 ili ne
			return;
			
		if(_trackerStatus[faceIndex] != 1)
			return;
		
		var faceData = faceDataArray.get(faceIndex);
		var faceModelTriangles = faceData.getFaceModelTriangles();
		var triangleNumber = faceData.faceModelTriangleCount;
		
		var trianglesArray = new Int32Array(unityGame.Module.buffer, triangles, triangleNumber*3);
		
		for(var i = 0; i < triangleNumber * 3; i++)
		{
			trianglesArray[i] = faceModelTriangles[triangleNumber * 3 - 1 - i];	
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceModelTextureCoords|_getFaceModelTextureCoords} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter and 
	* {@link module:VisageTrackerUnityPlugin.mGetNearestPow2|mGetNearestPow2} function.
	* <br/>
	*/
	_getFaceModelTextureCoords__deps: ['mGetNearestPow2', 'trackerStatus'],
	
	/**
	* Texture coordinates for the 3D face model. 
	* A pair of u, v coordinates for each vertex.
	* <br/>
	* Function returns texture coordinates in the vertexNumber*2-dimensional <i>texCoord</i> array, where vertexNumber is value 
	* obtained from _getFaceModelVertices() function, for the particular faceIndex.
	* <br/>
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	//define MaxVertices value that will be larger than the real number of vertices
	*	public const int MaxVertices = 1024;
	*	private float[] texCoords = new float[MaxVertices * 2];
	*	
	*	//call of _getFaceModelTextureCoords() function
	*	VisageTrackerNative._getFaceModelTextureCoords(texCoord, faceIndex);
	*	
	* </code></pre>
	* @param {Array} texCoord - array in which values of texture coordinates will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getFaceModelTextureCoords: function(texCoord, faceIndex)
	{
		if(_trackerStatus[0] === 'undefined'  || typeof tracker === 'undefined')
			return;
			
		if(_trackerStatus[faceIndex] != 1)
			return;
		
		var faceData = faceDataArray.get(faceIndex);
		var faceModelTextureCoords = faceData.getFaceModelTextureCoords();
		var vertexNumber = faceData.faceModelVertexCount;
		
		var texCoordArray = new Float32Array(unityGame.Module.buffer, texCoord, vertexNumber*2);
		
		var mWidth = w;
		var mHeight = h;
		
		xTexScale = mWidth / _mGetNearestPow2(mWidth);
		yTexScale = mHeight / _mGetNearestPow2(mHeight);
		
		for (var i = 0; i < vertexN*2; i+=2) 
		{
			texCoordArray[i] = (1.0 - faceModelTextureCoords[i+0]) * xTexScale;
			texCoordArray[i] = faceModelTextureCoords[i+1] * yTexScale;
		}	
	},
	
	/**
	* Sets the inter pupillary distance. 
	*
	*/
	_setIPD: function(IPD)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		tracker.setIPD(IPD);	
	},
	
	/**
	* Returns the current inter pupillary distance (IPD) setting. 
	* @return {Number} Current setting of inter pupillary distance (IPD) in meters. 
	*/
	_getIPD: function()
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return 0;
		
		return tracker.getIPD();
	},
	
	/**
	* Sets tracking configuration. 
	* @param {string} trackerConfigFile - the name of the tracker configuration file. 
	* @param {boolean} au_fitting_disabled - disables the use of the 3D model used to estimate action units. If set to true, estimation of action units shall not be performed, and action units related data will not be available (_getActionUnits() etc.). Disabling will result in a small performance gain. 
	* @param {boolean} mesh_fitting_disabled - disables the use of the fine 3D mesh. If set to true, the 3D mesh shall not be fitted and the related information shall not be available (_getFaceModelVertices() etc.). Disabling will result in a small performance gain. 
	*/
	_setTrackerConfigurationFile: function(trackerConfigFile, au_fitting_disabled, mesh_fitting_disabled)
	{
		var config = UTF8ToString(trackerConfigFile);

		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined')
			return;
		
		setTrackerConfigurationFile(config, au_fitting_disabled, mesh_fitting_disabled)
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getTrackingQuality|_getTrackingQuality} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getTrackingQuality__deps: ['trackerStatus'],
	
	/**
	* Returns tracking quality level. 
	* <br/>
	* This variable is set while tracker is running. If tracking status is TRACK_STAT_OFF, the return value will be -1.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @return {Number} Estimated tracking quality level for the current frame. The value is between 0 and 1. 
	*/
	_getTrackingQuality: function(faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return -1;
			
		if(_trackerStatus[faceIndex]!=1)
			return -1;
	
			
		return faceDataArray.get(faceIndex).trackingQuality;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFrameRate|_getFrameRate} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFrameRate__deps: ['trackerStatus'],
	
	/**
	* Returns the frame rate of the tracker, in frames per second, measured over last 10 frames. 
	* <br/>
	* This variable is set while tracker is running. If tracking status is TRACK_STAT_OFF, the return value will be -1.
	* @return {Number} The frame rate of the tracker.
	*/
	_getFrameRate: function()
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return -1;
			
		return faceDataArray.get(0).frameRate;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getTimeStamp|_getTimeStamp} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getTimeStamp__deps: ['trackerStatus'],
	
	/**
	* Returns timestamp of the current video frame. 
	* <br/>
	* This variable is set while tracker is running. If tracking status is TRACK_STAT_OFF, the return value will be -1.
	* @return {number} Timestamp of the current video frame. 
	*/
	_getTimeStamp: function()
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return -1;
			
		return faceDataArray.get(0).timeStamp;
		
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin.firstTrackerStatusOK|firstTrackerStatusOK} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} and 
	* {@link module:VisageTrackerUnityPlugin.NUM_FACES|NUM_FACES} parameters.
	* <br/>
	*/
	firstTrackerStatusOK__deps:['trackerStatus', 'NUM_FACES'],
	
	/*
	* Returns the index of the first tracker with status TRACK_STAT_OK.
	*/
	firstTrackerStatusOK: function()
	{
		var index = -1;
		for (var i = 0; i<_NUM_FACES; ++i)
		{
			if (_trackerStatus[i] === 1)
			{
				index = i;
				break;
			}
		}
		return index;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getActionUnitCount|_getActionUnitCount} dependency on
	* {@link module:VisageTrackerUnityPlugin.firstTrackerStatusOK|firstTrackerStatusOK} function.
	* <br/>
	*/
	_getActionUnitCount__deps: ['firstTrackerStatusOK'],
	
	/**
	* Number of facial action units. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK) and only if au_fitting_model parameter in the configuration file is set (see VisageTracker Configuration Manual for details),  
	* otherwise it will be set to 0.
	* Number of action units that are defined for current face model. 
	* @return {Number} Number of action units.
	*/
	_getActionUnitCount: function()
	{
		var faceIndex = _firstTrackerStatusOK();
			
		if(faceIndex != -1)
			return faceDataArray.get(faceIndex).actionUnitCount;
		
		return 0;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getGazeQuality|_getGazeQuality} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getGazeQuality__deps: ['trackerStatus'],
	
	/**
	* The session level gaze tracking quality. 
	* Quality is returned as a value from 0 to 1, where 0 is the worst and 1 is the best quality. The quality is 0 also when the gaze tracking is off or calibrating. 
	* This variable is set while tracker is running. If tracking status for given faceIndex is TRACK_STAT_OFF, the return value will be -1.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @return {Number} Value from 0 to 1.
	*/
	_getGazeQuality: function(faceIndex)
	{
		if(_trackerStatus[0] === 'undefined' || typeof tracker === 'undefined') 
			return -1;
		
		if(_trackerStatus[faceIndex]!=1)
			return -1;
			
		return faceDataArray.get(faceIndex).gazeQuality;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getScreenSpaceGazeData|_getScreenSpaceGazeData} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getScreenSpaceGazeData__deps: ['trackerStatus'],

	/**
	* ScreenSpaceGazeData is a container structure used to hold the gaze point location, 
	* current state of screen space gaze tracking system and gaze tracking estimation quality parameters for the current frame. 
	* This class is used both to store the calibration points during the calibration phase and the estimation results during the estimation phase. 
	* ScreenSpaceGazeData will be returned in index, gaze, quality, inState parameters for the given faceIndex.
	* @param {Number} index - index of the video frame.
	* @param {Array} gaze - coordinates of screen space gaze normalized to screen width and height. 
	* x = 0 corresponds to the left-most point and 1 to the right-most points of the screen. Defaults to 0.5. 
	* y = 0 corresponds to the top-most point and 1 to the bottom-most points of the screen. Defaults to 0.5. 
	* @param {Number} quality - the frame level gaze tracking quality. 
	* @param {Number} inState - Flag indicating the state of the gaze estimator for the current frame. If inState is 0 the estimator is off and position is default. 
	* If inState is 1 the estimator is calibrating and returns calibration data for the current frame. 
	* If inState is 2 the estimator is estimating and returns the estimated screen space gaze coordinates. 	
	* If inState is -1 the estimator is calibrating but the tracking/screen space gaze estimation failed for the current frame (position is default) 
	* If inState is -2 the estimator is estimating but the tracking/screen space gaze estimation failed for the current frame (position is default) 
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getScreenSpaceGazeData: function(index, gaze, quality, inState, faceIndex)
	{	
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
		if(_trackerStatus[faceIndex]!=1)
			return;
		
		var faceData = faceDataArray.get(faceIndex)
		
		var indexView = new Int32Array(unityGame.Module.buffer, index, 1);
		var gazeView = new Float32Array(unityGame.Module.buffer, gaze, 2);
		var qualityView = new Float32Array(unityGame.Module.buffer, quality, 1);
		var inStateView = new Int32Array(unityGame.Module.buffer, inState, 1);
		
		indexView[0] = faceData.index;
		gazeView[0] = faceData.gazeData.x;
		gazeView[1] = faceData.gazeData.y;
		qualityView[0] = faceData.quality;
		inStateView[0] = faceData.inState;	
	},

	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getFaceScale|_getFaceScale} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getFaceScale__deps: ['trackerStatus'],
	
	/**
	* Scale of face bounding box. 
	* This variable is set while tracker is running. If tracking status for given faceIndex is TRACK_STAT_OFF, the return value will be -1.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @return {Number} Value between 0.0 and 1.0.
	*/
	_getFaceScale: function(faceIndex)
	{
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return -1;
		
		if(_trackerStatus[faceIndex]!=1)
			return -1;
			
		return faceDataArray.get(faceIndex).faceScale;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getEyeClosure|_getEyeClosure} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getEyeClosure__deps: ['trackerStatus'],
	
	/**
	* Returns discrete eye closure value. 
	* <br/>
	* Function returns eye closure value in the 2-dimensional <i>closure</i>.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	
	*	private int[] closure = new int[2];
	*	
	*	//call of _getEyeClosure() function
	*	 VisageTrackerNative._getEyeClosure(closure, faceIndex);
	*	
	*   
	* </code></pre>
	* @param {Array} closure - array in which the eye closure values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getEyeClosure: function(closure, faceIndex)
	{
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
		if(_trackerStatus[faceIndex]!=1)
			return;
		
		var faceData = faceDataArray.get(faceIndex)
		
		var closureView = new Float32Array(unityGame.Module.buffer, closure, 2);
		
		closureView[0] = faceData.getEyeClosure()[0];
		closureView[1] = faceData.getEyeClosure()[1];
	},
    
    /*
	* Declares {@link module:VisageTrackerUnityPlugin._getIrisRadius|_getIrisRadius} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getIrisRadius__deps: ['trackerStatus'],
	
	/**
	* Returns iris radius values in px for the given faceIndex. 
	* <br/>
	* Function returns iris radius value in the 2-dimensional <i>radius</i>.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	
	*	private float[] radius = new float[2];
	*	
	*	//call of _getIrisRadius() function
	*	 VisageTrackerNative._getIrisRadius(radius, faceIndex);
	*	
	*   
	* </code></pre>
	* @param {Array} radius - array in which the iris radius values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_getIrisRadius: function(radius, faceIndex)
	{
		var radiusView = new Float32Array(unityGame.Module.buffer, radius, 2);
		
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined' || _trackerStatus[faceIndex] != 1) 
		{
			radiusView[0] = -1;
			radiusView[1] = -1;
			return;
		}
		
		var faceData = faceDataArray.get(faceIndex);
		
		radiusView[0] = faceData.getIrisRadius()[0];
		radiusView[1] = faceData.getIrisRadius()[1];
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getActionUnitsNames|_getActionUnitsNames} dependency on
	* {@link module:VisageTrackerUnityPlugin.firstTrackerStatusOK|firstTrackerStatusOK} function and
	* {@link module:VisageTrackerUnityPlugin.NUM_NAMES|NUM_NAMES} parameter.
	* <br/>
	*/
	_getActionUnitsNames__deps: ['firstTrackerStatusOK', 'NUM_NAMES'],
	
	/**
	* Name of facial Action Unit at given index. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK) 
	* and only if au_fitting_model parameter in the configuration file is set (see VisageTracker Configuration Manual for details), 
	* otherwise the return value will be an empty string.
	* @param {Number} auIndex - index of specific action unit in the current tracker configuration.
	* @return {String} Name of the action unit for a given index according to the configuration used
	*/
	_getActionUnitsNames: function(auIndex)
	{
		var faceIndex = _firstTrackerStatusOK();
		
		if(faceIndex != -1 && auIndex <= faceDataArray.get(faceIndex).actionUnitCount && auIndex >= 0)
		{	
			nameList = faceDataArray.get(faceIndex).getActionUnitsNames();
			var nameString = nameList.get(auIndex)
			var bufferSize = lengthBytesUTF8(nameString) + 1;
			var buffer = _malloc(bufferSize);
			stringToUTF8(nameString, buffer, bufferSize);

			return buffer;
		}
		return "";
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getActionUnits|_getActionUnits} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getActionUnits__deps: ['trackerStatus'],
	
	/**
	* List of current values for facial action units, one value for each action unit. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK) and only if au_fitting_model parameter 
	* in the configuration file is set (see VisageTracker Configuration Manual for details).
	* The action units used by the tracker are defined in the 3D face model file.
	* <br/>
	* Function returns actionUnits values in the auCount-dimensional <i>actionUnits</i> array, where auCount is value 
	* obtained from _getActionUnitCount() function, for the particular faceIndex.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	//define auCount value that will be larger than the real number of action units
	*	public const int auCount = 1024;
	*	private float[] actionUnits = new float[AUCOUNT];
	*	
	*	//call of _getActionUnits() function
	*	 VisageTrackerNative._getActionUnits(actionUnits, faceIndex);
	*	
	* </code></pre>
	* @param {Array} actionUnits - array in which the action unit values will be stored.
	* @param {Number} faceIndex - Value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getActionUnits: function(actionUnits, faceIndex)
	{
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
		if(_trackerStatus[faceIndex]!=1)
			return;
		 	
		var faceData = faceDataArray.get(faceIndex);
		var auCount = faceData.actionUnitCount;
		
		var actionUnitsView = new Float32Array(unityGame.Module.buffer, actionUnits, auCount);
		
		for(var i = 0; i < auCount; ++i)
		{
			if (faceData.getActionUnitsNames().get(i).localeCompare("au_leye_closed") === 1)
			{
				leftIndex = i;
			}

			if (faceData.getActionUnitsNames().get(i).localeCompare("au_reye_closed") === 1)
			{
				rightIndex = i;
			}
			
			actionUnitsView[i] = faceData.getActionUnits()[i];
		}
		
		// if action units for eye closure are not used by the tracker, map eye closure values to them
		if (leftIndex >= 0 && faceData.getActionUnitsUsed()[leftIndex] == 0) {
			actionUnitsView[leftIndex] = faceData.getEyeClosure()[0];
		}
		if (rightIndex >= 0 && faceData.getActionUnitsUsed()[rightIndex] == 0) {
			actionUnitsView[rightIndex] = faceData.getEyeClosure()[1];
		}
		
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getActionUnitsUsed|_getActionUnitsUsed} dependency on
	* {@link module:VisageTrackerUnityPlugin.firstTrackerStatusOK|firstTrackerStatusOK} function.
	* <br/>
	*/
	_getActionUnitsUsed__deps: ['firstTrackerStatusOK'],
	
	/**
	* Used facial Action Units. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK) and only if au_fitting_model parameter in the configuration file 
	* is set (see VisageTracker Configuration Manual for details).
	* @param {Number} auIndex - index of specific action unit in the current tracker configuration.
	* @return {Boolean} True if action unit is used, false if action unit is not used. 
	* <br/>
	*/
	_getActionUnitsUsed: function(auIndex)
	{
		var faceIndex = _firstTrackerStatusOK();
	
		if(faceIndex != -1)
			return faceDataArray.get(faceIndex).getActionUnitsUsed()[auIndex] === 1;
		
		return false;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getGazeDirectionGlobal|_getGazeDirectionGlobal} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getGazeDirectionGlobal__deps: ['trackerStatus'],
	
	/**
	* Global gaze direction, taking into account both head pose and eye rotation. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK). 
	* This is the current estimated gaze direction relative to the camera axis. 
	* Direction is expressed with three values determining the rotations around the three axes x, y and z, i.e. pitch, yaw and roll. 
	* Values (0, 0, 0) correspond to the gaze direction parallel to the camera axis. 
	* Positive values for pitch correspond to gaze turning down. 
	* Positive values for yaw correspond to gaze turning right in the input image. 
	* Positive values for roll correspond to face rolling to the left in the input image, see illustration below. 
	* <br/>
	* The values are in radians. 
	* <br/>
	* Function returns gaze direction values in the 3-dimensional <i>gazeDirection</i> array.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	
	*	private float[] gazeDirection = new float[3];
	*	
	*	//call of _getGazeDirectionGlobal() function
	*	 VisageTrackerNative._getGazeDirectionGlobal(gazeDirection, faceIndex);
	*	
	* </code></pre>
	* @param {Array} gazeDirection - 3D array in which the gaze direction values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getGazeDirectionGlobal: function(gazeDirection, faceIndex)
	{
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
		if(_trackerStatus[faceIndex]!=1)
			return;
		 
		var gazeDirectionGlobalView = new Float32Array(unityGame.Module.buffer, gazeDirection, 3);
		
		for(var i = 0; i < 3; ++i)
		{
			gazeDirectionGlobalView[i] = faceDataArray.get(faceIndex).getGazeDirectionGlobal()[i];
		}		
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._getGazeDirection|_getGazeDirection} dependency on
	* {@link module:VisageTrackerUnityPlugin.trackerStatus|trackerStatus} parameter.
	* <br/>
	*/
	_getGazeDirection__deps: ['trackerStatus'],
	
	/**
	* Gaze direction. 
	* This variable is set only while tracker is tracking (TRACK_STAT_OK). 
	* This is the current estimated gaze direction relative to the person's head. 
	* Direction is expressed with two values x and y, in radians. Values (0, 0) correspond to person looking straight. 
	* X is the horizontal rotation with positive values corresponding to person looking to his/her left. 
	* <br/>
	* Y is the vertical rotation with positive values corresponding to person looking down. 
	* Function returns gaze direction values in the 2-dimensional <i>gazeDirection</i> array.
	* An example of use: 
	* <pre class="prettyprint source"><code>
	*	
	*	private float[] gazeDirection = new float[2];
	*	
	*	//call of _getGazeDirection() function
	*	 VisageTrackerNative._getGazeDirection(gazeDirection, faceIndex);
	*	
	* </code></pre>
	* @param {Array} gazeDirection - 2D array in which the gaze direction values will be stored.
	* @param {Number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* <br/>
	*/
	_getGazeDirection: function(gazeDirection, faceIndex)
	{
		if(_trackerStatus[faceIndex] === 'undefined' || typeof tracker === 'undefined') 
			return;
		
		if(_trackerStatus[faceIndex]!=1)
			return;
			
		var gazeDirectionView = new Float32Array(unityGame.Module.buffer, gazeDirection, 2);
		
		for(var i = 0; i < 2; ++i)
		{
			gazeDirectionView[i] = faceDataArray.get(faceIndex).getGazeDirection()[i];
		}
	}

};

mergeInto(LibraryManager.library, VisageTrackerUnityPlugin);

	
