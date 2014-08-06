var fse = require("fs-extra");

var ret;

if (!process.env.uid ||
    !process.env.gid ||
    !process.env.method ||
    !process.env.arguments)
{
    ret = ["One or more env args not set!"];
    process.send(JSON.stringify(ret));
    process.exit(1);
}

if (process.getuid() !== parseInt(process.env.uid, 10) || process.getgid() !== parseInt(process.env.gid, 10)) {
    ret = ["Runtime uid or gid doesn't match."];
    process.send(JSON.stringify(ret));
    process.exit(1);
}

if (fse[process.env.method] instanceof Function) {
    var args = JSON.parse(process.env.arguments);
    args.push(function () {
        // Doneski here
        ret = Array.prototype.slice.call(arguments).map(function (elem) {
            if (elem instanceof Buffer)
                return elem.toString("utf8");
            else
                return elem;
        });
        process.send(JSON.stringify(ret));
    });
    fse[process.env.method].apply(this, args);
} else {
    process.exit(1);
}