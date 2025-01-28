import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark", // Siempre inicializamos con el tema oscuro
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Reducers vacíos para evitar cambiar el estado
    setTheme: (state) => {
      state.theme = "dark"; // Aseguramos que siempre sea "dark"
      localStorage.setItem("theme", "dark");
    },
  },
});

// Exportar la acción para setTheme, aunque no sea útil aquí
export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
