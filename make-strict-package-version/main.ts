async function main() {
  const path = "./package.json";
  const packageJson = await Deno.readTextFile(path).then((text) =>
    JSON.parse(text)
  );
  await makeStrict(packageJson, "dependencies");
  await makeStrict(packageJson, "devDependencies");
  Deno.writeTextFile(path, JSON.stringify(packageJson, null, 2));
}

type DepKind = "dependencies" | "devDependencies";

async function makeStrict(
  packageJson: { [key in DepKind]: { [key: string]: string } },
  depKind: DepKind
) {
  const dep = { ...packageJson[depKind] };
  for (const key in dep) {
    const p = await Deno.readTextFile(
      `./node_modules/${key}/package.json`
    ).then((text) => JSON.parse(text));
    packageJson[depKind][key] = p.version;
  }
}

main();
