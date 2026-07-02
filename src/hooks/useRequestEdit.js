import { useCallback, useEffect, useState } from "react";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { toApi } from "utils/date";

/**
 * Concentra toda a lógica de edição da tela de detalhes da solicitação.
 * Mantém comportamento idêntico ao componente original.
 */
const useRequestEdit = ({ id, requestDetails, setRequestDetails, updateRequest, findOneRequestById, updateAbsence }) => {
	const [openOperations, setOpenOperations] = useState(false);
	const [openProducts, setOpenProducts] = useState(false);
	const [openChecklists, setOpenChecklists] = useState(false);
	const [editRequest, setEditRequest] = useState({});
	const [openEditInput, setOpenEditInput] = useState({});
	const [dirty, setDirty] = useState(false);
	const [openAddProducts, setOpenAddProducts] = useState(false);
	const [openAddServices, setOpenAddServices] = useState(false);
	const [checked, setChecked] = useState({});
	const [checkedAbsence, setCheckedAbsence] = useState(false);

	const { absence } = requestDetails;

	const resetStates = useCallback(() => {
		setRequestDetails({});
		setOpenEditInput({});
		setOpenOperations(false);
		setOpenProducts(false);
		setEditRequest({});
		setOpenAddProducts(false);
		setOpenAddServices(false);
		setChecked({});
		setDirty(false);
	}, [setRequestDetails]);

	const handleOpenEditInput = useCallback((field) => {
		setOpenEditInput((prev) => {
			const newState = { ...prev };

			if (newState[field]) {
				delete newState[field];
			} else {
				newState[field] = 1;
			}

			return newState;
		});
	}, []);

	const handleEditRequest = useCallback((e, field) => {
		setDirty(true);
		setEditRequest((prev) => ({
			...prev,
			[field]: e ? toApi(e) : null,
		}));
	}, []);

	const handleAddProduct = useCallback((newProduct, name) => {
		setDirty(true);
		setEditRequest((prev) => {
			const products = prev.products || [];
			const existingProduct = products.find((p) => p.id_product === newProduct);
			if (!existingProduct) {
				return {
					...prev,
					products: [...products, { id_product: newProduct, name: name, amount: String(1) }],
				};
			}
			return {
				...prev,
				products: products.map((p) => (p.id_product === newProduct ? { ...p, amount: String(Number(p.amount) + 1) } : p)),
			};
		});
	}, []);

	const handleChangeProductAmount = useCallback((productId, newAmount) => {
		setDirty(true);
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === productId ? { ...p, amount: newAmount === "" ? 0 : Number(newAmount) } : p)),
		}));
	}, []);

	const handleRemoveProduct = useCallback((productId) => {
		setDirty(true);
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === productId ? { ...p, amount: String(Math.max(0, Number(p.amount) - 1)) } : p)),
		}));
	}, []);

	const handleDeleteProduct = useCallback((productId) => {
		setDirty(true);
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === productId ? { ...p, amount: String(0) } : p)),
		}));
	}, []);

	const handleDeleteService = useCallback((serviceId) => {
		setDirty(true);
		setEditRequest((prev) => ({
			...prev,
			services: prev.services.map((p) => (p.id_service === serviceId ? { ...p, amount: "0" } : p)),
		}));
	}, []);

	const handleChange = useCallback((serviceId, name, newAmount, unit) => {
		setDirty(true);
		setEditRequest((prev) => {
			const services = prev.services || [];
			if (newAmount === 0) {
				return {
					...prev,
					services: services.map((p) => (p.id_service === serviceId ? { ...p, amount: String(newAmount) } : p)),
				};
			}
			const existingService = services.find((p) => p.id_service === serviceId);
			if (!existingService) {
				return {
					...prev,
					services: [...services, { id_service: serviceId, name: name, amount: String(newAmount), unit: unit }],
				};
			}

			return {
				...prev,
				services: services.map((p) => (p.id_service === serviceId ? { ...p, amount: String(newAmount), unit: unit } : p)),
			};
		});
	}, []);

	const handleCheckboxChange = useCallback(
		(e) => {
			const { name, amount, unit } = e;
			setChecked((prev) => {
				const newChecked = { ...prev, [name]: !prev[name] };
				handleChange(e.id_service, e.name, unit === "un" ? 1 : amount, e.unit);
				return newChecked;
			});
		},
		[handleChange]
	);

	const handleLoadPage = useCallback(async () => {
		Object.keys(requestDetails).length && setEditRequest((prev) => ({ ...prev, products: [...requestDetails.products], services: [...requestDetails.services] }));
		requestDetails.services &&
			requestDetails.services.length > 0 &&
			requestDetails.services.forEach((e) =>
				setChecked((prev) => ({ ...prev, [e.name]: true }))
			);
		absence === "S" ? setCheckedAbsence(true) : setCheckedAbsence(false);
		setDirty(false);
	}, [requestDetails, absence]);

	const handleEditSave = useCallback(async () => {
		const response = await updateRequest(id, editRequest);
		if (!response) return;
		dispatch(
			openSnackbar({
				open: true,
				message: "Solicitação atualizada com sucesso!",
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		setEditRequest({});
		setOpenEditInput({});
		setOpenAddProducts(false);
		setOpenAddServices(false);
		await findOneRequestById(id);
	}, [id, editRequest, updateRequest, findOneRequestById]);

	const handleToggleCheckedAbsence = useCallback(
		async (event) => {
			const response = await updateAbsence(requestDetails.id_request);
			if (!response) return;
			dispatch(
				openSnackbar({
					open: true,
					message: "Solicitação atualizada com sucesso!",
					variant: "alert",
					alert: {
						color: "success",
					},
					close: false,
				})
			);
			setCheckedAbsence(event.target.checked);
			await findOneRequestById(id);
		},
		[id, requestDetails.id_request, updateAbsence, findOneRequestById]
	);

	useEffect(() => {
		handleLoadPage();
	}, [requestDetails]); // eslint-disable-line react-hooks/exhaustive-deps

	const isDirty = dirty;

	return {
		openOperations,
		setOpenOperations,
		openProducts,
		setOpenProducts,
		openChecklists,
		setOpenChecklists,
		editRequest,
		setEditRequest,
		openEditInput,
		setOpenEditInput,
		openAddProducts,
		setOpenAddProducts,
		openAddServices,
		setOpenAddServices,
		checked,
		setChecked,
		checkedAbsence,
		setCheckedAbsence,
		resetStates,
		handleOpenEditInput,
		handleEditRequest,
		handleAddProduct,
		handleChangeProductAmount,
		handleRemoveProduct,
		handleDeleteProduct,
		handleDeleteService,
		handleChange,
		handleCheckboxChange,
		handleLoadPage,
		handleEditSave,
		handleToggleCheckedAbsence,
		isDirty,
	};
};

export default useRequestEdit;
