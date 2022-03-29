import { CharStreams, CommonTokenStream } from "antlr4ts";
import { ParseTreeListener, ParseTreeWalker } from "antlr4ts/tree";
import {
  ContractDefinitionContext,
  SolidityLexer,
  SolidityParser,
  SolidityParserListener,
} from "..";

interface ParseOptions {
  basePath?: string;
  includePath?: string;
  remapping?: Record<string, string>;
  import?: (path: string) => string;
}

export function parse(source: string, options: ParseOptions = {}) {
  const lexer = new SolidityLexer(CharStreams.fromString(source));
  const parser = new SolidityParser(new CommonTokenStream(lexer));

  class Listener implements SolidityParserListener {
    enterContractDefinition(context: ContractDefinitionContext) {}
  }

  const listener = <ParseTreeListener>new Listener();
  ParseTreeWalker.DEFAULT.walk(listener, parser.sourceUnit());
}

export function defaultImport(path: string) {
  return path;
}
