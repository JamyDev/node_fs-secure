# FS-Secure

This is a drop in replacement for the fs or fs-extra module that implements execution based on the userid and groupid.

The API is completely backwards compatible so it can just be used in any project.

Only methods that return JSON primitives are implemented, so fs.readFile for example will not run under a selected user, as this returns a Buffer. Sync methods are not supported either.

For a comprehensive list check the excludes array in lib/index.js.

# Usage

When calling a filesystem method you can add an object containing the uid and gid of the user you want to execute the method with.

As an example, here it writes a file to the filesystem under the uid and gid of 1000:

> fs.writeFile("file.txt", "contents", {uid: 1000, gid: 1000}, callback);

Obviously the user needs write access to the selected folder in this case.

# License

Copyright (c) 2014, Jamy Timmermans <me@jamy.be>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.