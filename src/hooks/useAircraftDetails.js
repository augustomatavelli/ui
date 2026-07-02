import { useContext, useEffect, useState } from "react";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { validateImageFile } from "utils/file/validateImageFile";
import { readFileAsBase64 } from "utils/file/readFileAsBase64";

/**
 * Concentra a lógica da tela de detalhes da aeronave (leitura de imagem,
 * effects, toggles e remoção de operador). Comportamento idêntico ao original.
 */
const useAircraftDetails = (id) => {
	const { findOneAircraftById, removeLinkUserAircraft, deleteAircraft, toggleRestrictedAircraft, removeLinkOperatorAircraft, updateAircraftImage } = useAircraft();

	const { aircraftDetails, setAircraftDetails } = useContext(AircraftContext);

	const [checked, setChecked] = useState(false);
	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();

	const { id_aircraft, is_restricted } = aircraftDetails;

	const userId = localStorage.getItem("_userId");

	const handleremoveLinkUserAircraft = async () => {
		const response = await removeLinkUserAircraft(userId, id_aircraft);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		window.history.back();
	};

	const handleToggleChecked = async (event) => {
		setChecked(event.target.checked);
		const response = await toggleRestrictedAircraft(id_aircraft, event.target.checked ? "S" : "N");
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
	};

	const handleDeleteOperatorAircraft = async (operatorId, aircraftId) => {
		const response = await removeLinkOperatorAircraft(operatorId, aircraftId);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		await findOneAircraftById(aircraftId);
	};

	const handleSelectImage = (file) => {
		if (!file) return;
		const { valid, error } = validateImageFile(file);
		if (!valid) {
			dispatch(
				openSnackbar({
					open: true,
					message: error,
					variant: "alert",
					alert: {
						color: "warning",
					},
					close: false,
				})
			);
			return;
		}
		setSelectedImage(file);
	};

	useEffect(() => {
		const controller = new AbortController();
		findOneAircraftById(id, controller.signal);
		return () => controller.abort();
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		is_restricted === "S" ? setChecked(true) : setChecked(false);
	}, [is_restricted]);

	useEffect(() => {
		const updateAircraftImageImage = async () => {
			if (selectedImage) {
				setAvatar(URL.createObjectURL(selectedImage));

				let base64Image = "";
				base64Image = await readFileAsBase64(selectedImage);

				const aircraftBody = {
					image: selectedImage ? base64Image : "",
				};

				await updateAircraftImage(id_aircraft, aircraftBody);
				await findOneAircraftById(id_aircraft);
			}
		};

		updateAircraftImageImage();
	}, [selectedImage, id_aircraft]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		aircraftDetails,
		setAircraftDetails,
		deleteAircraft,
		checked,
		selectedImage,
		avatar,
		handleremoveLinkUserAircraft,
		handleToggleChecked,
		handleDeleteOperatorAircraft,
		handleSelectImage,
	};
};

export default useAircraftDetails;
