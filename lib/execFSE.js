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

if (process.getuid() !== process.env.uid || process.getgid() !== process.env.gid) {
    console.error("[fs-secure] Runtime uid or gid doesn't match.");
    process.exit(1);
}

if (fse[process.env.method] instanceof Function) {
    process.env.arguments.push(function () {
        // Doneski here
    });
    fse[process.env.method].apply(this, process.env.arguments);
} else {
    process.exit(1);
}