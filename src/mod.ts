import { parseArgs } from "@std/cli";

const args = parseArgs(Deno.args);
const command = args["_"][0];
if (typeof command !== "string") {
  console.error("No command provided");
  Deno.exit(1);
}

const commandList = Deno.readDir("./src");
const commands = [];
for await (const command of commandList) {
  if (command.isDirectory) {
    commands.push(command.name);
  }
}

if (!commands.includes(command)) {
  console.error(`Command '${command}' not found`);
  Deno.exit(1);
}

const commandPath = `./${command}/main.ts`;
const commandModule = await import(commandPath);
commandModule.main();
