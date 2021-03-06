import React, { useEffect, useState, useCallback } from 'react'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@material-ui/icons'
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
  Typography
} from '@material-ui/core'

import clsx from 'clsx'
import { green } from '@material-ui/core/colors'

import EditPlaylistNameDialog from './Actions/EditPlaylistNameDialog'

import {
  asPlaylistTrack,
  isTrackCustom,
  createOrUpdatePlaylist,
  getUserProfile,
  createOccurrenceMap
} from '../../helpers/helpers'

import {
  Playlist as PlaylistObj,
  Track as TrackObj,
  TrackFilter
} from '../../types'
import { SubplaylistActionType } from './Actions/types'

import GenreSelector from './Selectors/GenreSelector'
import { sortFunction } from './Actions/SortButton'
import MultiFilter from './Filters/MultiFilter'
import { FeatureSelector } from './Selectors/FeatureSelector'
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
    minWidth: 300
  },
  button: {
    margin: theme.spacing(0.5, 0),
    size: 'medium'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    marginTop: -12,
    marginLeft: -8
  }
}))

export default function Subplaylist (props: {
  source: TrackObj[]
  playlist: PlaylistObj
  genres: string[]

  onAction?: (action: SubplaylistActionType, data?: any) => any
}) {
  const classes = useStyles()

  let [eventDrilldown, _setEventDrilldown] = useState(false)
  const tick = () => _setEventDrilldown(v => !v)

  // SAVING ANIMATION STUFF
  const [saveDisabled, setSaveDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('Save')
  const [filterIsActive, setFilterIsActive] = useState(false)

  const buttonClassname = clsx({
    [classes.button]: true,
    [classes.buttonSuccess]: success
  })

  const handleButtonClick = async () => {
    if (!loading) {
      // Start loading animation while saving playlist
      setSuccess(false)
      setLoading(true)
      const user = await getUserProfile()
      await createOrUpdatePlaylist(user.id, props.playlist)
      // wait 2 seconds before telling the user the playlist has saved
      setTimeout(() => {
        setButtonLabel('Saved')
        setSuccess(true)
        setLoading(false)
      }, 2000)
      // wait 4 seconds before reverting to normal save button
      setTimeout(() => {
        setButtonLabel('Save')
        setSuccess(false)
      }, 4000)
    }

    setSaveDisabled(true)
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tracks, setTracks] = useState<TrackObj[]>(props.source)

  // Track selector
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['ALL'])
  const [featureFilter, setFeatureFilter] = useState<TrackFilter>(() => () =>
    true
  )
  const [genresRecord, setGenresRecord] = useState<Record<string, number>>({})

  // Visual properties
  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)

  const TrackCorrectGenre = (track: TrackObj): boolean => {
    const intersection = selectedGenres.filter(g => track.genres.includes(g))
    let t = asPlaylistTrack(track)
    t.included_genres = intersection
    return intersection.length !== 0
  }

  function handleSortAction (type: string) {
    // Compose sortFunction(type, ...)
    let sortFn = (track1: TrackObj, track2: TrackObj) =>
      sortFunction(type, track1, track2)

    setTracks([...tracks].sort(sortFn))

    updateView()
  }

  function doFilter (
    source: TrackObj[],
    ...filters: ((track: TrackObj) => boolean)[]
  ): TrackObj[] {
    // Filter a track if either condition is met
    // Condition A: Track is custom
    // Condition B: Track meets all supplied filters
    return source.filter(t => isTrackCustom(t) || filters.every(f => f(t)))
  }

  /**
   * Update the list of track in the playlist when the genre / features filter is changed
   */
  useEffect(() => {
    const filters = [TrackCorrectGenre, featureFilter]

    setTracks(
      doFilter(tracks, ...filters) // Existing current matches (to maintain ordering)
        .concat(doFilter(props.source, ...filters)) // New items from the source pool
        .filter((v, i, a) => a.indexOf(v) === i) // Dedup
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, featureFilter, props.source])

  /**
   * Update the list of genres when the `source` prop changes
   */
  useEffect(() => {
    setGenresRecord(createOccurrenceMap(props.source.map(t => t.genres).flat()))
  }, [props.source])

  /**
   * Save tracks to playlist when updated
   */
  useEffect(() => {
    props.playlist.tracks = tracks
    props.onAction && props.onAction('trackUpdate')
    setSaveDisabled(tracks.length === 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  /**
   * Update internal track storage when the `playlist` prop changes
   */
  useEffect(() => {
    setTracks(props.playlist.tracks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playlist.tracks])

  let [filterView, updateFilteredView] = useState<TrackObj[]>([])

  const updateView = useCallback(() => {
    let view = tracks.filter(trackFilter)
    updateFilteredView(view)
    props.onAction && props.onAction('filterUpdate', view)
    tick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, trackFilter, props.onAction])

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
              setSaveDisabled(false)
            }
          }}
        />
      </Dialog>
      <List dense component={Paper} className={classes.paper}>
        <ListItem style={{ justifyContent: 'space-between' }}>
          <Typography>{props.playlist.name}</Typography>
          <IconButton onClick={() => setEditDialogOpen(true)}>
            <EditIcon />
          </IconButton>
          <Divider orientation='vertical' flexItem />
          {loading ? (
            <CircularProgress size={24} className={classes.buttonProgress} />
          ) : filterIsActive ? (
            <Tooltip title='Saving is disabled while filter is active.'>
              <span>
                <Button
                  variant='contained'
                  color='primary'
                  className={buttonClassname}
                  disabled={true}
                  onClick={handleButtonClick}
                  startIcon={<SaveIcon />}
                >
                  {buttonLabel}
                </Button>
              </span>
            </Tooltip>
          ) : saveDisabled ? (
            <Tooltip title='No change since last save.'>
              <span>
                <Button
                  variant='contained'
                  color='primary'
                  className={buttonClassname}
                  disabled={saveDisabled}
                  onClick={handleButtonClick}
                  startIcon={<SaveIcon />}
                >
                  {buttonLabel}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <Button
              variant='contained'
              color='primary'
              className={buttonClassname}
              disabled={saveDisabled}
              onClick={handleButtonClick}
              startIcon={<SaveIcon />}
            >
              {buttonLabel}
            </Button>
          )}
          <Divider orientation='vertical' flexItem />
          <Button
            variant='contained'
            color='secondary'
            className={classes.button}
            onClick={() =>
              props.onAction && props.onAction('deletePlaylist', props.playlist)
            }
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </ListItem>
        <ListItem>
          <GenreSelector
            genres={genresRecord}
            selectedGenres={selectedGenres}
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
          isCheckEnabled={true}
          showActions={true}
          showTrackCount={true}
          onAction={(action, data) => {
            // Bubble the action up
            switch (action) {
              case 'sortTracks': {
                handleSortAction(data)
                break
              }
              default:
                props.onAction && props.onAction(action, data)
            }
          }}
          _refresh={eventDrilldown}
        />
      </List>
    </div>
  )
}
