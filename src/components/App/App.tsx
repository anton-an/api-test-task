import UsersTable from '../UsersTable';
import './App.css';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div className="App">
      <Typography
        variant="h1"
        sx={{ fontSize: '3rem', margin: '1rem' }}
        color="GrayText"
      >
        Users Table
      </Typography>
      <UsersTable />
    </div>
  );
}

export default App;
