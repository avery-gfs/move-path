#!/usr/bin/env node

import process from "node:process";
import { existsSync } from "node:fs";
import { lstat, rename } from "node:fs/promises";

import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  parse,
  resolve,
} from "node:path";

async function buildTarget(source, target) {
  const isDirPath = target.endsWith("/") || target.endsWith("\\");

  const resolved = isAbsolute(target)
    ? resolve(target)
    : resolve(dirname(source), target);

  if (!existsSync(dirname(resolved))) {
    throw new Error(`mvp: target path does not exist: ${dirname(resolved)}`);
  }

  if (isDirPath && !existsSync(resolved)) {
    throw new Error(`mvp: target path does not exist: ${resolved}`);
  }

  if (existsSync(resolved)) {
    const isDir = (await lstat(resolved))?.isDirectory();

    if (isDirPath || isDir) {
      return join(resolved, basename(source));
    }
  }

  const sourceExt = extname(source);

  if (sourceExt && !extname(resolved)) {
    const { dir, name } = parse(resolved);
    return join(dir, name + sourceExt);
  }

  return resolved;
}

async function main() {
  if (process.argv.length !== 4) {
    throw new Error("Usage: mvp <source> <new name (optional file ext and relative path)>");
  }

  let [source, target] = process.argv.slice(2);
  source = resolve(source);

  if (!existsSync(source)) {
    throw new Error(`mvp: source does not exist: ${source}`);
  }

  target = await buildTarget(source, target);

  if (existsSync(target)) {
    throw new Error(`mvp: target already exists: ${target}`);
  }

  if (source === target) {
    throw new Error(`mvp: source and target are the same: ${source}`);
  }

  await rename(source, target);
  return target;
}

try {
  console.log(await main());
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
