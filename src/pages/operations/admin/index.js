import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import OperationsTable from "sections/tables/operations";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";

const ListOperationsForAdmin = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);
	const [reload, setReload] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Serviços"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Button
						color="inherit"
						variant={openFilter ? "contained" : "outlined"}
						onClick={() => {
							setOpenFilter(!openFilter);
						}}
					>
						{openFilter ? <FilterFilled style={{ fontSize: 20 }} /> : <FilterOutlined style={{ fontSize: 20 }} />}
					</Button>
					<Button color="inherit" variant="outlined" onClick={() => setReload(!reload)}>
						<ReloadOutlined style={{ fontSize: 20 }} />
					</Button>
				</Grid>
			}
		>
			<OperationsTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListOperationsForAdmin;
