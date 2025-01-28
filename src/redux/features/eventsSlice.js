import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@services/api";

export const getLastEvent = createAsyncThunk("api/events", async () => {
  try {
    const token = Cookies.get("access_token");
    const { data } = await api.get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.data.sort((a, b) => a.id - b.id).pop();

  } catch (error) {
    console.error(error);
    throw new Error("Error fetching events");
  }
});


const lastEventSlice = createSlice({
  name: "lastEvent",
  initialState: {
    event: [],
    status: null,
    loading: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLastEvent.pending, (state) => {
        state.status = "Pending"
        state.loading = true
      })
      .addCase(getLastEvent.fulfilled, (state, action) => {
        state.event = action.payload
        state.loading = false
        state.status = "success"
      })
      .addCase(getLastEvent.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
  }
})

export default lastEventSlice.reducer