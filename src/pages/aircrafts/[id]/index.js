import { Grid, List, Typography, Checkbox } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "contexts/UserContext";
import useAircraftDetails from "hooks/useAircraftDetails";
import AircraftImageUploader from "sections/apps/aircrafts/details/AircraftImageUploader";
import AircraftInfoList from "sections/apps/aircrafts/details/AircraftInfoList";
import AircraftOperatorsSection from "sections/apps/aircrafts/details/AircraftOperatorsSection";
import AircraftActions from "sections/apps/aircrafts/details/AircraftActions";
import AircraftLinkDialogs from "sections/apps/aircrafts/details/AircraftLinkDialogs";

const AircraftDetails = () => {
	const { user } = useContext(UserContext);

	const { id } = useParams();

	const { aircraftDetails, setAircraftDetails, deleteAircraft, checked, selectedImage, avatar, handleToggleChecked, handleDeleteOperatorAircraft, handleSelectImage } = useAircraftDetails(id);

	const [open, setOpen] = useState(false);
	const [openOperator, setOpenOperator] = useState(false);
	const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);

	const { id_aircraft, registration, image, membership, status, operators, modelo } = aircraftDetails;

	const isAdmin = user.type === "A" || user.type === "S";

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard
					title="Detalhes da aeronave"
					secondary={
						isAdmin && (
							<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Checkbox style={{ padding: 0 }} checked={checked} onChange={handleToggleChecked} />
								<Typography>Tornar aeronave restrita</Typography>
							</Grid>
						)
					}
				>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={4} md={3}>
							<AircraftImageUploader image={image} selectedImage={selectedImage} avatar={avatar} isAdmin={isAdmin} onSelect={handleSelectImage} />
						</Grid>
						<Grid item xs={12} sm={8} md={9}>
							<List sx={{ py: 0 }}>
								<AircraftInfoList registration={registration} modelo={modelo} status={status} membership={membership} />
								<AircraftOperatorsSection operators={operators} user={user} id={id} onAddOperator={() => setOpenOperator(true)} onDeleteOperator={handleDeleteOperatorAircraft} />
							</List>
							<AircraftActions
								user={user}
								registration={registration}
								id_aircraft={id_aircraft}
								openAlert={openAlert}
								onBack={() => {
									window.history.back();
									setAircraftDetails({});
								}}
								onOpenAlert={() => setOpenAlert(true)}
								handleAlertClose={handleAlertClose}
								deleteAircraft={deleteAircraft}
							/>
						</Grid>
					</Grid>
				</MainCard>
			</Grid>
			<AircraftLinkDialogs
				open={open}
				setOpen={setOpen}
				openConfirmRemove={openConfirmRemove}
				setOpenConfirmRemove={setOpenConfirmRemove}
				openOperator={openOperator}
				setOpenOperator={setOpenOperator}
			/>
		</>
	);
};

export default AircraftDetails;
