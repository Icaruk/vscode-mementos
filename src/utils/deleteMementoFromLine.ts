import { Position, Range, Selection, TextEditor } from "vscode";
import { getMementoComponents } from "./getMementoComponents";



export function deleteMementoFromLine({
	activeEditor, lineNumber
}: {
	activeEditor: TextEditor, lineNumber?: number
}) {
	
	if (!activeEditor) {
		return;
	};
	
	// Get cursor position
	const position = activeEditor.selection.active;
	
	if (!lineNumber) {
		lineNumber = position.line;
	};
	
	// Get text
	const text = activeEditor.document.lineAt(lineNumber).text;
	const isEmptyLine = text.trim().length === 0;
	
	if (isEmptyLine) {
		return;
	};
	
	// Find the index of the "//" text
	let commentIndex = text.lastIndexOf("//");
	const commentHasLeftSpace = commentIndex !== -1 && text[commentIndex - 1] === " ";
	
	if (commentHasLeftSpace) {
		commentIndex--;
	};
	
	const {isMemento} = getMementoComponents(text);
	
	if (!isMemento) {
		return;
	};
	
	// Place cursor at the end of the line
	activeEditor.selection = new Selection(position, position);
	
	const range = new Range(
		new Position(lineNumber, commentIndex),
		new Position(lineNumber, text.length),
	);
	
	// Edit line
	activeEditor.edit(editBuilder => {
		editBuilder.delete(range);
	});
};