import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AircraftsTable from "sections/tables/aircrafts";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";

const ListAircraftsForAdmin = () => {
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
			title="Aeronaves"
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
			<AircraftsTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListAircraftsForAdmin;
