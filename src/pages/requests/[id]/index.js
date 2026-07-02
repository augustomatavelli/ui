import { Grid, List, Stack, Typography, Checkbox } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RequestContext from "contexts/RequestContext";
import useRequest from "hooks/useRequest";
import useRequestEdit from "hooks/useRequestEdit";
import Loader from "components/Loader";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import UserContext from "contexts/UserContext";
import AlertChecklistView from "sections/apps/orders/AlertChecklistView";
import RequestStatusChip from "sections/apps/requests/details/RequestStatusChip";
import RequestInfoList, { InfoRow } from "sections/apps/requests/details/RequestInfoList";
import RequestDateEditor from "sections/apps/requests/details/RequestDateEditor";
import RequestServicesSection from "sections/apps/requests/details/RequestServicesSection";
import RequestProductsSection from "sections/apps/requests/details/RequestProductsSection";
import RequestChecklistsSection from "sections/apps/requests/details/RequestChecklistsSection";
import RequestActions from "sections/apps/requests/details/RequestActions";

const RequestDetails = () => {
	const { findOneRequestById, updateRequest, deleteRequest, updateAbsence } = useRequest();
	const { searchAllProducts } = useProduct();
	const { searchAllOperations } = useOperation();

	const { requestDetails, setRequestDetails, loadingRequest } = useContext(RequestContext);
	const { searchProducts, loadingProduct } = useContext(ProductsContext);
	const { searchOperations, loadingOperation } = useContext(OperationsContext);
	const { user } = useContext(UserContext);

	const [open, setOpen] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState();

	const { id } = useParams();

	const {
		id_request,
		landing_date,
		takeoff_date,
		status,
		created_at,
		id_user,
		user_name,
		registration,
		membership,
		landing_site,
		id_landing_order,
		checklists,
		absence,
	} = requestDetails;

	const edit = useRequestEdit({ id, requestDetails, setRequestDetails, updateRequest, findOneRequestById, updateAbsence });

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	const handleOpenChecklist = (event, id_order) => {
		event.stopPropagation();
		/* setOpen(true);
		setSelectedOrder(id_order); */
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (id) {
			findOneRequestById(id);
		}
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Grid item xs={12}>
				<MainCard
					title="Detalhes da solicitação"
					secondary={
						!loadingRequest && (
							<Stack direction="row" spacing={2} alignItems="center">
								<RequestStatusChip status={status} absence={absence} />
								{(user.type === "A" || user.type === "S") && status === "A" && membership === "S" && (
									<Stack direction="row" alignItems="center" spacing={1}>
										<Checkbox style={{ padding: 0 }} checked={edit.checkedAbsence} onChange={edit.handleToggleCheckedAbsence} />
										<Typography>Ausência programada</Typography>
									</Stack>
								)}
							</Stack>
						)
					}
				>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingRequest ? (
								<Loader />
							) : (
								<>
									<List sx={{ py: 0 }}>
										<RequestInfoList id_request={id_request} landing_site={landing_site} registration={registration} user_name={user_name} created_at={created_at} />
										<RequestDateEditor
											label="Data agendada para pouso"
											field="landingDateField"
											dateValue={landing_date}
											status={status}
											isEditing={Boolean(edit.openEditInput["landingDateField"])}
											onToggleEdit={edit.handleOpenEditInput}
											onChangeDate={(e) => edit.handleEditRequest(e, "landing_date")}
											showError={true}
										/>
										<RequestDateEditor
											label="Data agendada para decolagem"
											field="takeoffDateField"
											dateValue={takeoff_date}
											status={status}
											isEditing={Boolean(edit.openEditInput["takeoffDateField"])}
											onToggleEdit={edit.handleOpenEditInput}
											onChangeDate={(e) => edit.handleEditRequest(e, "takeoff_date")}
											showError={false}
										/>
										<InfoRow label="Solicitado por" value={user_name} />
										<InfoRow label="Aberta em" value={created_at} />
										<RequestServicesSection
											open={edit.openOperations}
											setOpen={edit.setOpenOperations}
											openAddServices={edit.openAddServices}
											setOpenAddServices={edit.setOpenAddServices}
											loadingOperation={loadingOperation}
											editRequest={edit.editRequest}
											status={status}
											checked={edit.checked}
											setChecked={edit.setChecked}
											searchOperations={searchOperations}
											searchAllOperations={searchAllOperations}
											handleOpenEditInput={edit.handleOpenEditInput}
											handleDeleteService={edit.handleDeleteService}
											handleChange={edit.handleChange}
											handleCheckboxChange={edit.handleCheckboxChange}
										/>
										<RequestProductsSection
											open={edit.openProducts}
											setOpen={edit.setOpenProducts}
											openAddProducts={edit.openAddProducts}
											setOpenAddProducts={edit.setOpenAddProducts}
											loadingProduct={loadingProduct}
											editRequest={edit.editRequest}
											status={status}
											searchProducts={searchProducts}
											searchAllProducts={searchAllProducts}
											handleOpenEditInput={edit.handleOpenEditInput}
											handleDeleteProduct={edit.handleDeleteProduct}
											handleAddProduct={edit.handleAddProduct}
											handleChangeProductAmount={edit.handleChangeProductAmount}
											handleRemoveProduct={edit.handleRemoveProduct}
										/>
										<RequestChecklistsSection
											open={edit.openChecklists}
											setOpen={edit.setOpenChecklists}
											checklists={checklists}
											id_landing_order={id_landing_order}
											handleOpenChecklist={handleOpenChecklist}
										/>
									</List>
									<RequestActions
										status={status}
										user={user}
										id_user={id_user}
										id_request={id_request}
										showSave={edit.isDirty}
										openAlert={openAlert}
										onBack={() => {
											edit.resetStates();
											window.history.back();
										}}
										onSave={edit.handleEditSave}
										onOpenAlert={() => setOpenAlert(true)}
										handleAlertClose={handleAlertClose}
										deleteRequest={deleteRequest}
									/>
								</>
							)}
						</Grid>
					</Grid>
				</MainCard>
				<AlertChecklistView open={open} handleClose={handleClose} selectedOrder={selectedOrder} />
			</Grid>
		</>
	);
};

export default RequestDetails;
