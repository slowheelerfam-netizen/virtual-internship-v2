import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  view: "login" | "register";
}

const initialState: ModalState = {
  isOpen: false,
  view: "login",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.view = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { openModal, closeModal, setView } = modalSlice.actions;
export default modalSlice.reducer;