import { Position, Selection, TextEditor, workspace } from "vscode";

export function insertMementoIntoLine({
	activeEditor,
	lineNumber
}: {
	activeEditor: TextEditor;
	lineNumber?: number;
}) {
	
	if (!activeEditor) {
		return;
	};
	
	// Get cursor position
	const position = activeEditor.selection.active;
	
	if (!lineNumber) {
		lineNumber = position.line;
	};
	
	// Get line text under cursor
	const text = activeEditor.document.lineAt(lineNumber).text;
	const isEmptyLine = text.trim().length === 0;
	
	const config = workspace.getConfiguration("mementos");
	const triggerWord = config.get<string>("comment.triggerWord");
	const separator = config.get<string>("comment.triggerWordSeparator");
	
	if (isEmptyLine) {
		activeEditor.edit(editBuilder => {
			if (activeEditor) {
				editBuilder.insert(activeEditor.selection.active, `// ${triggerWord}${separator}`);
			};
		});
	} else {
		
		// Place cursor at the end of the line
		activeEditor.selection = new Selection(position, position);
		
		const lastPosition = new Position(
			lineNumber,
			text.length,
		);
		
		// Edit line
		activeEditor.edit(editBuilder => {
			editBuilder.insert(lastPosition, ` // ${triggerWord}${separator}`);
		});
		
	}
	
};