import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@material-ui/core'
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import Track from './Track';

const useStyles = makeStyles((theme) => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  paper: {
      width: 200,
      height: 230,
      overflow: 'auto',
  },
  button: {
      margin: theme.spacing(0.5, 0),
  },
}));

export default function Playlist(props: {
  playlist: PlaylistObj;
  genres: string[];
  onDelete: () => void;
}) {
  const classes = useStyles();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const TrackCorrectGenre = (track: TrackObj): boolean => {
    var found = false;
    track.artists.map((artist) => {
      artist.genres.map((genre) => {
        if (selectedGenres.includes(genre)) {
          found = true
        }
      })
    })
    return found;
  }
  
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{props.playlist.tracks[0]}</TableCell>
            <TableCell>
              <Button variant="contained" color="secondary" onClick={props.onDelete}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={props.genres}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option}
                  onChange={(event: any, newValue: string[]) => {
                    console.log(newValue)
                    setSelectedGenres(newValue);
                  }}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField  style={{ width: "100%" }} {...params} variant="outlined" label="Genres" placeholder="Add Genre" />
                  )}
                />
            </TableCell>
          </TableRow>
          {props.playlist.tracks.map((track: TrackObj) => {
            console.log(TrackCorrectGenre(track) === true)
            if (TrackCorrectGenre(track)) {
              return (<TableRow key={track.id}> 
                  <TableCell colSpan={2} component="th" scope="row">
                    <Track track={track} />
                  </TableCell>
                </TableRow>)
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
