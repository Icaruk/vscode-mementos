import { workspace } from "vscode";
import { stringIncludes } from "../stringIncludes";
import { getTextColorForBackground } from "./getTextColorForBackground";
import { getSemanticColor, semanticColors } from "./semanticColors";

export const getColorFromExtraText = (
	text: string,
): {
	fillRgb: string;
	textRgb: string;
	commentRgb: string;
	id: string;
} => {
	const config = workspace.getConfiguration("mementos");
	const defaultColor = config.get<string>("gutter.defaultColor") ?? "11,11,11";

	const colors = {
		fillRgb: defaultColor,
		textRgb: "255,255,255",
		commentRgb: "",
		id: "",
	};

	for (const _colorKey in semanticColors) {
		const { rgb, wordList } = getSemanticColor(_colorKey);

		if (stringIncludes(text, wordList)) {
			colors.fillRgb = rgb;
			colors.commentRgb = rgb;
			colors.id = _colorKey;
			break;
		}
	}

	colors.textRgb = getTextColorForBackground(colors.fillRgb);
	return colors;
};
