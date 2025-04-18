import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import ProductsContext from "contexts/ProductsContext";

const useProduct = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingProduct, setSearchProducts, setProducts, setTotalProducts, setCategories } = useContext(ProductsContext);

	const createProduct = async (data) => {
		try {
			setLoadingProduct(true);
			const response = await publicAxios.post("/products", data);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	const searchAllProducts = async () => {
		try {
			setLoadingProduct(true);
			const response = await publicAxios.get(`/products`);
			setSearchProducts(response.data);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	const findAllProducts = async (search, page, categoriesParams) => {
		try {
			setLoadingProduct(true);
			const response = await publicAxios.get(`/products/admin/find-all?search=${search}&page=${page}&${categoriesParams.toString()}`);
			setProducts(response.data.items);
			setTotalProducts(response.data.pagination.totalPages);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	const findCategories = async () => {
		try {
			setLoadingProduct(true);
			const response = await publicAxios.get(`/products/categories`);
			setCategories(response.data);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	const deleteProduct = async (productId) => {
		try {
			setLoadingProduct(true);
			const response = await publicAxios.delete(`/products/admin/delete/${productId}`);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	const updateProduct = async (productId, data) => {
		console.log(data);
		try {
			setLoadingProduct(true);
			await publicAxios.patch(`/products/admin/update/${productId}`, { ...data });
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingProduct(false);
		}
	};

	return { createProduct, findAllProducts, searchAllProducts, findCategories, deleteProduct, updateProduct };
};

export default useProduct;
