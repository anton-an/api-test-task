import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, NewUser } from '../types/usersTypes';
import { RootState } from '../store/store';

type status = 'idle' | 'loading' | 'success' | 'failed';

export type UsersState = {
  data: User[];
  fetchStatus: status;
  createStatus: status;
  deleteStatus: status;
  updateStatus: status;
  error: string | null;
};

const apiUrl = 'https://retoolapi.dev/eqsQ4S/users';

export const fetchUsers = createAsyncThunk<User[], void>(
  'users/fetch',
  async () => {
    const { data } = await axios.get(apiUrl);
    return data;
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: number | string; data: User }
>('users/update', async ({ id, data }) => {
  const { data: updatedUser } = await axios.put(`${apiUrl}/${id}`, data);
  return updatedUser;
});

export const createUser = createAsyncThunk<User, { data: NewUser }>(
  'users/create',
  async ({ data }) => {
    const { data: newUser } = await axios.post(apiUrl, data);
    return newUser;
  }
);

export const deleteUser = createAsyncThunk<void, string | number>(
  'users/delete',
  async (id) => {
    await axios.delete(`${apiUrl}/${id}`);
  }
);

const initialState: UsersState = {
  data: [],
  fetchStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.fetchStatus = 'success';
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error.message || 'Error fetching users!';
      })
      .addCase(createUser.pending, (state, action) => {
        state.createStatus = 'loading';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.error.message || 'Error creating user!';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const newUser = action.payload;
        state.createStatus = 'success';
        state.data = [...state.data, newUser];
      })
      .addCase(updateUser.pending, (state, action) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Error updating user!';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.updateStatus = 'success';
        const userIndex = state.data.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.data[userIndex] = updatedUser;
        }
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message || 'Error deleting user!';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.meta.arg;
        state.deleteStatus = 'success';
        state.data = state.data.filter((user) => user.id !== deletedUserId);
      });
  },
});

export const selectUsersFetchStatus = (state: RootState) =>
  state.users.fetchStatus;
export const selectUsersCreateStatus = (state: RootState) =>
  state.users.createStatus;
export const selectUsersUpdateStatus = (state: RootState) =>
  state.users.updateStatus;
export const selectUsersDeleteStatus = (state: RootState) =>
  state.users.deleteStatus;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersData = (state: RootState) => state.users.data;

export default usersSlice.reducer;
