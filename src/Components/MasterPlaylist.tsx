import React from 'react';

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


const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});


export default function MasterPlaylist(props: { playlist: PlaylistObj}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Master Playlist</TableCell>
            <TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
