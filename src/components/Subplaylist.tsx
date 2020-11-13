import React, { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx';
import { green } from '@material-ui/core/colors';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@material-ui/icons'
import {
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';

import EditPlaylistNameDialog from './EditPlaylistNameDialog'

import { asPlaylistTrack, isTrackCustom, createOrUpdatePlaylist, getUserProfile } from '../helpers/helpers'

import {
  Playlist as PlaylistObj,
  Track as TrackObj,
  TrackFilter,
  CheckedList
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
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    width: 200,
    overflow: 'auto'
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
    marginTop: -12,
    marginLeft: -8,
  },
}))

export default function Subplaylist(props: {
  source: TrackObj[]
  playlist: PlaylistObj
  genres: string[]
  checked: CheckedList[]
  onTrackUpdate: () => void
  toggleChecked: (id: string, tracks: TrackObj) => any
  onFilterUpdate?: (tracks: TrackObj[]) => any
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()

  // SAVING ANIMATION STUFF
  const [saveDisabled, setsaveDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Save")
  const [filterIsActive, setFilterIsActive] = useState(false);
  const [trackGroup, setTrackGroups] = useState()

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
      }, 2000);
      // wait 4 seconds before reverting to normal save button
      setTimeout(() => {
        setButtonLabel("Save");
        setSuccess(false);
      }, 4000);
    }

    setsaveDisabled(true);
  };

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tracks, setTracks] = useState<TrackObj[]>(props.source)

  // eslint-disable-next-line
  const [includedTracks, setIncludedTracks] = useState<TrackObj[]>([])
  // eslint-disable-next-line
  const [excludedTracks, setExcludedTracks] = useState<TrackObj[]>([])

  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["ALL"])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => () =>
    true
  )

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)

  const TrackCorrectGenre = (track: TrackObj): boolean => {
    const intersection = selectedGenres.filter(g => track.genres.includes(g));
    let t = asPlaylistTrack(track)
    t.included_genres = intersection
    return intersection.length !== 0;
  }

  function handleSortAction(type: string) {
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
    tracks.sort(sortTracks).map((track) => console.log(track.name))
    updateView()
  }

  function doFilter(source: TrackObj[], ...filters: ((track: TrackObj) => boolean)[]): TrackObj[] {
    // Filter a track if either condition is met
    // Condition A: Track is custom
    // Condition B: Track meets all supplied filters
    return source.filter(t => isTrackCustom(t) || filters.every(f => f(t)))
  }

  useEffect(() => {
    const filters = [TrackCorrectGenre, featureFilter]

    // Update the list of track in the playlist when the genre / features filter is changed
    setTracks(
      doFilter(tracks, ...filters) // Existing current matches (to maintain ordering)
        .concat(doFilter(props.source, ...filters)) // New items from the source pool
        .filter((v, i, a) => a.indexOf(v) === i) // Dedup
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, featureFilter, props.source])

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks;
    props.onTrackUpdate()
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
  }, [tracks, trackFilter])

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false)
            if (newName) {
              props.playlist.name = newName
              setsaveDisabled(false);
            }
          }}
        />
      </Dialog>
      <List dense component={Paper}>
        <ListItem style={{ justifyContent: "space-between" }}>
          <Typography>
            {props.playlist.name}
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <SortSelector onSort={handleSortAction} />
          <Divider orientation="vertical" flexItem />
          {loading ? (
            <CircularProgress size={24} className={classes.buttonProgress} />
          ) : (
              filterIsActive ? (
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
          <Divider orientation="vertical" flexItem />
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={() => props.onDelete && props.onDelete(props.playlist)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </ListItem>
        <ListItem>
          <GenreSelector
            genres={props.genres}
            onSelect={values => setSelectedGenres(values)}
          />
        </ListItem>
        <FeatureSelector
          onUpdateFilterFunction={f => setFeatureFilter(() => f)}
          component={List}
          childComponent={ListItem}
        />
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
          showActions={false}
          isDeletable={true}
          showTrackCount={true}
          toggleChecked={props.toggleChecked}
          checked={props.checked}
        />
      </List>
    </div>
  )
}
