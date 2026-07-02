import { ErrorMessages } from "utils/errors-messages/errors-messages";

const DEFAULT_MESSAGE = "Ocorreu um erro. Tente novamente.";

/**
 * Extrai uma mensagem amigável de um erro do axios, com guard clauses para
 * todos os formatos possíveis (sem response, sem errors[], etc.).
 *
 * Ordem de resolução:
 * 1. Sem `response` => erro de rede/timeout/abort.
 * 2. `errors[0].type|message` mapeado em ErrorMessages.
 * 3. `data.message` cru da API.
 * 4. Fallback genérico.
 */
export function getApiErrorMessage(error, fallback = DEFAULT_MESSAGE) {
	if (!error || !error.response) {
		if (error?.message === "Network Error") return "Sem conexão com o servidor.";
		return fallback;
	}

	const data = error.response.data;
	const first = data?.errors?.[0];
	const key = first?.type || first?.message;

	return ErrorMessages[key] || first?.message || data?.message || fallback;
}

export default getApiErrorMessage;
