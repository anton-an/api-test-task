import React, { useState } from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import styled from '@emotion/styled';
import { NewUser } from '../../types/usersTypes';
import { useSelector } from 'react-redux';
import { selectUsersCreateStatus } from '../../reducers/usersSlice';

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem',
  borderBottom: 'solid 1px rgba(224, 224, 224, 1)',
  '@media(max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const StyledTextField = styled(TextField)({
  paddingRight: '1rem',
  '@media(max-width: 768px)': {
    alignSelf: 'flex-start',
    width: '100%',
    paddingBottom: '1rem',
  },
});

const StyledCheckbox = styled(Checkbox)({
  alignSelf: 'center',
  paddingRight: '1rem',
  '@media(max-width: 768px)': {
    paddingBottom: '1rem',
  },
});

type NewUserFormProps = {
  onNewUserSubmit: (data: NewUser) => void;
};

const NewUserForm: React.FC<NewUserFormProps> = ({ onNewUserSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lastName: '',
    access: false,
    birthDate: '',
  });

  const status = useSelector(selectUsersCreateStatus);
  const isLoading = status === 'loading';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.id]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser: NewUser = {
      name: formData.name,
      email: formData.email,
      lastName: formData.lastName,
      access: formData.access,
      birthDate: formData.birthDate,
    };
    onNewUserSubmit(newUser);
    setFormData({
      name: '',
      email: '',
      lastName: '',
      access: false,
      birthDate: '',
    });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledTextField
        required
        id="name"
        label="Name"
        value={formData.name}
        onChange={handleInputChange}
        size="small"
      />
      <StyledTextField
        required
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        size="small"
      />
      <StyledTextField
        required
        id="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleInputChange}
        size="small"
      />
      <StyledTextField
        id="birthDate"
        label="Birth Date"
        type="date"
        value={formData.birthDate}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        size="small"
      />
      <FormControlLabel
        control={
          <StyledCheckbox
            id="access"
            checked={formData.access}
            onChange={handleInputChange}
            name="access"
            color="primary"
          />
        }
        label="Access"
      />
      {isLoading ? (
        <CircularProgress variant="indeterminate" />
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          <Typography variant="button">Add User</Typography>
        </Button>
      )}
    </StyledForm>
  );
};

export default NewUserForm;
