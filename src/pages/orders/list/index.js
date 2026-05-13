import UserContext from "contexts/UserContext";
import useOrder from "hooks/useOrder";
import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Stack, Pagination, Grid, Button } from "@mui/material";
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
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({});

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S" && user.type !== "C") {
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
	}, [user]);

	useEffect(() => {
		if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		findAllOrders(search, page, params, paramsStatus, selectedPeriod, dateFilter);
	}, [search, page, selectedCategory, selectedStatus, reload, selectedPeriod, dateFilter]);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	return (
		<MainCard
			title="Ordens de serviço"
			content={false}
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Button
						color="inherit"
						variant={openFilter ? "contained" : "outlined"}
						sx={{
							minWidth: 50,
							width: "fit-content",
							padding: 1,
						}}
						onClick={() => {
							setOpenFilter(!openFilter);
						}}
					>
						{openFilter ? <FilterFilled style={{ fontSize: 18 }} /> : <FilterOutlined style={{ fontSize: 18 }} />}
					</Button>
					<Button
						color="inherit"
						variant="outlined"
						sx={{
							minWidth: 50,
							width: "fit-content",
							padding: 1,
						}}
						onClick={() => setReload(!reload)}
					>
						<ReloadOutlined style={{ fontSize: 18 }} />
					</Button>
				</Grid>
			}
		>
			{openFilter && (
				<OrderFilter
					setSearch={setSearch}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					categoriesArray={categoriesArray}
					selectedPeriod={selectedPeriod}
					setSelectedPeriod={setSelectedPeriod}
					dateFilter={dateFilter}
					setDateFilter={setDateFilter}
				/>
			)}
			<OrdersTabs reload={reload} setReload={setReload} search={search} setSelectedStatus={setSelectedStatus} value={value} setValue={setValue} />
			<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
				<Pagination count={totalOrders} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
			</Stack>
		</MainCard>
	);
};

export default ListOrders;
