import React from 'react';
import Playlist from './Components/Playlist'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
  return (
    <div className={classes.root}>
      <Grid style={{padding:"10%"}} container spacing={5}>
        <Grid item xs={4}>
          <Playlist />
        </Grid>
        <Grid item xs={4}>
          <Playlist />
        </Grid>
        <Grid item xs={4}>
          <Playlist />
        </Grid>
      </Grid>
    </div>
    
  );
}