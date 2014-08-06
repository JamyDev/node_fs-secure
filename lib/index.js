var fse     = require("fs-extra"),
    path    = require("path"),
    _       = require("lodash"),
    fork    = require("child_process").fork,
    fss     = {};

var excludes = ["FileReadStream", "FileWriteStream", "ReadStream", "Stats", "SyncWriteStream", "WriteStream", "createReadStream", "createReadStream", "stat", "lstat", "fstat" , "readFile", "readJSON", "readJson", "watch", "watchFile"];

Object.keys(fse).forEach(function (key) {
    var fn = fse[key];
    if (fn instanceof Function && key.toLowerCase().indexOf("sync") === -1) {
        fss[key] = function () {
            var $this   = this,
                args    = Array.prototype.slice.call(arguments),
                uid,
                gid,
                env;
            // Does it contain the 2 magic numbers that we call the uid and gid
            fse[key].apply($this, args);
            if (args.length > 2 && _.isObject(args[args.length - 2]) && _.isNumber(args[args.length - 2].uid) && _.isNumber(args[args.length - 2].gid)) {
                uid = args[args.length - 2].uid;
                gid = args[args.length - 2].gid;

                args.splice(args.length - 2, 1);

                var callback = args.pop();
                env = {uid: uid, gid: gid, method: key, arguments: JSON.stringify(args)};
                var child = fork(path.join(__dirname, "execFSE.js"), [], {env: env, uid: uid, gid: gid, cwd: process.cwd()});

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
    } else {
        fss[key] = fse[key];
    }
});


// overwrite special methods that don't need security
excludes.forEach(function (ex) {
    fss[ex] = fse[ex];
});

module.exports = fss;