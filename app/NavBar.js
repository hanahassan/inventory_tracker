import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#464682' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pantry Tracker
        </Typography>
        <Button color="inherit" component={Link} href="/">Home</Button>
      </Toolbar>
    </AppBar>
  );
}
