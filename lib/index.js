var fse     = require("fs-extra"),
    path    = require("path"),
    _       = require("lodash"),
    fork    = require("child_process").fork,
    fss     = {};

var excludes = ["FileReadStream", "FileWriteStream", "ReadStream", "Stats", "SyncWriteStream", "WriteStream", "createReadStream", "createWriteStream", "stat", "lstat", "fstat" , "readFile", "readJSON", "readJson", "watch", "watchFile"];

Object.keys(fse).filter(function (key) {
    return (fse[key] instanceof Function && key.indexOf("Sync") === -1 && excludes.indexOf(key) === -1);
}).forEach(function (key) {
    var fn = fse[key];
    fss[key] = function () {
        var $this   = this,
            args    = Array.prototype.slice.call(arguments),
            uid,
            gid,
            env;
        // Does it contain the 2 magic numbers that we call the uid and gid
        if (args.length > 2 && _.isObject(args[args.length - 2]) && _.isNumber(args[args.length - 2].uid) && _.isNumber(args[args.length - 2].gid)) {
            uid = args[args.length - 2].uid;
            gid = args[args.length - 2].gid;

            args.splice(args.length - 2, 1);

            var callback = args.pop();
            env = {uid: uid, gid: gid, method: key, arguments: JSON.stringify(args)};
            var child = fork("/tmp/execFSE.js", [], {env: env, uid: uid, gid: gid, cwd: process.cwd()});

            var resultArgs = [];

            child.on("message", function (data) {
                resultArgs = JSON.parse(data);
            });

            child.on("exit", function () {
                callback.apply($this, resultArgs);
            });
        } else {
            fse[key].apply($this, args);
        }
    };
});

// Add excluded methods back
Object.keys(fse).filter(function (key) {
    return !(fse[key] instanceof Function && key.indexOf("Sync") === -1 && excludes.indexOf(key) === -1);
}).forEach(function (key) {
    fss[key] = fse[key];
});

if (process.platform === "win32") {
    fss = fse;
} else {
    fse.copySync(path.join(__dirname, "execFSE.js"), "/tmp/execFSE.js");
    fse.chownSync("/tmp/execFSE.js", 0755);
}

module.exports = fss;