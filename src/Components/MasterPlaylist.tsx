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
import { PlaylistObj, PlaylistTrackObj, TrackObj } from '../helpers/interfaces';

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  },
});


interface ComponentProps {
    playlist: PlaylistObj;
  }

export default function MasterPlaylist(props: ComponentProps) {
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
          {props.playlist.tracks.items.map((trackobj: PlaylistTrackObj) => (
            <TableRow key={trackobj.track.name}>
              <TableCell component="th" scope="row">
                <Track track={trackobj.track}/>
              </TableCell>
            </TableRow>
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
  );
}
