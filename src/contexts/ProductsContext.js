import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const ProductsContext = createContext({});

export const ProductsProvider = ({ children }) => {
	const [loadingProduct, setLoadingProduct] = useState(false);
	const [products, setProducts] = useState([]);
	const [totalProducts, setTotalProducts] = useState(0);
	const [searchProducts, setSearchProducts] = useState([]);
	const [categories, setCategories] = useState([]);

	const resetProductStates = () => {
		setLoadingProduct(false);
		setProducts([]);
		setTotalProducts(0);
		setSearchProducts([]);
		setCategories([]);
	};

	return (
		<ProductsContext.Provider
			value={{ loadingProduct, setLoadingProduct, products, setProducts, totalProducts, setTotalProducts, searchProducts, setSearchProducts, categories, setCategories, resetProductStates }}
		>
			{children}
		</ProductsContext.Provider>
	);
};

ProductsProvider.propTypes = {
	children: PropTypes.node,
};

export default ProductsContext;
