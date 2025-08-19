export const formatCpfCnpj = (value) => {
	const cleaned = value.replace(/\D/g, "");

	if (cleaned.length === 11) {
		// Formata CPF (000.000.000-00)x
		return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
	} else if (cleaned.length === 14) {
		return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
	} else {
		return value;
	}
};
