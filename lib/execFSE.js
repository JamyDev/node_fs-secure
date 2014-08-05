var fse = require("fs-extra");

console.log(process.env, process.getuid())

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
    });
    fse[process.env.method].apply(this, args);
} else {
    process.exit(1);
}