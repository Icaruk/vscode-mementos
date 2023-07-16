"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const mementos_1 = require("./mementos");
const getColorFromExtraText_1 = require("./utils/getColorFromExtraText");
const generateSvg_1 = require("./utils/generateSvg");
const constants_1 = require("./utils/constants");
const rgbToHex_1 = require("./utils/rgbToHex");
const allDecorators = [];
let mementosProvider;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    vscode_1.window.showInformationMessage('Mementos has been started');
    let activeEditor = vscode_1.window.activeTextEditor;
    mementosProvider = new mementos_1.MementosProvider([]);
    vscode_1.window.registerTreeDataProvider('allMementos', mementosProvider);
    vscode_1.commands.registerCommand(constants_1.MEMENTOS_ACTION_ITEM_CLICK, (item) => {
        // Get position where the cursor should move to
        const position = new vscode_1.Position(item.lineNumber - 1, 0);
        if (activeEditor) {
            // Create new selection
            const newSelection = new vscode_1.Selection(position, position);
            // Move cursor and reveal
            activeEditor.selection = newSelection;
            activeEditor.revealRange(newSelection, vscode_1.TextEditorRevealType.InCenter);
        }
    });
    vscode_1.commands.registerCommand(constants_1.MEMENTOS_ACTION_ITEM_DELETE, (item) => {
        if (activeEditor) {
            // Get line text
            const text = activeEditor.document.lineAt(item.lineNumber - 1).text;
            // Find the index of the "//" text
            const index = text.lastIndexOf("//");
            if (index === -1) {
                return;
            }
            ;
            // Create new selection just for the //@mem:title
            const newSelection = new vscode_1.Selection(new vscode_1.Position(item.lineNumber - 1, index), new vscode_1.Position(item.lineNumber - 1, text.length));
            // Move cursor and reveal
            activeEditor.selection = newSelection;
            activeEditor.revealRange(newSelection, vscode_1.TextEditorRevealType.InCenter);
            // Get full range selection
            const fullRange = activeEditor.document.lineAt(item.lineNumber - 1).rangeIncludingLineBreak;
            // Edit line
            activeEditor.edit(editBuilder => {
                if (index === 0) {
                    editBuilder.delete(fullRange);
                }
                else {
                    editBuilder.delete(newSelection);
                }
                ;
            });
        }
    });
    vscode_1.workspace.onDidChangeTextDocument((event) => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations(activeEditor);
        }
    });
    // on change active text editor
    vscode_1.window.onDidChangeActiveTextEditor((event) => {
        activeEditor = event;
        updateDecorations(activeEditor);
    });
    updateDecorations(activeEditor);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode_1.commands.registerCommand('mementos.forceUpdate', () => {
        updateDecorations(activeEditor);
        vscode_1.window.showInformationMessage('[Mementos] Update has been forced');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function updateDecorations(editor) {
    if (!editor) {
        return;
    }
    // Get config "mementos.comment.triggerWord"
    const config = vscode_1.workspace.getConfiguration("mementos");
    const triggerWord = config.get("comment.triggerWord");
    const separator = config.get("comment.triggerWordSeparator");
    const colorizeComment = config.get("comment.colorizeComment");
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
            const colors = (0, getColorFromExtraText_1.getColorFromExtraText)(title);
            fillRgb = colors.fillRgb;
            textRgb = colors.textRgb;
        }
        if (magicWord === triggerWord) {
            const svg = (0, generateSvg_1.generateSvg)({
                text: firstTitleChar ?? "",
                fillRgb: fillRgb,
                textRgb: textRgb,
            });
            const iconPath = vscode_1.Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
            const decOptions = {
                gutterIconPath: iconPath,
                gutterIconSize: "auto",
            };
            if (colorizeComment) {
                decOptions.color = (0, rgbToHex_1.rgbToHex)(fillRgb);
            }
            ;
            const decType = vscode_1.window.createTextEditorDecorationType(decOptions);
            mementosProvider.addMemento({
                label: title,
                description: description,
                lineNumber: lineNumber + 1,
                iconPath: iconPath
            });
            editor.setDecorations(decType, [
                {
                    range: new vscode_1.Range(lineNumber, commentIndex, lineNumber, lineText.length),
                },
            ]);
            allDecorators.push(decType);
        }
    }
    mementosProvider.refresh();
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map