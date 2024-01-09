import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Button, Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Grid } from '@mui/material';
import { Box, useMediaQuery, styled } from '@mui/material';
import { blueGrey, deepPurple } from '@mui/material/colors';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { IconButton, Drawer, List, ListItem, ListItemText, ButtonBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface User {
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
  };
  gender: string;
}
const StyledButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${deepPurple[500]} 30%, ${blueGrey[500]} 90%)`,
  border: 0,
  borderRadius: 15,
  color: 'white',
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));


async function fetchUsers(results = 1) {
  const response = await fetch(`https://randomuser.me/api/?results=${results}`);
  const data = await response.json();
  return data.results;
}

function App() {
  const [userList, setUserList] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const colorMode = darkMode ? 'dark' : 'light';
  const matches = useMediaQuery('(min-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Dashboard', 'Profile', 'Settings'].map((text, index) => (
          <ListItem key={text}>
            <ButtonBase>
              <ListItemText primary={text} />
            </ButtonBase>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  const theme = createTheme({
    palette: {
      mode: colorMode,
    },
  });

  const tema = useTheme();
  const isMobile = useMediaQuery(tema.breakpoints.down('sm'));

  

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);


  useEffect(() => {
    fetchUsers(5).then(setUserList);
  }, []);

  const addUser = async () => {
    const newUser = await fetchUsers();
    setUserList(prevUserList => [...prevUserList, ...newUser]);
  };

  const deleteUser = (index: number) => {
    setUserList(prevUserList => prevUserList.filter((_, i) => i !== index));
  };

  const openEditDialog = (index: number) => {
    setEditUser(userList[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleEditSave = () => {
    if (editUser && editIndex !== null) {
      setUserList(prevUserList => prevUserList.map((user, i) => i === editIndex ? editUser : user));
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          />
        </Toolbar>
      </AppBar>  
     
      <Box height="100vh" width="100%">
  
        <Grid container spacing={matches ? 2 : 0}>
          <Grid item xs={12}>
            {<TableContainer component={Paper}>
            {
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{`${user.name.first} ${user.name.last}`}</TableCell>
                    <TableCell>{user.location.city}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => deleteUser(index)}>Delete</Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => openEditDialog(index)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            }
          </TableContainer>
          
}<Box display="flex" justifyContent="flex-end" mt={2}>
              <StyledButton variant="contained" onClick={addUser}>Add User</StyledButton>
            </Box>
          </Grid>
        </Grid>
        {/* Rest of your JSX */
        <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name.first"
            label="First Name"
            type="text"
            fullWidth
            value={editUser?.name.first || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="name.last"
            label="Last Name"
            type="text"
            fullWidth
            value={editUser?.name.last || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="location.city"
            label="City"
            type="text"
            fullWidth
            value={editUser?.location.city || ''}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="gender"
            label="Gender"
            type="text"
            fullWidth
            value={editUser?.gender || ''}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>}
      </Box>
    </ThemeProvider>
  );
}

export default App;