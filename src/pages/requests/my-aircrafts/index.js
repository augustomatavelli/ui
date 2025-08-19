import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import MyAircraftsRequestsTable from "sections/tables/requests/MyAircraftsRequest";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";

const ListRequestsOfMyAircrafts = () => {
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
			<MyAircraftsRequestsTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListRequestsOfMyAircrafts;
