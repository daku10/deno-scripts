import baseTsconfig from "./tsconfig.json" with { type: "json" };
import { exists } from "@std/fs";

export async function main() {
  // TODO: can choose path
  const path = "./tsconfig.json";
  const fileExists = await exists(path);
  const tsconfigJson = fileExists
    ? await Deno.readTextFile(path).then((text) => JSON.parse(text))
    : {};
  merge(tsconfigJson, baseTsconfig);
  Deno.writeTextFile(path, JSON.stringify(tsconfigJson, null, 2));
}

type TsConfigJson = Record<string, unknown>;

function merge(target: TsConfigJson, source: TsConfigJson) {
  for (const key in source) {
    if (source[key] instanceof Object) {
      if (!target[key]) {
        Object.assign(target, { [key]: source[key] });
      } else {
        merge(target[key] as TsConfigJson, source[key] as TsConfigJson);
      }
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
}
