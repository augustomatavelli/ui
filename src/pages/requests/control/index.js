import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import RequestsTable from "sections/tables/requests";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";
import RequestsControlLandingTakeoffTable from "sections/tables/requests/ControlLandingTakeoff";

const ListRequestsControlLandingTakeoff = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<MainCard
			content={false}
			title="Controle de Pouso/Decolagem"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					{/* <Button
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
					</Button> */}
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
			<RequestsControlLandingTakeoffTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListRequestsControlLandingTakeoff;
