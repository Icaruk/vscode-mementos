import { workspace } from "vscode";

interface MementoComponents {
	isMemento: boolean;
	triggerWord: string;
	title: string;
	description: string;
}

export function getMementoComponents(text: string): MementoComponents {
	// Get config "mementos.comment.triggerWord"
	const config = workspace.getConfiguration("mementos");
	const triggerWordConfig = config.get<string>("comment.triggerWord");
	const separatorConfig = config.get<string>("comment.triggerWordSeparator");

	// Check regex if line includes --> // triggerWord:title description
	const regex = new RegExp(
		`\/\/ {0,}(${triggerWordConfig})${separatorConfig}([^ ]*)\s?(.*)`,
		"gm",
	);
	const match = regex.exec(text);

	const triggerWord = match?.[1] ?? "";
	const title = match?.[2] ?? "";
	const description = match?.[3] ?? "";

	return {
		isMemento: triggerWord === triggerWordConfig,
		triggerWord,
		title,
		description,
	};
}
