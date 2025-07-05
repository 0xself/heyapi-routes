import ts from "typescript";
import type { RoutesPlugin } from "./types";

export const handler: RoutesPlugin["Handler"] = ({ plugin }) => {
  const file = plugin.createFile({
    id: plugin.name,
    path: plugin.output,
  });

  const entries: Array<{ key: string; path: string; method: string }> = [];

  plugin.forEach("operation", ({ operation }) => {
    if (!operation.operationId) {
      return;
    }

    entries.push({
      key: operation.operationId,
      path: operation.path,
      method: operation.method,
    });
  });

  const props = entries.map(({ key, path, method }) => {
    const paramNames = Array.from(path.matchAll(/\{(\w+)\}/g), (m) => m[1]);

    let valueExpression: ts.Expression;

    if (paramNames.length > 0) {
      const params = paramNames.map((name) =>
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          ts.factory.createIdentifier(name),
          undefined,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
          undefined
        )
      );

      const [head, ...tails] = path.split(/\{\w+?\}/g);
      const spans = tails.map((text, i) =>
        ts.factory.createTemplateSpan(
          ts.factory.createIdentifier(paramNames[i]),
          ts.factory.createTemplateTail(text)
        )
      );
      const template = ts.factory.createTemplateExpression(
        ts.factory.createTemplateHead(head),
        spans
      );

      const returnObject = ts.factory.createObjectLiteralExpression(
        [
          ts.factory.createPropertyAssignment("url", template),
          ts.factory.createPropertyAssignment(
            "method",
            ts.factory.createStringLiteral(method)
          ),
        ],
        true
      );

      valueExpression = ts.factory.createArrowFunction(
        undefined,
        undefined,
        params,
        undefined,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        returnObject
      );
    } else {
      valueExpression = ts.factory.createObjectLiteralExpression(
        [
          ts.factory.createPropertyAssignment(
            "url",
            ts.factory.createStringLiteral(path)
          ),
          ts.factory.createPropertyAssignment(
            "method",
            ts.factory.createStringLiteral(method)
          ),
        ],
        true
      );
    }

    return ts.factory.createPropertyAssignment(
      ts.factory.createStringLiteral(key),
      valueExpression
    );
  });

  const statement = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier("ROUTES"),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(props, true)
        ),
      ],
      ts.NodeFlags.Const
    )
  );

  file.add(statement);
};
