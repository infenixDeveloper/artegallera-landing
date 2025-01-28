import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@services/api';

export const getUser = createAsyncThunk('/user', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/user/${id}`,);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: 'Error de red o servidor no responde' });
    }
  }
});


const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    balance: 0,
    status: "",
    error: "",
  },
  reducers: {
    user(state, action) {
      state.user = action.payload;
    },
    updateBalance(state, action) {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  },
});

export const { setUser, updateBalance } = userSlice.actions;
export default userSlice.reducer;
