import React, { useEffect, useState } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import {
  IconButton,
  Button,
  Checkbox,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress
} from '@material-ui/core'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import { createOrUpdatePlaylist, getUserProfile } from '../helpers/helpers';
import MultiFilter, { TrackFilter } from './MultiFilter'
import TrackEntry from './TrackEntry'

const useStyles = makeStyles(theme => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  button: {
    margin: theme.spacing(0.5, 0),
    size: 'medium'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '40%',
    marginTop: -12,
    marginLeft: -8,
  },
}))

export default function Subplaylist(props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {

  const classes = useStyles();

  // SAVING ANIMATION STUFF
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save")

  const buttonClassname = clsx({
    [classes.button]: true,
    [classes.buttonSuccess]: success,
  });

  const handleButtonClick = async () => {
    if (!loading) {
      // Start loading animation while saving playlist
      setSuccess(false);
      setLoading(true);
      const user = await getUserProfile();
      await createOrUpdatePlaylist(user.id, props.playlist);
      // wait 2 seconds before telling the user the playlist has saved
      setTimeout(() => {
        setButtonLabel("Saved");
        setSuccess(true);
        setLoading(false);
      },2000);
      // wait 4 seconds before reverting to normal save button
      setTimeout(() => { 
        setButtonLabel("Save");
        setSuccess(false);
      },4000);
    }
    setActive(false);
  };

  const [trackFilter, setTrackFilter] = useState<TrackFilter>({ filter: (t: TrackObj) => true });

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

  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  useEffect(() => {
    console.log("SELECTED GENRES: ", selectedGenres)
    setTracks(props.source.tracks.filter(TrackCorrectGenre))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres])

  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  let [tracks, setTracks] = useState(Array<TrackObj>());

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks;
    tracks.length === 0 ? setActive(false) : setActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false);
            if (newName) props.playlist.name = newName;
          }} />
      </Dialog>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                {props.playlist.name}
                <IconButton onClick={() => setEditDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)} startIcon={<DeleteIcon />}>
                  Delete
                </Button>
              </TableCell>
              <TableCell className={classes.wrapper}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={buttonClassname} 
                  disabled={!active} 
                  onClick={handleButtonClick} 
                  startIcon={<SaveIcon />}>
                  {buttonLabel}
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={props.genres}
                  disableCloseOnSelect
                  getOptionLabel={option => option}
                  onChange={(event: any, newValue: string[]) => {
                    console.log(newValue)
                    setSelectedGenres(newValue)
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
                  renderInput={params => (
                    <TextField
                      style={{ width: '100%' }}
                      {...params}
                      variant='outlined'
                      label='Genres'
                      placeholder='Add Genre'
                    />
                  )}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MultiFilter callback={(f: TrackFilter) => setTrackFilter(f)} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.filter(TrackCorrectGenre).filter(trackFilter.filter).map(track => (
              <TrackEntry track={track} key={track.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
