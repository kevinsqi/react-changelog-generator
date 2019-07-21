#!/usr/bin/env node
const { spawn } = require("child_process");
const program = require("commander");
const path = require("path");

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

const templatePath = path.join(__dirname, "changelog.hbs");

cmd(
  `auto-changelog --template ${templatePath} --stdout --commit-limit false`
).then(output => console.log(output));
