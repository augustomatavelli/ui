// third-party
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// project import
import axios from "utils/axios";

// initial state
const initialState = {
	openItem: ["dashboard"],
	openComponent: "buttons",
	selectedID: null,
	drawerOpen: false,
	componentDrawerOpen: true,
	menu: {},
	error: null,
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
	name: "menu",
	initialState,
	reducers: {
		activeItem(state, action) {
			state.openItem = action.payload.openItem;
		},

		activeID(state, action) {
			state.selectedID = action.payload;
		},

		activeComponent(state, action) {
			state.openComponent = action.payload.openComponent;
		},

		openDrawer(state, action) {
			state.drawerOpen = action.payload;
		},

		openComponentDrawer(state, action) {
			state.componentDrawerOpen = action.payload.componentDrawerOpen;
		},

		hasError(state, action) {
			state.error = action.payload;
		},
	},
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID } = menu.actions;
