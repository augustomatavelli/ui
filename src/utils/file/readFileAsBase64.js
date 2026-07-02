/**
 * Lê um arquivo via FileReader e resolve com o conteúdo em base64 (sem o prefixo data URL).
 *
 * @param {File} file
 * @returns {Promise<string>} conteúdo base64 do arquivo
 */
export async function readFileAsBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve(event.target.result.split(",")[1]);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export default readFileAsBase64;
