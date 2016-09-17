/**
 * Script for build the html files from sources.
 */

const fs = require("fs");
const path = require("path");
const clc = require('cli-color');
const glob = require("glob");
const handlebars = require("handlebars");
const sass = require("node-sass");

// Setup
//------------------------------------------------------------------------------

const data = require("../data.json");
const dist = path.normalize(__dirname + "/../dist/");
const src = path.normalize(__dirname + "/../src/");

/**
 * Converts the templates to html
 * @param {string} file - Path of a *handlebars* template file
 */
function make(file) {
  fs.readFile(file, "utf-8", function(err, src) {
    if (err) { throw err; }

    let template = null;
    let html = "";
    let outfile = path.normalize(
      path.format({
        dir: dist,
        name: path.parse(file)["name"],
        ext: ".html"
      })
    );

    template = handlebars.compile(src);
    html = template(data);

    fs.writeFile(outfile, html, function(err) {
      if (err) {
        console.error(clc.red("✘", outfile));
        console.error(clc.italic("⮑", err.message));
      } else {
        console.log(clc.green("✔", outfile));
      }
    });

  });
}

// Make it
//------------------------------------------------------------------------------

glob(src + "partials/*.hbs", {}, function(err, files) {
  if (err) { throw err; }

  // Prepares the partials
  files.forEach(function(file) {
    let partialContent = fs.readFileSync(file);
    if (partialContent) {
      handlebars.registerPartial(
        path.parse(file)["name"],
        partialContent.toString()
      );
      console.log(clc.cyan("✔ [partial]", file));
    } else {
      console.log(clc.red("✔ [partial]", file));
    }
  });

  glob(src + "*.hbs", {}, function(err, files) {
    if (err) { throw err; }
    files.forEach(function(file) {
      make(file);
    });
  });

});

// Stylesheets
const cssOutfile = dist + "styles.css"

sass.render({
  file: src + "styles.scss",
  options: {
    outputStyle: "compressed"
  }
}, function(err, result) {
  if (err) { throw err; }

    template = handlebars.compile(src);
    html = template(data);

    fs.writeFile(cssOutfile, result.css, function(err) {
      if (err) {
        console.error(clc.red("✘", cssOutfile));
        console.error(clc.italic("⮑", err.message));
      } else {
        console.log(clc.yellow("✔", cssOutfile));
      }
    });

});
