#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const argv = require("yargs")
  .command(
    "[version]",
    "Updates the version of all package.json files",
    yargs => {
      yargs.positional("version", {
        describe: "version to update to"
      });
    }
  )
  .option("dir", {
    alias: "d",
    description: "The root directory to start the search"
  })
  .example("$0 1.1.2", "Increments the version in all package.jsons to 1.1.2")
  .help()
  .alias("h", "help").argv;

// const argv = require("yargs")
//   .usage("Usage: $0 <command> [options]")
//   .command("increment", "Increment the version in all package.json files")
//   .example(
//     "$0 increment -v 1.1.2",
//     "Update the version in all package.jsons to 1.1.2"
//   )
//   .alias("v", "version")
//   .nargs("v", 1)
//   .describe("v", "Version you are updating to")
//   .demandOption(["v"])
//   .help("h")
//   .alias("h", "help").argv;

// console.log(argv);

const findFiles = (root, filename, exclude, fn) => {
  if (!fs.existsSync(root)) {
    console.error(`The directory ${root} doesn't exist`);
    return -1;
  }

  const files = fs.readdirSync(root);
  files.forEach(file => {
    const filePath = path.join(root, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      const indx =
        filePath.lastIndexOf("\\") == -1 ? 0 : filePath.lastIndexOf("\\") + 1;
      const tld = filePath.substring(indx, filePath.length);
      if (!exclude.includes(tld)) {
        findFiles(filePath, filename, exclude, fn);
      }
    } else {
      if (filePath.includes(filename)) {
        fn(filePath);
      }
    }
  });
};

const root = argv.dir ? argv.dir : "./";
const exclude = [".git", "node_modules", "release", "dist"];
findFiles(root, "package.json", exclude, path => {
  let content = JSON.parse(fs.readFileSync(path, "utf-8"));
  content.version = argv._[0];
  fs.writeFileSync(path, JSON.stringify(content));
});
