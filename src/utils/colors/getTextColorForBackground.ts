export function getTextColorForBackground(backgroundRgb: string) {
	// "1,1,1" --> [1,1,1]
	const fondoArr = backgroundRgb.split(',').map(Number);

	// Calcular el brillo relativo del fondo (se utiliza la fórmula de W3C)
	const brilloRelativo = (fondoArr[0] * 299 + fondoArr[1] * 587 + fondoArr[2] * 114) / 1000;

	// Determinar el color de texto basado en el brillo relativo
	if (brilloRelativo > 125) {
		// Fondo claro: usar texto negro
		return '11,11,11';
	} else {
		// Fondo oscuro: usar texto blanco
		return '255,255,255';
	}
}
