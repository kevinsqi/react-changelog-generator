#!/usr/bin/env node
const { spawn } = require("child_process");
const program = require("commander");

const React = require("react");
const ReactDOMServer = require("react-dom/server");

// Simple util for calling a child process
function cmd(string, onProgress) {
  const [cmd, ...args] = string.trim().split(" ");
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    let data = "";

    child.stdout.on("data", buffer => {
      data += buffer.toString();
      if (onProgress) {
        onProgress(data.length);
      }
    });
    child.stdout.on("end", () => resolve(data));
    child.on("error", reject);
  });
}

async function generateChangelogJSON() {
  const jsonStr = await cmd(
    `auto-changelog --template json --stdout --commit-limit false`
  );
  return JSON.parse(jsonStr);
}

function getOptions(argv) {
  return program
    .option("-f, --file <file>", "React component file")
    .parse(argv);
}

generateChangelogJSON()
  .then(json => {
    const options = getOptions(process.argv);
    const ChangelogComponent = require(options.file);
    console.log(
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(ChangelogComponent, { changelog: json })
      )
    );
  })
  .catch(error => {
    console.error(error);
  });
