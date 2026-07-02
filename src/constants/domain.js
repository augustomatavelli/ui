// Domain magic-string constants.
//
// IMPORTANT: the string VALUES below must never change — they are persisted in
// the database and exchanged with the API. These constants only give names to
// already-existing literals; behaviour must stay identical.
//
// The same letter can mean different things depending on the field/context
// (e.g. "D" is "Na decolagem" for availability, but "Disponível" for status),
// so the constants are grouped by the domain field they belong to.

// Product / Operation availability — field `available_at`.
// Confirmed from the radio labels in products/[id] and operations/[id].
export const AVAILABILITY = {
	LANDING: "P", // "No pouso"
	TAKEOFF: "D", // "Na decolagem"
	BOTH: "A", // "Ambos"
};

// Product / Operation status — field `status`.
// Confirmed from the Chip label ("Disponível" vs "Indisponível").
export const PRODUCT_STATUS = {
	AVAILABLE: "D", // "Disponível"
	PENDING: "P", // legacy code referenced only for the chip text colour
};

// Generic Yes/No flag — used for estoque/checklist/reserva (and "Manual"/"Automático").
// Confirmed from the radio labels "Sim"/"Não".
export const YES_NO = {
	YES: "S", // "Sim" (also "Manual" for selectionMode)
	NO: "N", // "Não" (also "Automático" for selectionMode)
};

// User type — field `type`.
// Confirmed from users/[id] (read) and AddUser (write payload).
export const USER_TYPE = {
	ADMIN: "A", // "Administrador"
	PILOT: "P", // "Piloto"
	OPERATOR: "O", // "Operador"
	COMMON: "C", // "Comum"
};

// User account status — field `status`.
// Confirmed from users/[id] ("Ativo" / "Pendente" / "Inativo").
export const USER_STATUS = {
	ACTIVE: "A", // "Ativo"
	PENDING: "P", // "Pendente"
};

// Document type toggle (local UI state, not persisted) and the matching
// react-input-mask masks. Confirmed in AddUser / AddOperator.
export const DOC_TYPE = {
	CPF: "cpf",
	CNPJ: "cnpj",
};

export const DOC_MASKS = {
	CPF: "999.999.999-99",
	CNPJ: "99.999.999/9999-99",
};
