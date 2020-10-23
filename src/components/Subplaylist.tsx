import React, { useEffect, useState } from 'react'
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

export default function Subplaylist (props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  // TODO: Maybe put genres for each genre
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    for (let artist of track.artists) {
      for (let genre of artist.genres) {
        if (selectedGenres.includes(genre)) {
          return true
        }
      }
    }
    return false
  }

  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  let [tracks, setTracks] = useState(props.source.tracks)

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{props.playlist.tracks[0]}</TableCell>
            <TableCell>
              <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)}>
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
          {tracks.filter(TrackCorrectGenre).map(track => (
            <TableRow key={track.id}>
              <TableCell colSpan={2} component='th' scope='row'>
                <Track track={track} />
              </TableCell>
            </TableRow>
          ))}
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
