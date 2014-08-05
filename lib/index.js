var fse     = require("fs-extra"),
    path    = require("path"),
    fork    = require("child_process").fork,
    fss     = {};

Object.keys(fse).forEach(function (key) {
    var fn = fse[key];
    if (fn instanceof Function) {
        fss[key] = function () {
            var $this   = this,
                args    = Array.prototype.slice.call(arguments),
                uid,
                gid,
                env;
            // Does it contain the 2 magic numbers that we call the uid and gid
            console.log(args)
            if (key.toLowerCase().indexOf("sync") > -1) {
                fse[key].apply($this, args);
            } else {
                if (args.length > 3 && typeof args[args.length - 2] === "number" && typeof args[args.length - 3] === "number") {
                    uid = args[args.length - 2];
                    gid = args[args.length - 3];

                    args.splice(args.length - 3, 2);

                    var callback = args.pop();
                    env = {uid: uid, gid: gid, method: key, arguments: JSON.stringify(args)};
                    var child = fork(path.join(__dirname, "execFSE.js"), [], {env: env, uid: uid, gid: gid, cwd: process.cwd()});

                    var resultArgs = [];

                    child.on("message", function (data) {
                        console.log(data)
                    })

                    child.on("exit", function () {
                        callback.apply($this, resultArgs);
                    })
                } else {
                    fse[key].apply($this, args);
                }
            }

        };
    }
});

module.exports = fss;