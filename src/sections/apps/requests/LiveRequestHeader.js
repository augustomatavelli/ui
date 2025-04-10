import { Grid, Typography } from "@mui/material";
import { ClockCircleOutlined } from "@ant-design/icons";
import LogoHeliforte from "../../../assets/images/LogoHeliforte.svg";
import { useContext, useEffect } from "react";
import RequestContext from "contexts/RequestContext";

function LiveRequestsHeader() {
	const { liveRequests } = useContext(RequestContext);

	useEffect(() => {}, [liveRequests]);

	return (
		<>
			<Grid sx={{ display: "flex", width: "100%", justifyContent: "space-around", alignItems: "center", color: "white", py: 5 }}>
				<Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<ClockCircleOutlined style={{ color: "white", fontSize: 50 }} />
					<Typography sx={{ fontSize: 50, textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
				</Grid>
				<Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Typography sx={{ fontSize: 50, textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>PROGRAMAÇÃO</Typography>
				</Grid>
				<Grid sx={{ display: "flex", alignItems: "center", flexDirection: "column", gap: 2 }}>
					<img src={LogoHeliforte} alt="Logo" width="200" />
					{liveRequests.length > 0 && <Typography sx={{ fontSize: 20, textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)" }}>{`${liveRequests[0].city} / ${liveRequests[0].uf}`}</Typography>}
				</Grid>
			</Grid>
		</>
	);
}

export default LiveRequestsHeader;
