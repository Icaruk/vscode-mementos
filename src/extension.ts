// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Color, DecorationRenderOptions, ExtensionContext, Position, QuickPickItem, Range, Selection, StatusBarAlignment, TextEditor, TextEditorDecorationType, TextEditorRevealType, Uri, commands, window, workspace } from "vscode";
import { MementosProvider } from "./mementos";
import { getColorFromExtraText } from "./utils/getColorFromExtraText";
import { generateSvg } from "./utils/generateSvg";
import {MEMENTOS_ACTION_ITEM_CLICK, MEMENTOS_ACTION_ITEM_DELETE} from './utils/constants';
import { rgbToHex } from "./utils/rgbToHex";


const allDecorators: TextEditorDecorationType[] = [];
let mementosProvider: MementosProvider;


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	window.showInformationMessage('Mementos has been started');
	
	let activeEditor = window.activeTextEditor;
	
	mementosProvider = new MementosProvider([]);
	window.registerTreeDataProvider('allMementos', mementosProvider);
	
	commands.registerCommand(MEMENTOS_ACTION_ITEM_CLICK, (item) => {
		
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
	
	commands.registerCommand(MEMENTOS_ACTION_ITEM_DELETE, (item) => {
		
		if (activeEditor) {
			// Get line text
			const text = activeEditor.document.lineAt(item.lineNumber - 1).text;
			
			// Find the index of the "//" text
			const index = text.lastIndexOf("//");
			
			if (index === -1) {
				return;
			};
			
			// Create new selection just for the //@mem:title
			const newSelection = new Selection(
				new Position(item.lineNumber -1, index),
				new Position(item.lineNumber -1, text.length)
			);
		
			// Move cursor and reveal
			activeEditor.selection = newSelection;
			activeEditor.revealRange(newSelection, TextEditorRevealType.InCenter);
			
			// Get full range selection
			const fullRange = activeEditor.document.lineAt(item.lineNumber - 1).rangeIncludingLineBreak;
			
			// Edit line
			activeEditor.edit(editBuilder => {
				if (index === 0) {
					editBuilder.delete(fullRange);
				} else {
					editBuilder.delete(newSelection);
				};
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
	let disposable = commands.registerCommand('mementos.forceUpdate', () => {
		updateDecorations(activeEditor);
		window.showInformationMessage('[Mementos] Update has been forced');
	});
	context.subscriptions.push(disposable);
	
}


function updateDecorations(editor: TextEditor | undefined) {
	
	if (!editor) {
		return;
	}
	
	// Get config "mementos.comment.triggerWord"
	const config = workspace.getConfiguration("mementos");
	const triggerWord = config.get<string>("comment.triggerWord");
	const separator = config.get<string>("comment.triggerWordSeparator");
	const colorizeComment = config.get<boolean>("comment.colorizeComment");
	
	// Remove all decorations
	allDecorators.forEach(decType => editor.setDecorations(decType, []));
	mementosProvider.clearMementos();
	
	// Start
	const document = editor.document;
	const lineCount = document.lineCount;
	
	for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
		const line = document.lineAt(lineNumber);
		const lineText = line.text;
		
		const commentIndex = lineText.indexOf("//");
		
		// Check regex if line includes --> // magicWord:title description
		const regex = new RegExp(`\/\/ ?(${triggerWord})${separator}?([^\s ]*)\s?(.*)`, "gm");
		const match = regex.exec(lineText);
		
		const magicWord = match?.[1] ?? "";
		const title = match?.[2] ?? "";
		const description = match?.[3] ?? "";
		
		let firstTitleChar = "";
		let fillRgb = "";
		let textRgb = "";
		
		if (title) {
			firstTitleChar = title.slice(0, 1).toUpperCase();
			
			const colors = getColorFromExtraText(title);
			fillRgb = colors.fillRgb;
			textRgb = colors.textRgb;
		}
		
		if (magicWord === triggerWord) {
			
			const svg = generateSvg({
				text: firstTitleChar ?? "",
				fillRgb: fillRgb,
				textRgb: textRgb,
			});
			const iconPath = Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
			
			const decOptions: DecorationRenderOptions = {
				gutterIconPath: iconPath,
				gutterIconSize: "auto",
			};
			if (colorizeComment) {
				decOptions.color = rgbToHex(fillRgb);
			};
			
			const decType = window.createTextEditorDecorationType(decOptions);
			
			mementosProvider.addMemento({
				label: title,
				description: description,
				lineNumber: lineNumber + 1,
				iconPath: iconPath
			});
			
			editor.setDecorations(decType, [
				{
					range: new Range(lineNumber, commentIndex, lineNumber, lineText.length),
				},
			]);
			
			allDecorators.push(decType);
		}
		
		
	}
	
	mementosProvider.refresh();
	
}


export function deactivate() {}
