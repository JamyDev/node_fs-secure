var fse = require("fs-extra");

if (!process.env.uid ||
    !process.env.gid ||
    !process.env.method ||
    !process.env.arguments)
{
    console.error("[fs-secure] One or more env args not set!");
    process.exit(1);
}

if (process.getuid() !== parseInt(process.env.uid, 10) || process.getgid() !== parseInt(process.env.gid, 10)) {
    console.error("[fs-secure] Runtime uid or gid doesn't match.");
    process.exit(1);
}

if (fse[process.env.method] instanceof Function) {
    var args = JSON.parse(process.env.arguments);
    args.push(function () {
        // Doneski here
        var args = Array.prototype.slice.call(arguments).map(function (elem) {
            if (elem instanceof Buffer)
                return elem.toString("utf8");
            else
                return elem;
        });
        process.send(JSON.stringify(args));
    });
    fse[process.env.method].apply(this, args);
} else {
    process.exit(1);
}