import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import ProductsTable from "sections/tables/products";

// ==============================|| TAB - PERSONAL ||============================== //

const ListProductsForAdmin = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Produtos" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<ProductsTable />
		</MainCard>
	);
};

export default ListProductsForAdmin;
