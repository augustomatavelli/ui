import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { Box, FormLabel, Avatar, TextField, Stack, Typography, useTheme } from "@mui/material";
import { CameraOutlined } from "@ant-design/icons";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";

const ImageFileInput = ({ id, onSelect }) => (
	<TextField
		type="file"
		id={id}
		placeholder="Outlined"
		variant="outlined"
		sx={{ display: "none" }}
		onChange={(e) => {
			const file = e.target.files?.[0];
			if (file) {
				onSelect(file);
			}
		}}
	/>
);

ImageFileInput.propTypes = {
	id: PropTypes.string,
	onSelect: PropTypes.func,
};

const AircraftImageUploader = ({ image, selectedImage, avatar, isAdmin, onSelect }) => {
	const theme = useTheme();

	// Cria a object URL apenas quando o arquivo muda e a revoga ao trocar/desmontar,
	// evitando vazamento de memória (antes era recriada a cada render sem revogar).
	const previewUrl = useMemo(() => (selectedImage ? URL.createObjectURL(selectedImage) : ""), [selectedImage]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	if (image || selectedImage) {
		const src = image ? image : previewUrl;
		return (
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				{isAdmin ? (
					<FormLabel
						htmlFor="change-aircraft-image"
						sx={{
							cursor: "pointer",
							display: "block",
							width: "100%",
							position: "relative",
						}}
					>
						<img
							src={src}
							alt="Aircraft"
							style={{
								width: "100%",
								height: "200px",
								objectFit: "cover",
								cursor: "pointer",
							}}
						/>
						<Box
							sx={{
								position: "absolute",
								top: "8px",
								right: "8px",
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								borderRadius: "50%",
								padding: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
							}}
						>
							<CameraAltIcon sx={{ color: "white", fontSize: "1rem" }} />
						</Box>
					</FormLabel>
				) : (
					<img
						src={src}
						alt="Aircraft"
						style={{
							width: "100%",
							height: "200px",
							objectFit: "cover",
						}}
					/>
				)}
				{isAdmin && <ImageFileInput id="change-aircraft-image" onSelect={onSelect} />}
			</Box>
		);
	}

	if (isAdmin) {
		return (
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 3 }}>
				<FormLabel
					htmlFor="change-avtar"
					sx={{
						position: "relative",
						borderRadius: "50%",
						overflow: "hidden",
						"&:hover .MuiBox-root": { opacity: 1 },
						cursor: "pointer",
					}}
				>
					<Avatar alt="Avatar 1" src={avatar} sx={{ width: 144, height: 144, border: "1px dashed" }}>
						{!avatar && (
							<Stack spacing={0.5} alignItems="center">
								<CameraOutlined style={{ color: theme.palette.secondary.light, fontSize: "2rem" }} />
								<Typography sx={{ color: "secondary.lighter" }}>Carregar foto</Typography>
							</Stack>
						)}
					</Avatar>
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							backgroundColor: "rgba(0,0,0,.25)",
							width: "100%",
							height: "100%",
							opacity: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					/>
				</FormLabel>
				<ImageFileInput id="change-avtar" onSelect={onSelect} />
			</Box>
		);
	}

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 3 }}>
			<Avatar alt="aircraft" sx={{ width: 144, height: 144, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
				<AirplanemodeActiveIcon style={{ fontSize: 100 }} />
			</Avatar>
		</Box>
	);
};

AircraftImageUploader.propTypes = {
	image: PropTypes.string,
	selectedImage: PropTypes.object,
	avatar: PropTypes.string,
	isAdmin: PropTypes.bool,
	onSelect: PropTypes.func,
};

export default AircraftImageUploader;
