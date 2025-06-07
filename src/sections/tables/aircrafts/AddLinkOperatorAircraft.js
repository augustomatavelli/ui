import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Typography } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleFilled } from "@ant-design/icons";
import useAircraft from "hooks/useAircraft";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import AircraftContext from "contexts/AircraftContext";
import Loader from "components/Loader";
import OperatorContext from "contexts/OperatorContext";
import useOperator from "hooks/useOperator";
import SearchOperator from "sections/apps/operators/SearchOperator";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Documento", key: "doc" },
];

export default function AddLinkOperatorAircraftTable() {
	const { searchAllOperators } = useOperator();
	const { addLinkOperatorAircraft } = useAircraft();

	const { searchOperator, setSearchOperator, loadingOperator } = useContext(OperatorContext);

	const { searchOperatorAircraftLink, loadingAircraft } = useContext(AircraftContext);

	const { id } = useParams();
	const theme = useTheme();

	const handleAddLinkOperatorAircraft = async (operatorId) => {
		const payload = { operatorId: operatorId, aircraftId: Number(id) };

		const response = await addLinkOperatorAircraft(payload);
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
		await searchAllOperators(searchOperatorAircraftLink, Number(id), false);
	};

	useEffect(() => {
		if (searchOperatorAircraftLink) {
			searchAllOperators(searchOperatorAircraftLink, Number(id), false);
		} else {
			setSearchOperator([]);
		}
	}, [searchOperatorAircraftLink]);

	return (
		<MainCard>
			<SearchOperator />
			<TableContainer>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Documento</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingOperator || loadingAircraft ? (
							<Loader />
						) : searchOperator.length > 0 ? (
							searchOperator.map((operator) => (
								<TableRow hover key={operator.id_operator}>
									<TableCell align="center">
										<PlusCircleFilled
											style={{
												fontSize: 20,
												color: theme.palette.primary.main,
												cursor: "pointer",
											}}
											onClick={() => {
												handleAddLinkOperatorAircraft(operator.id_operator);
											}}
										/>
									</TableCell>
									<TableCell align="center">{operator.name}</TableCell>
									<TableCell align="center">{operator.email}</TableCell>
									<TableCell align="center">{operator.mobile}</TableCell>
									<TableCell align="center">{operator.doc}</TableCell>
								</TableRow>
							))
						) : searchOperatorAircraftLink === "" ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<Typography variant="h5">Pesquise por um operador</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<Typography variant="h5">Nenhum operador encontrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</MainCard>
	);
}
