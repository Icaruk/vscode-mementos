export function rgbToHex(rgb: string, alpha: number = 255): string {
	const components = rgb.split(","); // "123,123,123" --> ["123","123","123"]

	const r = Number(components[0]).toString(16).padStart(2, "0");
	const g = Number(components[1]).toString(16).padStart(2, "0");
	const b = Number(components[2]).toString(16).padStart(2, "0");

	const a = Number(alpha).toString(16).padStart(2, "0");

	return `#${r}${g}${b}${a}`;
}
