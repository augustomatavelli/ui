import { useState } from "react";
import { Grid, Dialog } from "@mui/material";

import MainCard from "components/MainCard";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";

// project import
import { PopupTransition } from "components/@extended/Transitions";

// assets
import AddHelicopter from "sections/apps/aircrafts/AddAircraft";

const AddHelicopterCard = () => {
	const [add, setAdd] = useState(false);
	const [helicopter, setHelicopter] = useState(null);

	const handleAdd = () => {
		setAdd(!add);
		if (helicopter && !add) setHelicopter(null);
	};

	return (
		<>
			<Grid item xs={12} sm={6} lg={3}>
				<MainCard
					sx={{
						height: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						cursor: "pointer",
						transition: "0.3s",
						"&:hover": { transform: "scale(1.05)" },
					}}
					onClick={handleAdd}
				>
					<AddCircleTwoToneIcon sx={{ fontSize: 100, color: "#E0E0E0" }} />
				</MainCard>
			</Grid>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={add} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddHelicopter customer={helicopter} onCancel={handleAdd} />
			</Dialog>
		</>
	);
};

export default AddHelicopterCard;
