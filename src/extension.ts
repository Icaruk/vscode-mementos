// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, Range, TextEditor, TextEditorDecorationType, TreeDataProvider, TreeItem, TreeView, Uri, commands, window, workspace } from "vscode";
import { DepNodeProvider } from "./nodeDependencies";


const allDecorators: TextEditorDecorationType[] = [];
let mementosItems: TreeItem[] = [];
let mementosTreeView: TreeView<TreeItem> | undefined;
let allMementos = [];
let nodeDependenciesProvider: DepNodeProvider;

// https://colorswall.com/es/palette/171299
const semanticColors = {
	red: {
		rgb: "255,105,97",
		wordList: ["err", "del", "x", "!"],
	},
	orange: {
		rgb: "255,180,128",
		wordList: ["todo", "to-do", "to_do"],
	},
	yellow: {
		rgb: "248,243,141",
		wordList: ["warn", "warning"],
	},
	green: {
		rgb: "66,214,164",
		wordList: ["ok", "done", "ready", "+"],
	},
	cyan: {
		rgb: "8,202,209",
		wordList: ["*"],
	},
	blue: {
		rgb: "89,173,246",
		wordList: ["?", "bm", "book", "mark", "bookmark"],
	},
	purple: {
		rgb: "157,148,255",
		wordList: ["*"],
	},
	pink: {
		rgb: "199,128,232",
		wordList: ["pink", ">", "<"],
	}
};

const generateSvg = ({
	text,
	fillRgb = "25,25,25",
	textRgb = "255,255,255",
}: {
	text: string,
	fillRgb?: string,
	textRgb?: string
}) => {
	return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 16 16" version="1.1"><defs><g><symbol overflow="visible" id="glyph0-0"><path style="stroke:none;" d="M 0.40625 1.421875 L 0.40625 -5.640625 L 4.40625 -5.640625 L 4.40625 1.421875 Z M 0.859375 0.96875 L 3.96875 0.96875 L 3.96875 -5.1875 L 0.859375 -5.1875 Z M 0.859375 0.96875 "/></symbol><symbol overflow="visible" id="glyph0-1"><path style="stroke:none;" d="M 4.21875 -0.171875 C 4.039062 -0.078125 3.847656 -0.0078125 3.640625 0.03125 C 3.441406 0.0820312 3.234375 0.109375 3.015625 0.109375 C 2.234375 0.109375 1.632812 -0.144531 1.21875 -0.65625 C 0.800781 -1.175781 0.59375 -1.925781 0.59375 -2.90625 C 0.59375 -3.894531 0.800781 -4.644531 1.21875 -5.15625 C 1.632812 -5.675781 2.234375 -5.9375 3.015625 -5.9375 C 3.234375 -5.9375 3.441406 -5.910156 3.640625 -5.859375 C 3.847656 -5.816406 4.039062 -5.75 4.21875 -5.65625 L 4.21875 -4.375 C 4.019531 -4.5625 3.828125 -4.695312 3.640625 -4.78125 C 3.460938 -4.863281 3.273438 -4.90625 3.078125 -4.90625 C 2.648438 -4.90625 2.328125 -4.738281 2.109375 -4.40625 C 1.898438 -4.070312 1.796875 -3.570312 1.796875 -2.90625 C 1.796875 -2.25 1.898438 -1.753906 2.109375 -1.421875 C 2.328125 -1.085938 2.648438 -0.921875 3.078125 -0.921875 C 3.273438 -0.921875 3.460938 -0.960938 3.640625 -1.046875 C 3.828125 -1.128906 4.019531 -1.265625 4.21875 -1.453125 Z M 4.21875 -0.171875 "/></symbol></g></defs><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(${fillRgb});fill-opacity:1;" d="M 12.746094 15.78125 L 8.523438 12.023438 C 8.21875 11.753906 7.761719 11.753906 7.460938 12.023438 L 3.234375 15.78125 C 2.945312 16.039062 2.488281 15.832031 2.488281 15.445312 L 2.488281 0.964844 C 2.488281 0.480469 2.878906 0.0898438 3.363281 0.0898438 L 12.621094 0.0898438 C 13.101562 0.0898438 13.496094 0.480469 13.496094 0.964844 L 13.496094 15.445312 C 13.496094 15.832031 13.035156 16.039062 12.746094 15.78125 Z M 12.746094 15.78125 "/></g> <text text-anchor="left" alignment-baseline="middle" x="5" y="7" fill="rgb(${textRgb})" font-weight="bold" font-size="10" font-family="Menlo, Monaco, monospace">${text}</text> </svg>`;
};

function getTextColorForBackground(backgroundRgb: string) {
	// "1,1,1" --> [1,1,1]
	const fondoArr = backgroundRgb.split(',').map(Number);

	// Calcular el brillo relativo del fondo (se utiliza la fórmula de W3C)
	const brilloRelativo = (fondoArr[0] * 299 + fondoArr[1] * 587 + fondoArr[2] * 114) / 1000;

	// Determinar el color de texto basado en el brillo relativo
	if (brilloRelativo > 125) {
		// Fondo claro: usar texto negro
		return '11,11,11';
	} else {
		// Fondo oscuro: usar texto blanco
		return '255,255,255';
	}
}


function stringIncludes (text: string, words: string[]): boolean {
	
	if (!text) {
		return false;
	};
	
	for (const _word of words) {
		if (text.toLowerCase().includes(_word)) {
			return true;
		}
	}
	
	return false;
}


const getColorFromExtraText = (text: string): { fillRgb: string, textRgb: string } => {
	const colors = {
		fillRgb: "11,11,11",
		textRgb: "255,255,255",
	};
	
	const textLower = text.toLowerCase();
	
	
	for (let _colorKey in semanticColors) {
		
		const {rgb, wordList} = semanticColors[_colorKey];
		
		if (stringIncludes(text, wordList)) {
			colors.fillRgb = rgb;
			break;
		}
	}
	
	
	colors.textRgb = getTextColorForBackground(colors.fillRgb);
	return colors;
	
};


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	window.showInformationMessage('Mementos has been started');
	
	
	let activeEditor = window.activeTextEditor;
	
	nodeDependenciesProvider = new DepNodeProvider(allMementos);
	window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	console.log( "nodeDependenciesProvider", nodeDependenciesProvider );
	
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
	
    // const selection = editor.selection;

    // if (selection.isEmpty) {
    //     editor.setDecorations(decType, []);
    //     return;
    // }
	
	// Remove all decorations
	allDecorators.forEach(decType => editor.setDecorations(decType, []));
	nodeDependenciesProvider.clearmementos();
	
	// Start
	const document = editor.document;
	const lineCount = document.lineCount;
	
	for (let lineNumber = 0; lineNumber < lineCount; lineNumber++) {
		const line = document.lineAt(lineNumber);
		const lineText = line.text;
		
		// Check regex if line includes --> // magicWord:extraText description
		const regex = new RegExp("\/\/ ?(@mem):?([^\s]*)\s?(.*)", "gm");
		const match = regex.exec(lineText);
		
		const magicWord = match?.[1] ?? "";
		const extraText = match?.[2] ?? "";
		const description = match?.[3] ?? "";
		
		let iconChar = "";
		let fillRgb = "";
		let textRgb = "";
		
		if (extraText) {
			iconChar = extraText.slice(0, 1).toUpperCase();
			
			const colors = getColorFromExtraText(extraText);
			fillRgb = colors.fillRgb;
			textRgb = colors.textRgb;
		}
		
		if (magicWord === "@mem") {
			
			const svg = generateSvg({
				text: iconChar ?? "",
				fillRgb: fillRgb,
				textRgb: textRgb,
			});
			const iconPath = Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
			
			const decType = window.createTextEditorDecorationType({
				gutterIconPath: iconPath,
				gutterIconSize: 'auto',
			});
			
			nodeDependenciesProvider.addMemento(extraText);
			
			editor.setDecorations(decType, [
				{
					range: new Range(lineNumber, 0, lineNumber, 0),
				},
			]);
			
			allDecorators.push(decType);
		}
		
		
	}
	
	nodeDependenciesProvider.refresh();
	
}


export function deactivate() {}
