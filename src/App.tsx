import React from 'react';
import Playlist from './Components/Playlist'
import MasterPlaylist from './Components/MasterPlaylist'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import data from './stubs/playlistStub.json';
import { PlaylistObj } from './helpers/interfaces';

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

  const [playlists, setPlaylists] = useState([0]); // TODO: replace this with some 

  const deletePlaylist = (id: Number) => {
    console.log("Deleting playlist ", id);
    setPlaylists(playlists.filter(k => k !== id));
  }

  const addPlaylist = () => {
    var id = Math.max(...playlists) + 1;
    if (!isFinite(id)) id = 0;
    console.log("Adding playlist ", id);
    setPlaylists([...playlists, id]); 
  }

  const playlistData: PlaylistObj = data;

  return (
    <div className={classes.root}>
      <Grid style={{padding:"10%"}} container spacing={5}>
      <Grid item xs={4}>
        <MasterPlaylist playlist={playlistData}/>
      </Grid>
      {playlists.map(p => (
        <Grid item xs={4}>
          <Playlist playlist={playlistData} id={p} delete={() => deletePlaylist(p)}/>
        </Grid>
      ))}
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => addPlaylist()}>
            Add
          </Button>
        </Grid>
      </Grid>
    </div>
    
  );
}
