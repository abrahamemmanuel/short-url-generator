import path from "path";
import { format } from "util";

import fs from "fs/promises";
import { snakeCase } from "lodash";

const defaultIndex = "0000";

async function main() {
  if (process.argv.length === 2) {
    throw new Error("Usage: migration <title>");
  }

  const title = snakeCase(process.argv[2]);

  await printf("Generating index for %s...", title);
  const basePath = path.join(process.cwd(), "/db/migrations");
  const index = await generateIndex(basePath);
  await printf("%s\n", index);

  const up = `${index}.do.${title}.sql`;
  const down = `${index}.undo.${title}.sql`;

  const template = "begin;\ncommit;";
  await fs.mkdir(basePath, { recursive: true });

  printf("Creating %s...\n", up);
  await fs.writeFile(path.join(basePath, up), template, { flag: "wx" });

  printf("Creating %s...\n", down);
  await fs.writeFile(path.join(basePath, down), template, { flag: "wx" });
}

function printf(template: string, ...args: any[]) {
  const message = format(template, ...args);
  return new Promise<void>((resolve, reject) => {
    process.stdout.write(message, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function generateIndex(path: string) {
  const migrations = await fs.readdir(path);
  const latestMigration = migrations[migrations.length - 1] ?? defaultIndex;
  const lastIndex = Number(latestMigration.split(".")[0]);
  return String(lastIndex + 1).padStart(4, "0");
}

main().then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  }
);
