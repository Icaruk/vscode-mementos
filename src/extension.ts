// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
	type DecorationRenderOptions,
	type ExtensionContext,
	Position,
	Range,
	Selection,
	type TextEditor,
	type TextEditorDecorationType,
	TextEditorRevealType,
	Uri,
	commands,
	window,
	workspace,
} from "vscode";
import { Category, MementosProvider } from "./mementos";
import { getColorFromExtraText } from "./utils/colors/getColorFromExtraText";
import { rgbToHex } from "./utils/colors/rgbToHex";
import {
	MEMENTOS_ACTION_DELETE_MEMENTO,
	MEMENTOS_ACTION_INSERT_MEMENTO,
	MEMENTOS_ACTION_INSERT_MEMENTO_AT_TOP,
	MEMENTOS_ACTION_TOGGLE_MEMENTO,
	MEMENTOS_ACTION_TREEITEM_CLICK,
	MEMENTOS_ACTION_TREEITEM_DELETE,
} from "./utils/constants";
import { deleteMementoFromLine } from "./utils/deleteMementoFromLine";
import { generateSvg } from "./utils/generateSvg";
import { getMementoComponents } from "./utils/getMementoComponents";
import { insertMementoIntoLine } from "./utils/insertMementoIntoLine";

const allDecorators: TextEditorDecorationType[] = [];
let mementosProvider: MementosProvider;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	let activeEditor = window.activeTextEditor;

	mementosProvider = new MementosProvider();
	window.registerTreeDataProvider("allMementos", mementosProvider);

	commands.registerCommand(MEMENTOS_ACTION_TREEITEM_CLICK, (item) => {
		// Get position where the cursor should move to
		const position = new Position(item.lineNumber - 1, 0);

		if (activeEditor) {
			// Create new selection
			const newSelection = new Selection(position, position);

			// Move cursor and reveal
			activeEditor.selection = newSelection;
			activeEditor.revealRange(newSelection, TextEditorRevealType.InCenter);
		}
	});

	commands.registerCommand(MEMENTOS_ACTION_TREEITEM_DELETE, (item) => {
		if (item instanceof Category) {
			return;
		}

		if (activeEditor) {
			// Get line text
			const text = activeEditor.document.lineAt(item.lineNumber - 1).text;

			// Find the index of the "//" text
			const index = text.lastIndexOf("//");

			if (index === -1) {
				return;
			}

			// Create new selection just for the //@mem:title
			const newSelection = new Selection(
				new Position(item.lineNumber - 1, index),
				new Position(item.lineNumber - 1, text.length),
			);

			// Move cursor and reveal
			activeEditor.selection = newSelection;
			activeEditor.revealRange(newSelection, TextEditorRevealType.InCenter);

			// Get full range selection
			const fullRange = activeEditor.document.lineAt(
				item.lineNumber - 1,
			).rangeIncludingLineBreak;

			// Edit line
			activeEditor.edit((editBuilder) => {
				if (index === 0) {
					editBuilder.delete(fullRange);
				} else {
					editBuilder.delete(newSelection);
				}
			});
		}
	});

	commands.registerCommand(MEMENTOS_ACTION_INSERT_MEMENTO, () => {
		if (!activeEditor) {
			return;
		}

		insertMementoIntoLine({
			activeEditor,
		});
	});

	commands.registerCommand(MEMENTOS_ACTION_INSERT_MEMENTO_AT_TOP, () => {
		if (!activeEditor) {
			return;
		}

		const config = workspace.getConfiguration("mementos");
		const triggerWord = config.get<string>("comment.triggerWord");
		const separator = config.get<string>("comment.triggerWordSeparator");

		const position = new Position(0, 0);

		// Edit line
		activeEditor.edit((editBuilder) => {
			editBuilder.insert(position, `// ${triggerWord}${separator}\n`);
		});
	});

	commands.registerCommand(MEMENTOS_ACTION_DELETE_MEMENTO, () => {
		if (!activeEditor) {
			return;
		}

		deleteMementoFromLine({
			activeEditor,
		});
	});

	commands.registerCommand(MEMENTOS_ACTION_TOGGLE_MEMENTO, () => {
		if (!activeEditor) {
			return;
		}

		// Get cursor position
		const position = activeEditor.selection.active;

		// Get line text under cursor
		const text = activeEditor.document.lineAt(position.line).text;

		const { isMemento } = getMementoComponents(text);

		if (isMemento) {
			deleteMementoFromLine({
				activeEditor,
			});
		} else {
			insertMementoIntoLine({
				activeEditor,
			});
		}
	});

	workspace.onDidChangeTextDocument((event) => {
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations(activeEditor);
		}
	});

	// on change active text editor
	window.onDidChangeActiveTextEditor((event) => {
		activeEditor = event;
		updateDecorations(activeEditor);
	});

	updateDecorations(activeEditor);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = commands.registerCommand("mementos.forceUpdate", () => {
		updateDecorations(activeEditor);
		window.showInformationMessage("[Mementos] Update has been forced");
	});
	context.subscriptions.push(disposable);
}

function updateDecorations(editor: TextEditor | undefined) {
	if (!editor) {
		return;
	}

	// Get config "mementos.comment.triggerWord"
	const config = workspace.getConfiguration("mementos");
	const colorizeComment = config.get<boolean>("comment.colorizeComment");

	// Remove all decorations
	for (const _decType of allDecorators) {
		editor.setDecorations(_decType, []);
	}
	mementosProvider.clearMementos();

	// Start
	const document = editor.document;
	const lineCount = document.lineCount;

	for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
		const line = document.lineAt(lineNumber);
		const lineText = line.text;

		const commentIndex = lineText.indexOf("//");

		const { isMemento, title, description } = getMementoComponents(lineText);

		let firstTitleChar = "";
		let fillRgb = "";
		let textRgb = "";
		let commentRgb = "";
		let colorId = "";

		if (title) {
			firstTitleChar = title.slice(0, 1).toUpperCase();

			const colors = getColorFromExtraText(title);
			fillRgb = colors.fillRgb;
			textRgb = colors.textRgb;
			commentRgb = colors.commentRgb;
			colorId = colors.id;
		}

		if (isMemento) {
			const svg = generateSvg({
				text: firstTitleChar ?? "",
				fillRgb,
				textRgb,
			});
			const iconPath = Uri.parse(
				`data:image/svg+xml,${encodeURIComponent(svg)}`,
			);

			const decOptions: DecorationRenderOptions = {
				gutterIconPath: iconPath,
				gutterIconSize: "auto",
			};
			if (colorizeComment) {
				if (commentRgb) {
					decOptions.color = rgbToHex(commentRgb);
				}
			}

			const decType = window.createTextEditorDecorationType(decOptions);

			mementosProvider.addMemento({
				id: colorId,
				label: title,
				description: description,
				lineNumber: lineNumber + 1,
				filePath: document.fileName,
				iconPath: iconPath,
			});

			editor.setDecorations(decType, [
				{
					range: new Range(
						lineNumber,
						commentIndex,
						lineNumber,
						lineText.length,
					),
				},
			]);

			allDecorators.push(decType);
		}
	}

	mementosProvider.refresh();
}

export function deactivate() {}
