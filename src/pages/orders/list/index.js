import UserContext from "contexts/UserContext";
import useOrder from "hooks/useOrder";
import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { FilterOutlined } from "@ant-design/icons";

// material-ui
import { Stack, Pagination } from "@mui/material";

import Loader from "components/Loader";
import OrderContext from "contexts/OrdersContext";
import MainCard from "components/MainCard";
import { OrderFilter } from "./OrderFilter";
import OrdersTabs from "./OrderTab";

const ListOrders = () => {
	const { user } = useContext(UserContext);
	const { findAllOrders, findAllCategories } = useOrder();

	const { totalOrders, loadingOrder } = useContext(OrderContext);

	const [page, setPage] = useState(1);
	const [openFilter, setOpenFilter] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState({});
	const [selectedStatus, setSelectedStatus] = useState({});
	const [categoriesArray, setCategoriesArray] = useState([]);
	const [reload, setReload] = useState(false);
	const [value, setValue] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "C") {
			navigate("/aircrafts/me", { replace: true });
		}
		const fetchCategories = async () => {
			try {
				const categories = await findAllCategories();
				setCategoriesArray(categories);
			} catch (error) {
				console.error("Erro ao buscar categorias:", error);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		findAllOrders(search, page, params, paramsStatus);
	}, [search, page, selectedCategory, selectedStatus, reload]);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	return (
		<MainCard
			title="Ordens de serviço"
			content={false}
			sx={{ marginTop: 2 }}
			secondary={
				<FilterOutlined
					onClick={() => {
						setOpenFilter(!openFilter);
					}}
					style={{ fontSize: 20 }}
				/>
			}
		>
			{openFilter && <OrderFilter setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categoriesArray={categoriesArray} />}
			{loadingOrder ? <Loader /> : <OrdersTabs reload={reload} setReload={setReload} search={search} setSelectedStatus={setSelectedStatus} value={value} setValue={setValue} />}
			{/* {loadingOrder ? <Loader /> : orders && orders.length > 0 && <OrdersTable reload={reload} setReload={setReload} search={search} />} */}
			<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
				<Pagination count={totalOrders} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
			</Stack>
		</MainCard>
	);
};

export default ListOrders;
