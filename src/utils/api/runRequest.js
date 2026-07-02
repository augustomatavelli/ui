import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { getApiErrorMessage } from "./getApiErrorMessage";

/**
 * Executa uma chamada à API tratando erro de forma padronizada.
 *
 * @param {() => Promise} promiseFactory - função que retorna a promise do axios.
 * @param {object} [opts]
 * @param {(loading:boolean)=>void} [opts.setLoading] - setter de loading (chamado em finally).
 * @param {boolean} [opts.notifyError=true] - dispara snackbar de erro.
 * @param {string} [opts.errorMessage] - mensagem fixa de erro (sobrepõe a extração automática).
 * @returns {Promise<{data:any, response:any, error:any, canceled?:boolean}>}
 *
 * Notas:
 * - Requisições canceladas (AbortController) são silenciadas (canceled: true).
 * - Apenas notifica ERRO; mensagens de sucesso ficam a cargo do chamador.
 */
export async function runRequest(promiseFactory, opts = {}) {
	const { setLoading, notifyError = true, errorMessage } = opts;
	try {
		if (setLoading) setLoading(true);
		const response = await promiseFactory();
		return { data: response?.data, response, error: null };
	} catch (error) {
		if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
			return { data: null, response: null, error: null, canceled: true };
		}
		if (notifyError) {
			dispatch(
				openSnackbar({
					open: true,
					message: errorMessage || getApiErrorMessage(error),
					variant: "alert",
					alert: { color: "error" },
					close: true,
				}),
			);
		}
		return { data: null, response: null, error };
	} finally {
		if (setLoading) setLoading(false);
	}
}

export default runRequest;
