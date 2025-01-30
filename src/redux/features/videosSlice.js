import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@services/api";

export const getPromotions = createAsyncThunk("api/promotions", async () => {
  try {
    const response = await api.get("/video");

    return response.data.promotions;

  } catch (error) {
    console.error(error);
    throw new Error("Error fetching promotions");
  }
});

const promotionsSlice = createSlice({
  name: "promotions",
  initialState: {
    videos: [],
    status: null,
    loading: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPromotions.pending, (state) => {
        state.status = "Pending";
        state.loading = true;
      })
      .addCase(getPromotions.fulfilled, (state, action) => {
        state.videos = action.payload;
        state.loading = false;
        state.status = "success";
      })
      .addCase(getPromotions.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export default promotionsSlice.reducer;