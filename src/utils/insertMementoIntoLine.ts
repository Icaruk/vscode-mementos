import { Position, Selection, TextEditor, workspace } from "vscode";

export function insertMementoIntoLine({
	activeEditor,
	lineNumber,
}: {
	activeEditor: TextEditor;
	lineNumber?: number;
}) {
	if (!activeEditor) {
		return;
	}

	// Get cursor position
	const position = activeEditor.selection.active;

	if (!lineNumber) {
		lineNumber = position.line;
	}

	const config = workspace.getConfiguration("mementos");
	const triggerWord = config.get<string>("comment.triggerWord");
	const separator = config.get<string>("comment.triggerWordSeparator");
	const insertMementoWithContext = config.get<boolean>(
		"actions.insertMementoWithContext",
	);
	let defaultContextTitle = "";

	// Get line text
	const text = activeEditor.document.lineAt(lineNumber).text;
	const isEmptyLine = text.trim().length === 0;

	let contextText = "";

	if (insertMementoWithContext) {
		const _defaultContextTitle =
			config.get<string>("actions.defaultContextTitle") ?? "";
		if (_defaultContextTitle) {
			defaultContextTitle = _defaultContextTitle + " ";
		}

		// Get ↑ and ↓ lines
		const lastLine = activeEditor.document.lineCount - 1; // zero indexed
		const previousLine =
			lineNumber === 0 ? null : activeEditor.document.lineAt(lineNumber - 1);
		const nextLine =
			lineNumber === lastLine
				? null
				: activeEditor.document.lineAt(lineNumber + 1);

		if (nextLine && nextLine.text.trim().length > 0) {
			contextText = nextLine.text;
		} else if (previousLine && previousLine.text.trim().length > 0) {
			contextText = previousLine.text;
		}

		// Clean contextText
		if (contextText.length > 0) {
			contextText = contextText.trim();

			if (contextText.length > 40) {
				contextText = contextText.slice(0, 40) + "...";
			}

			const parts = contextText.split("//").filter(Boolean);
			if (parts.length > 1) {
				contextText = parts[0].trim();
			}
		}
	}

	const firstBlockToInsert = `// ${triggerWord}${separator}${defaultContextTitle}`;

	if (isEmptyLine) {
		activeEditor.edit((editBuilder) => {
			if (activeEditor) {
				editBuilder.insert(
					activeEditor.selection.active,
					`${firstBlockToInsert}${contextText}`,
				);
			}
		});

		// Place cursor
		activeEditor.selection = new Selection(
			new Position(
				lineNumber ?? 0,
				firstBlockToInsert.length - defaultContextTitle.length,
			),
			new Position(lineNumber ?? 0, firstBlockToInsert.length - 1),
		);
	} else {
		if (contextText.length === 0) {
			// Place cursor at the end of the line
			activeEditor.selection = new Selection(position, position);
		}

		const lastPosition = new Position(lineNumber, text.length);

		// Edit line
		activeEditor.edit((editBuilder) => {
			editBuilder.insert(lastPosition, `${firstBlockToInsert}${contextText}`);
		});
	}
}
