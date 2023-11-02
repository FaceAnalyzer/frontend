licenseName = "728-647-708-712-368-939-525-416-088-305-748.vlc"
licenseURL = "728-647-708-712-368-939-525-416-088-305-748.vlc"

var locateFile = function(dataFileName) {let relativePath = "lib/" + dataFileName; return relativePath};

VisageModule = {
    locateFile: locateFile,

    preRun: [function() {
        VisageModule.FS_createPreloadedFile('/', 'NeuralNet.cfg', "lib/NeuralNet.cfg", true, false);
        VisageModule.FS_createPreloadedFile('/', 'Head Tracker.cfg', "lib/Head Tracker.cfg", true, false);
        VisageModule.FS_createPreloadedFile('/', licenseName, licenseURL, true, false, function(){ },  function(){ alert("Loading License Failed!") });

    }]
}