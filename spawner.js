const { spawn } = require("child_process");

function launchProcess() {
  const childProcess = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "./starter.js"],
    {
      cwd: __dirname,
      stdio: "inherit",
      env: {
        ...process.env,
      },
    },
  );

  childProcess.on("close", (exitCode) => {
    if (exitCode === 3) {
      console.log(
        `API server process exited with code ${exitCode}. Restarting...`,
      );
      launchProcess();
    }
  });

  childProcess.on("error", (error) => {
    console.error(`Error with child process: ${error}`);
  });
}

async function startApp() {
  launchProcess();
}

startApp();
