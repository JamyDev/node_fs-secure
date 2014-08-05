var fse     = require("fs-extra"),
    fork    = require("child_process").fork,
    fss     = {};

Object.keys(fse).forEach(function (key) {
    var fn = fse[key];
    if (fn instanceof Function) {
        fss[key] = function () {
            var args = Array.prototype.slice.call(arguments),
                uid,
                gid,
                env;
            // Does it contain the 2 magic numbers that we call the uid and gid
            console.log(args)
            if (key.toLowerCase().indexOf("sync") > -1) {
                if (args.length > 2 && typeof args[args.length - 1] === "number" && typeof args[args.length - 2] === "number") {
                    uid = args[args.length - 1];
                    gid = args[args.length - 2];
                    env = {uid: uid, gid: gid, method: key, arguments: args.splice(args.length - 2, 2)};
                } else {

                }
            } else {
                if (args.length > 3 && typeof args[args.length - 2] === "number" && typeof args[args.length - 3] === "number") {
                    uid = args[args.length - 2];
                    gid = args[args.length - 3];
                    env = {uid: uid, gid: gid, method: key, arguments: args.splice(args.length - 3, 2)};
                    var child = fork("./execFSE.js", [], {env: env, uid: uid, gid: gid});
                } else {
                    fse[key].apply(this, args);
                }
            }

        };
    }
});

module.exports = fss;