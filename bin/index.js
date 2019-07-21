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

function Changelog(props) {
  return React.createElement("div", {}, "hello world");
}

function getOptions(argv) {
  return program.option("-c, --component", "React component file").parse();
}

generateChangelogJSON()
  .then(json => {
    console.log(json);
    console.log(getOptions(process.argv));
    console.log(
      ReactDOMServer.renderToStaticMarkup(React.createElement(Changelog))
    );
  })
  .catch(error => {
    console.error(error);
  });
