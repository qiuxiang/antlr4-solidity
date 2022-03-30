import { CharStreams, CommonTokenStream, ParserRuleContext } from "antlr4ts";
import { ParseTreeListener, ParseTreeWalker } from "antlr4ts/tree";
import { SolidityLexer, SolidityParser, SolidityParserListener } from "..";
import { ImportDirectiveContext } from "../dist/SolidityParser";

interface ParseOptions {
  basePath?: string;
  includePath?: string;
  remapping?: Record<string, string>;
  import?: (path: string) => string;
}

interface ParseResult {
  imports: string[];
}

export function parse(source: string, options: ParseOptions = {}) {
  const lexer = new SolidityLexer(CharStreams.fromString(source));
  const parser = new SolidityParser(new CommonTokenStream(lexer));

  const imports = <string[]>[];

  class Listener implements SolidityParserListener {
    enterImportDirective(context: ImportDirectiveContext) {
      imports.push(context.path()?.text ?? "");
    }

    enterEveryRule(context: ParserRuleContext) {
      console.log(context.start.tokenIndex);
      console.log(
        context.start.startIndex,
        context.stop?.stopIndex,
        context.text
      );
    }
  }

  const listener = <ParseTreeListener>new Listener();
  ParseTreeWalker.DEFAULT.walk(listener, parser.sourceUnit());

  return { imports };
}

export function defaultImport(path: string) {
  return path;
}
