import { workspace } from "vscode";
import { getTextColorForBackground } from "./getTextColorForBackground";
import { getSemanticColor, semanticColors } from "./semanticColors";
import { stringIncludes } from "./stringIncludes";

export const getColorFromExtraText = (text: string): { fillRgb: string; textRgb: string; } => {
	
	const config = workspace.getConfiguration("mementos");
	const defaultColor = config.get<string>("gutter.defaultColor") ?? "11,11,11";
	
	const colors = {
		fillRgb: defaultColor,
		textRgb: "255,255,255",
	};
	
	for (let _colorKey in semanticColors) {

		const { rgb, wordList } = getSemanticColor(_colorKey);
		
		if (stringIncludes(text, wordList)) {
			colors.fillRgb = rgb;
			break;
		};
	};

	
	colors.textRgb = getTextColorForBackground(colors.fillRgb);
	return colors;

};
