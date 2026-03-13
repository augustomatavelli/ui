import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const ProductsContext = createContext({});

export const ProductsProvider = ({ children }) => {
	const [loadingProduct, setLoadingProduct] = useState(false);
	const [products, setProducts] = useState([]);
	const [totalProducts, setTotalProducts] = useState(0);
	const [searchProducts, setSearchProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [productDetails, setProductDetails] = useState({});

	const resetProductStates = useCallback(() => {
		setLoadingProduct(false);
		setProducts([]);
		setTotalProducts(0);
		setSearchProducts([]);
		setCategories([]);
		setProductDetails({});
	}, []);

	const contextValue = useMemo(
		() => ({
			loadingProduct, setLoadingProduct,
			products, setProducts,
			totalProducts, setTotalProducts,
			searchProducts, setSearchProducts,
			categories, setCategories,
			productDetails, setProductDetails,
			resetProductStates,
		}),
		[loadingProduct, products, totalProducts, searchProducts, categories, productDetails, resetProductStates]
	);

	return <ProductsContext.Provider value={contextValue}>{children}</ProductsContext.Provider>;
};

ProductsProvider.propTypes = {
	children: PropTypes.node,
};

export default ProductsContext;
