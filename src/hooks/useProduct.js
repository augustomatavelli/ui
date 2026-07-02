import UseAxios from "./useAxios";
import { useContext } from "react";
import ProductsContext from "contexts/ProductsContext";
import { runRequest } from "utils/api/runRequest";

const useProduct = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingProduct, setSearchProducts, setProducts, setTotalProducts, setCategories, setProductDetails } = useContext(ProductsContext);

	const createProduct = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/products", data), { setLoading: setLoadingProduct });
		return result;
	};

	const searchAllProducts = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/products`, { signal }), { setLoading: setLoadingProduct });
		if (data) {
			setSearchProducts(data);
		}
	};

	const findAllProducts = async (search, page, categoriesParams, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/products/admin/find-all?search=${search}&page=${page}&${categoriesParams.toString()}`, { signal }), {
			setLoading: setLoadingProduct,
		});
		if (data) {
			setProducts(data.items ?? []);
			setTotalProducts(data.pagination?.totalPages ?? 0);
		}
	};

	const findCategories = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/products/categories`, { signal }), { setLoading: setLoadingProduct });
		if (data) {
			setCategories(data);
		}
	};

	const findOneProductById = async (productId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/products/admin/${productId}`, { signal }), { setLoading: setLoadingProduct });
		if (data) {
			setProductDetails(data);
		}
	};

	const deleteProduct = async (productId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/products/admin/delete/${productId}`), { setLoading: setLoadingProduct });
		return data;
	};

	const updateProduct = async (productId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/products/admin/update/${productId}`, { ...data }), { setLoading: setLoadingProduct });
		return result;
	};

	return { createProduct, findAllProducts, searchAllProducts, findCategories, deleteProduct, updateProduct, findOneProductById };
};

export default useProduct;
