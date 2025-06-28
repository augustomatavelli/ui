import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReportFuelTable from "sections/tables/reports";
import { FilterOutlined } from "@ant-design/icons";
import ReportContext from "contexts/ReportContext";
import { FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";

const allColumns = [
	{
		id: 1,
		header: "Dia",
		value: "day",
	},
	{
		id: 2,
		header: "Mês",
		value: "month",
	},
];

const ReportFuelPeriod = () => {
	const { user } = useContext(UserContext);
	const { period, setPeriod } = useContext(ReportContext);

	const [openFilter, setOpenFilter] = useState(false);

	const navigate = useNavigate();

	const handleChange = (event) => {
		setPeriod(event.target.value);
	};

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Relatório Combustível"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<FilterOutlined
					onClick={() => {
						setOpenFilter(!openFilter);
					}}
					style={{ fontSize: 20 }}
				/>
			}
		>
			<ReportFuelTable openFilter={openFilter} />
		</MainCard>
	);
};

export default ReportFuelPeriod;
