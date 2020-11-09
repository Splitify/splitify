import React, { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons'
import {
  Paper,
  IconButton,
  Button,
  Dialog,
  CircularProgress,
  makeStyles,
  Tooltip,
  ListItemSecondaryAction
} from '@material-ui/core';
import EditPlaylistNameDialog from './EditPlaylistNameDialog';
import { createOrUpdatePlaylist, getUserProfile } from '../helpers/helpers';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import {
  Playlist as PlaylistObj,
  Track as TrackObj,
  TrackFilter
} from '../types'
import GenreSelector from './GenreSelector'
import SortSelector from './SortSelector'
import MultiFilter from './MultiFilter'
import { FeatureSelector } from './FeatureSelector'
import TrackList from './TrackList'

const useStyles = makeStyles(theme => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap',
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
  // makeStyles



// const useStyles = makeStyles(theme => ({
//   table: {
//     //Add styling for tables here
//   },
//   root: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//     '& > *': {
//       margin: theme.spacing(0.5)
//     }
//   },
//   paper: {
//     width: 200,
//     height: 230,
//     overflow: 'auto'
//   },
//   button: {
//     margin: theme.spacing(0.5, 0)
//   }
// }))

export default function Subplaylist (props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onFilterUpdate?: (tracks: TrackObj[]) => any
  onDelete?: (playlist: PlaylistObj) => any
}) {

  const classes = useStyles();

  // SAVING ANIMATION STUFF
  const [saveDisabled, setsaveDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save")
  const [filterIsActive, setFilterIsActive] = useState(false);
  const [filterSelectorIsActive, setFilterSelectorIsActive] = useState(false);

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

    setsaveDisabled(true);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tracks, setTracks] = useState<TrackObj[]>([])

  // eslint-disable-next-line
  const [includedTracks, setIncludedTracks] = useState<TrackObj[]>([])
  // eslint-disable-next-line
  const [excludedTracks, setExcludedTracks] = useState<TrackObj[]>([])

  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => () =>
    true
  )

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)

  // TODO: Maybe put genres in each track
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    if (selectedGenres.length === 0) return true
    return selectedGenres.some((g: string) => track.genres.includes(g));
  }

  function handleSortAction (type: string) {
    const sortTracks = (track1: TrackObj, track2: TrackObj): number => {
      let var1: string = ''
      let var2: string = ''

      switch (type) {
        case 'Track Name':
          var1 = track1.name
          var2 = track2.name
          break
        case 'Artist':
          var1 = track1.artists[0].name
          var2 = track2.artists[0].name
          break
        case 'Album':
          if (track1.album) {
            var1 = track1.album.name
          }
          if (track2.album) {
            var2 = track2.album.name
          }
          break
        default:
          var1 = track1.name
          var2 = track2.name
      }
      return var1.localeCompare(var2)
    }

    setTracks([...tracks].sort(sortTracks))
    updateView()
  }

  useEffect(() => {
    // FIXME: Ordering property isn't persisted between updates to genre and features

    // Update the list of track in the playlist when the genre / features filter is changed
    setTracks(
      props.source.tracks
        .filter(TrackCorrectGenre)
        .filter(featureFilter)
        .filter(t => !excludedTracks.includes(t))
        .concat(includedTracks) // Add items after concat
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, featureFilter, excludedTracks, includedTracks])

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks;
    tracks.length === 0 ? setsaveDisabled(true) : setsaveDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  useEffect(() => {
    setTracks(props.playlist.tracks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlist.tracks])

  let [filterView, updateFilteredView] = useState<TrackObj[]>([])

  const updateView = useCallback(() => {
    let view = tracks.filter(trackFilter)
    updateFilteredView(view)
    props.onFilterUpdate && props.onFilterUpdate(view)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, props.onFilterUpdate])

  useEffect(() => {
    // Update the displayed items when the tracks change, or the track filter changes
    updateView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, excludedTracks])

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false)
            if (newName) props.playlist.name = newName
          }}
        />
      </Dialog>
      <List component={Paper}>
        <ListItem divider={true}>
          {props.playlist.name}
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
            <SortSelector onSort={handleSortAction} />
          <ListItemSecondaryAction>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => props.onDelete && props.onDelete(props.playlist)}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </ListItemSecondaryAction>
          <ListItem>
            {loading ? (
              <CircularProgress size={24} className={classes.buttonProgress} />
            ) : (
              filterIsActive || filterSelectorIsActive ? (
                <Tooltip title="Saving is disabled while filter is active.">
                  <span>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      className={buttonClassname} 
                      disabled={true}
                      onClick={handleButtonClick} 
                      startIcon={<SaveIcon />}>
                      {buttonLabel}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                saveDisabled ? (
                  <Tooltip title="No change since last save.">
                    <span>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        className={buttonClassname} 
                        disabled={saveDisabled} 
                        onClick={handleButtonClick} 
                        startIcon={<SaveIcon />}>
                        {buttonLabel}
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    className={buttonClassname} 
                    disabled={saveDisabled} 
                    onClick={handleButtonClick} 
                    startIcon={<SaveIcon />}>
                    {buttonLabel}
                  </Button>
                )
              )
            )}
          </ListItem>
        </ListItem>
        <ListItem divider={true} >
          <GenreSelector
            genres={props.genres}
            onSelect={values => setSelectedGenres(values)}
          />
        </ListItem>
        <FeatureSelector
          onUpdateFilterFunction={f => setFeatureFilter(() => f)}
          component={List}
          childComponent={ListItem}
          filterIsActive={f => setFilterSelectorIsActive(f)}
        />
        <Divider />
        <ListItem divider={true}>
          <MultiFilter
            callback={f => setTrackFilter(() => f)} 
            filterIsActive={f => setFilterIsActive(f)}
          />
        </ListItem>
        <TrackList
          id={props.playlist.id}
          tracks={filterView}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
