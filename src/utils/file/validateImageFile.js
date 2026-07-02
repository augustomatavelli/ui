const DEFAULT_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Valida um arquivo de imagem (tipo e tamanho).
 *
 * @param {File} file
 * @param {object} [opts]
 * @param {string[]} [opts.allowedTypes]
 * @param {number} [opts.maxSize] em bytes
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImageFile(file, opts = {}) {
	const { allowedTypes = DEFAULT_ALLOWED_TYPES, maxSize = DEFAULT_MAX_SIZE } = opts;

	if (!file) {
		return { valid: false, error: "Nenhum arquivo selecionado." };
	}
	if (!allowedTypes.includes(file.type)) {
		return { valid: false, error: "Formato inválido. Envie uma imagem PNG ou JPG." };
	}
	if (file.size > maxSize) {
		const mb = Math.round(maxSize / (1024 * 1024));
		return { valid: false, error: `Arquivo muito grande. Tamanho máximo: ${mb}MB.` };
	}
	return { valid: true, error: null };
}

export default validateImageFile;
