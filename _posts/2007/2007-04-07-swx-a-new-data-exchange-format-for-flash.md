# SWX - A new data exchange format for Flash

<a href="http://swxformat.org/">SWX</a> is designed to provide Flash developers with a simple and enjoyable experience when building data-driven applications. The key words here are simple, enjoyable and experience. SWX is compatible with Flash 6 r65+ to Flash 8 (ActionScript 1 and ActionScript 2). On the server-side, it has been tested and works well with PHP 5. At the time of its alpha release, SWX does not support ActionScript 3 and Flash 9.

At the core of SWX is a SWF assembler (SwfCompiler.php) that creates SWX SWF files from PHP data structures. (Currently, only PHP is supported) and a SWX gateway (swx.php) that acts as a front controller for data requests. On the client side, SWX serializes any data to be sent to the back-end using the native object notation for the back-end. Currently, there is support for PHP with PHON (PHP Object Notation).

PHON is a new data format. It stands for PHP Object Notation. It is based on JSON (JavaScript Object Notation) by Douglas Crockford. Basically, it is a native PHP data structure. PHON is a very limited subset of PHP.