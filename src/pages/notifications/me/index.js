import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FilterOutlined, FilterFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";
import NotificationsTable from "sections/tables/notifications";

const ListMyNotifications = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);
	const [reload, setReload] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "S" && user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Notificações"
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
			<NotificationsTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ListMyNotifications;
