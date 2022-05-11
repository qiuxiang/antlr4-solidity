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

export interface ParseResult {
  path: string;
  content: string;
}

export function parse(
  filename: string,
  content: string,
  options: ParseOptions
) {
  const files = <Record<string, ParseResult>>{};
  _parse(filename, content, { ...options }, files);
  return files;
}

export function _parse(
  filename: string,
  content: string,
  options: ParseOptions,
  files: Record<string, ParseResult>
): void {
  const dir = dirname(filename);
  const imports = <string[]>[];
  if (!files[filename]) {
    files[filename] = {
      path: getAbsoletePath(filename, options),
      content,
    };
  }

  const lexer = new SolidityLexer(CharStreams.fromString(content));
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
      const filename = importPath.match(/\.\.?\//)
        ? join(dir, importPath)
        : importPath;
      if (!files[filename]) {
        const [path, content] = importer(filename, options);
        files[filename] = { path, content };
        _parse(filename, content, options, files);
      }
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
    return isAbsolute(includePath)
      ? join(includePath, path)
      : join(basePath, includePath, path);
  }

  return path;
}
