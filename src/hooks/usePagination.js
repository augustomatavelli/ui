import { useState } from "react";

// ==============================|| CARD - PAGINATION ||============================== //

export default function usePagination(data, itemsPerPage) {
	const [currentPage, setCurrentPage] = useState(1);
	const maxPage = Math.ceil(data.length / itemsPerPage);

	// Clamp: se os dados encolherem (ex.: após filtro/exclusão), a página atual
	// pode ficar além do total e mostrar uma fatia vazia. Usamos uma página
	// segura para o cálculo e a expomos como currentPage.
	const safePage = Math.min(Math.max(currentPage, 1), Math.max(maxPage, 1));

	function currentData() {
		const begin = (safePage - 1) * itemsPerPage;
		const end = begin + itemsPerPage;
		return data.slice(begin, end);
	}

	function next() {
		setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
	}

	function prev() {
		setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
	}

	function jump(page) {
		const pageNumber = Math.max(1, page);
		setCurrentPage(() => Math.min(pageNumber, Math.max(maxPage, 1)));
	}
	return { next, prev, jump, currentData, currentPage: safePage, maxPage };
}
