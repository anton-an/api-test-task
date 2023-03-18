import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../store/store';
import { AnyAction } from '@reduxjs/toolkit';
import { Alert, Box, CircularProgress } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridRowParams,
  MuiEvent,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
} from '@mui/x-data-grid';

import {
  fetchUsers,
  deleteUser,
  updateUser,
  selectUsersData,
  selectUsersFetchStatus,
  createUser,
  selectUsersDeleteStatus,
  selectUsersUpdateStatus,
  selectUsersError,
} from '../../reducers/usersSlice';
import { NewUser, User } from '../../types/usersTypes';
import NewUserForm from '../NewUserForm/NewUserForm';

export default function UsersTable() {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const usersData = useSelector(selectUsersData);
  const fetchStatus = useSelector(selectUsersFetchStatus);
  const deleteStatus = useSelector(selectUsersDeleteStatus);
  const updateStatus = useSelector(selectUsersUpdateStatus);
  const error = useSelector(selectUsersError);
  const isLoading = fetchStatus === 'loading';
  const isError = fetchStatus === 'failed';
  const isDeleteLoading = deleteStatus === 'loading';
  const isUpdateLoading = updateStatus === 'loading';

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [deletingId, setDeletingId] = useState<User['id']>();
  const [updatingId, setUpdatingId] = useState<User['id']>();

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, fetchStatus, usersData]);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setUpdatingId((state) => (state = id));
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeletingId((state) => (state = id));
    dispatch(deleteUser(id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow: User) => {
    dispatch(updateUser({ id: newRow.id, data: newRow }));
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const onNewUserSubmit = (data: NewUser) => {
    dispatch(createUser({ data }));
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'User ID',
      width: 180,
      editable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
      editable: true,
    },
    {
      field: 'access',
      headerName: 'Access',
      type: 'boolean',
      width: 80,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 180,
      editable: true,
    },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      width: 180,
      type: 'date',
      valueGetter: ({ value }) => value && new Date(Date.parse(value)),
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={
              isUpdateLoading && updatingId === id ? (
                <CircularProgress size={24} sx={{ color: 'gray' }} />
              ) : (
                <Edit />
              )
            }
            disabled={isUpdateLoading && updatingId === id}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              isDeleteLoading && deletingId === id ? (
                <CircularProgress size={24} sx={{ color: 'gray' }} />
              ) : (
                <Delete />
              )
            }
            disabled={isDeleteLoading && deletingId === id}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 600,
        width: '80%',
        margin: '0 auto 2rem auto',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      {isError ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={usersData}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          pageSizeOptions={[10]}
          loading={isLoading}
          slots={{ toolbar: NewUserForm }}
          slotProps={{
            toolbar: { onNewUserSubmit },
          }}
        />
      )}
    </Box>
  );
}
