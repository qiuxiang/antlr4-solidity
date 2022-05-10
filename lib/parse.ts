import { CharStreams, CommonTokenStream } from "antlr4ts";
import { ParseTreeListener, ParseTreeWalker } from "antlr4ts/tree";
import { existsSync, readFileSync } from "fs";
import { dirname, isAbsolute, join } from "path";
import { SolidityLexer, SolidityParser, SolidityParserListener } from "..";
import { ImportDirectiveContext } from "./SolidityParser";

export interface ParseOptions {
  basePath: string;
  includePath?: string;
  remapping?: Record<string, string>;
  import?: (path: string, options: ParseOptions) => [string, string];
}

export function parse(
  sourcePath: string,
  source: string,
  options: ParseOptions
) {
  const sources = <Record<string, string>>{};
  _parse(sourcePath, source, { ...options }, sources);
  return { sources };
}

export function _parse(
  sourcePath: string,
  source: string,
  options: ParseOptions,
  sources: Record<string, string>
): void {
  const imports = <string[]>[];
  sources[sourcePath] = source;

  const lexer = new SolidityLexer(CharStreams.fromString(source));
  const parser = new SolidityParser(new CommonTokenStream(lexer));

  class Listener implements SolidityParserListener {
    enterImportDirective(context: ImportDirectiveContext) {
      const path = context.path()?.text ?? "";
      imports.push(path.replace(/['"]/g, ""));
    }
  }

  const listener = <ParseTreeListener>new Listener();
  ParseTreeWalker.DEFAULT.walk(listener, parser.sourceUnit());

  const importer = options.import ?? defaultImporter;
  for (const importPath of imports) {
    try {
      const path = importPath.match(/\.\.?\//)
        ? join(dirname(sourcePath), importPath)
        : importPath;
      const [_, source] = importer(path, options);
      _parse(path, source, options, sources);
    } catch (_) {}
  }
}

export function defaultImporter(path: string, options: ParseOptions) {
  const absolutePath = getAbsoletePath(path, options);
  return [absolutePath, readFileSync(absolutePath).toString()];
}

export function getAbsoletePath(path: string, options: ParseOptions) {
  const { basePath, includePath, remapping = {} } = options;

  for (const key in remapping) {
    if (path.startsWith(key)) {
      path = path.replace(new RegExp(`^${key}`), remapping[key]);
      break;
    }
  }

  if (isAbsolute(path)) {
    return path;
  }

  let absolutePath = join(basePath, path);
  if (existsSync(absolutePath)) {
    return absolutePath;
  }

  if (includePath) {
    return (absolutePath = join(includePath, path));
  }

  return path;
}
