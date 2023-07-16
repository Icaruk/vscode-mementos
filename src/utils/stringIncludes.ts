export function stringIncludes(text: string, words: string[]): boolean {

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
