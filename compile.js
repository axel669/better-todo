console.log("loading libs...");

// console.log(args);
// return;

var browserify = require("browserify");
var babelify = require("babelify");
// var stringify = require("stringify");
var fs = require("fs");

var footer = "\nconsole.log('Build Time: ', '" + (new Date()).toString() + "');";

var babelTransform = [
    [
        babelify,
        {
            loose: 'all',
            stage: 0,
            optional: 'runtime',
            blacklist: "flow",
            compact: false,
            ignore: /(lib|node_modules|external)\/.*/
        }
    ],
    [
        'stringify',
        {
            extensions: ['.txt', '.html', '.source']
        }
    ]
];

var settings = {
    entries: ["./source/main.js"],
    debug: true,
    paths: ['./source'],
    transform: babelTransform,
    extensions: [".js"]
};

var compiler = browserify(settings);
console.log("compiling code...");
compiler.bundle(function (err, buffer) {
    if (err !== null) {
        return;
    }

    console.log("saving compiled code...");
    // buffer.write(footer);
    // var outputFile = args.dest + ".js";
    fs.writeFile(
        "app.js",
        buffer,
        {encoding: 'utf8'},
        function () {
            fs.appendFile("app.js", footer, {encoding: 'utf8'});
            console.log("Finished at", new Date());
        }
    );
}).on(
    'error',
    function (error) {
        console.log(error.toString());
    }
);
