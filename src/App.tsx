import React from 'react';
import Playlist from './Components/Playlist'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  playlist: {
    //Add styling for playlists here
  },
}));

export default function App() {
  //The width of the grids have to be dynamic, not a fixed width
  const classes = useStyles();

  const [playlists, setPlaylists] = useState([0]);

  return (
    <div className={classes.root}>
      <Grid style={{padding:"10%"}} container spacing={5}>
      {playlists.map(p => (
        <Grid item xs={4}>
          <Playlist/>
        </Grid>
      ))}
        <Grid item xs={2}>
          <Button variant="contained" color="primary">
            Add
          </Button>
        </Grid>
      </Grid>
    </div>
    
  );
}
