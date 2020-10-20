import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Track from './Track';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { getPlaylist } from '../helpers/helpers';
import { getStorage } from '../helpers/localStorage';
import SpotifyAPI from 'spotify-web-api-js'


const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});

const a = async () => {
  const authStore = getStorage('auth');
  const token =  await authStore.getItem('token') as string;
  let api = new SpotifyAPI();
  api.setAccessToken(token);
  console.log(await getPlaylist(api));
}


export default function MasterPlaylist(props: { playlist: PlaylistObj}) {
  a();
  


  const classes = useStyles();
  const allGenres: Array<string> = []
  props.playlist.tracks.map((track: TrackObj) => (
    allGenres.push(" " + track.album.genres + " ")
  ))
  const [genres, setGenres] = useState(allGenres)

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Master Playlist</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow>
          <TableCell>
            {genres}
          </TableCell>
        </TableRow>
          {props.playlist.tracks.map((track: TrackObj) => (
            <TableRow key={track.id}>
              <TableCell component="th" scope="row">
                <Track track={track}/>
              </TableCell>
            </TableRow>
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
  );
}
