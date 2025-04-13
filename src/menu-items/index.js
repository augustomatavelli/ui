// project import
import admin from "./admin";
import forms from "./forms";
import formsResp from "./formsResp";
import reports from "./reports";
import staff from "./staff";
import help from "./help";

// ==============================|| MENU ITEMS ||============================== //

//TODO: navegação do menu lateral
const menuItems = {
	items: [admin, forms, formsResp, staff, reports, help],
};

export default menuItems;
