import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import MyRequestsTable from "sections/tables/requests/MyRequests";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";

const ListMyRequests = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<MainCard
			content={false}
			title="Solicitações de pouso"
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
			<MyRequestsTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListMyRequests;
