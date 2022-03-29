import { CharStreams, CommonTokenStream } from "antlr4ts";
import { ParseTreeListener, ParseTreeWalker } from "antlr4ts/tree";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import {
  ContractDefinitionContext,
  SolidityLexer,
  SolidityParser,
  SolidityParserListener,
  SolidityParserVisitor,
} from "..";

const input = `
contract test is S {
  // comment
  function f() {
    msg();
  }
}`;

it("visitor", () => {
  const lexer = new SolidityLexer(CharStreams.fromString(input));
  const parser = new SolidityParser(new CommonTokenStream(lexer));

  class Visitor
    extends AbstractParseTreeVisitor<void>
    implements SolidityParserVisitor<void>
  {
    protected defaultResult() {}

    visitContractDefinition(ctx: ContractDefinitionContext) {
      expect(ctx.identifier().text).toBe("test");
    }
  }

  new Visitor().visit(parser.sourceUnit());
});

it("listener", () => {
  const lexer = new SolidityLexer(CharStreams.fromString(input));
  const parser = new SolidityParser(new CommonTokenStream(lexer));

  class Listener implements SolidityParserListener {
    enterContractDefinition(ctx: ContractDefinitionContext) {
      expect(ctx.identifier().text).toBe("test");
    }
  }

  const listener = <ParseTreeListener>new Listener();
  ParseTreeWalker.DEFAULT.walk(listener, parser.sourceUnit());
});
