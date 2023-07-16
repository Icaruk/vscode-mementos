import { workspace } from "vscode";

export interface MementoColors {
	[key: string]: MementoColor;
};

export interface MementoColor {
	rgb: string;
	wordList: string[];
};

// https://colorswall.com/es/palette/171299
export const semanticColors: MementoColors = {
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
	blue: {
		rgb: "89,173,246",
		wordList: ["bm", "book", "mark"],
	},
	green: {
		rgb: "66,214,164",
		wordList: ["ok", "done", "ready"],
	},
	cyan: {
		rgb: "8,202,209",
		wordList: ["*"],
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

export function getSemanticColor(color: string): MementoColor {
	const wordListFromConfig = workspace.getConfiguration("mementos").get<string[]>(`gutter.mementoTitles.${color}`);
	
	const semanticColor = semanticColors[color];
	if (wordListFromConfig?.length) {
		semanticColor.wordList = wordListFromConfig;
	};
	
	return semanticColor;
}
