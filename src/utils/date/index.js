import { format, parse, isAfter, isValid } from "date-fns";

// Formatos canônicos usados na aplicação.
export const DATETIME_FMT = "dd/MM/yyyy HH:mm";
export const API_DATETIME_FMT = "yyyy-MM-dd HH:mm";

const toDate = (value) => {
	if (!value) return null;
	if (value instanceof Date) return value;
	const parsed = new Date(value);
	return isValid(parsed) ? parsed : null;
};

/** Date -> string no formato esperado pela API ("yyyy-MM-dd HH:mm"). */
export const toApi = (value) => {
	const date = toDate(value);
	return date ? format(date, API_DATETIME_FMT) : null;
};

/** String de exibição ("dd/MM/yyyy HH:mm") -> Date. */
export const fromDisplay = (value) => {
	if (!value) return null;
	const parsed = parse(value, DATETIME_FMT, new Date());
	return isValid(parsed) ? parsed : null;
};

/** Date|string -> string de exibição ("dd/MM/yyyy HH:mm"). */
export const formatDisplay = (value) => {
	const date = toDate(value);
	return date ? format(date, DATETIME_FMT) : "";
};

/** Valida que `end` é estritamente posterior a `start`. */
export const isRangeValid = (start, end) => {
	const s = toDate(start);
	const e = toDate(end);
	return Boolean(s && e && isAfter(e, s));
};

/** Data/hora atual (substitui `dayjs()` em minDateTime etc.). */
export const now = () => new Date();
