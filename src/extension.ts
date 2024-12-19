import * as vscode from 'vscode';

function recursiveAddChildren(symbols: vscode.DocumentSymbol[], res: vscode.DocumentSymbol[]) {
	for (let symbol of symbols) {
		res.push(symbol);
		if (symbol.children) {
			recursiveAddChildren(symbol.children, res);
		}
	}
}

function snakeToCamel(str: String) {
	return str.replace(/(_[a-z])/g,
		group =>
			group
				.toUpperCase()
				.replace('_', '')
  );
}
  

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('function-name-fixer.function-fix', () => {
			const activeTextEditor = vscode.window.activeTextEditor;
			if (!activeTextEditor) {
					return;
			}
			const document = activeTextEditor.document;
	
	
			vscode.commands.executeCommand<vscode.DocumentSymbol[]>("vscode.executeDocumentSymbolProvider", document.uri).then(
				function (symbols: vscode.DocumentSymbol[] | undefined) {
					if (symbols === undefined) {
						return;
					}
	
					let res: vscode.DocumentSymbol[] = [];
					recursiveAddChildren(symbols, res);
					symbols = res;

					symbols = symbols.filter(symbol => symbol.kind === vscode.SymbolKind.Function);
	
	
					for (let symbol of symbols) {
						let edit = new vscode.WorkspaceEdit();
						edit.replace(document.uri, symbol.selectionRange, snakeToCamel(symbol.name));
						vscode.workspace.applyEdit(edit);
					}
				}
			);
    });
    context.subscriptions.push(disposable);
}


// export function deactivate() {}
