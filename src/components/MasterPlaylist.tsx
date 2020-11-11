import React, { useEffect, useState } from 'react'
import { Playlist as PlaylistObj, Track as TrackObj, TrackFilter } from '../types'
import { makeStyles, List, ListItem, Paper } from '@material-ui/core'

import MultiFilter from './MultiFilter'
import TrackList from './TrackList'
import ToggleButton from '@material-ui/lab/ToggleButton/ToggleButton'
import Popover from '@material-ui/core/Popover/Popover'
import { Info as InfoIcon, Replay as ReplayIcon } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton/IconButton'
import Box from '@material-ui/core/Box/Box'
import Divider from '@material-ui/core/Divider/Divider'

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  root: {
    width: '100%',
    minWidth: 300
  },
  paper: {
    padding: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1),
    whiteSpace: "nowrap"
  }
}))

export default function MasterPlaylist(
  props: {
    playlist: PlaylistObj,
    usedTracks: TrackObj[],
    onOpenSelector: () => void,
  }) {
  const classes = useStyles()

  const [trackFilter, setTrackFilter] = useState<TrackFilter>(() => () => true)
  const [filterUsedTracks, setFilterUsedTracks] = useState(false)
  const [popupAnchor, setPopupAnchor] = useState(null)


  // Async state update

  let _tick = useState(false)[1]
  const tick = () => _tick(v => !v)

  useEffect(() => {
    // Expand the playlist (get tracks) and update the UI every 250ms
    ; (async () => {
      let intl = setInterval(() => tick(), 250)
      props.playlist.expand().then(function () {
        clearInterval(intl)
        tick()
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // TODO: Changing playlist? props.playlist

  const usedFilter = (t: TrackObj) => {
    return !filterUsedTracks || !props.usedTracks.some((m: TrackObj) => m.id === t.id);
  }

  const calRecommendedGenres = () => {
    let map = new Map<string, number>();
    let filter = (t: TrackObj) => !props.usedTracks.some((m: TrackObj) => m.id === t.id);

    props.playlist.tracks
      .filter(filter)
      .map((t: TrackObj) => t.genres)
      .flat()
      .forEach((g: string) => map.set(g, (map.get(g) ?? 0) + 1));

    var mapAsc = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    mapAsc.splice(3, Number.MAX_SAFE_INTEGER);
    const suggestions = mapAsc.map(a => a[0]);

    if (suggestions.length === 0) {
      return "No suggestions"
    } else if (suggestions.length === 1) {
      return "Try " + suggestions[0];
    }

    const re = /(.*), (\w+)/
    const english = suggestions.join(', ').replace(re, 'Try $1 or $2')
    return english;
  }

  return (
    <div className={classes.root}>
      <List component={Paper}>
        <ListItem style={{ justifyContent: "space-between" }} >
          Master Playlist{props.playlist.name.includes('+') ? "s" : ""}: {props.playlist.name}
          <IconButton onClick={props.onOpenSelector}>
            <ReplayIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Box style={{ padding: 12 }}>
            <InfoIcon
              onMouseEnter={(event: any) => setPopupAnchor(event.currentTarget)}
              onMouseLeave={() => setPopupAnchor(null)}
            />
          </Box>
          <Popover
            id='mouse-over-popover'
            className={classes.popover}
            classes={{
              paper: classes.paper
            }}
            open={!!popupAnchor}
            anchorEl={popupAnchor}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            disableRestoreFocus
          >
            {popupAnchor == null ? "" : calRecommendedGenres()}
          </Popover>
          <Divider orientation="vertical" flexItem />
          <ToggleButton
            className={classes.button}
            size="small"
            selected={!filterUsedTracks}
            value={!filterUsedTracks}
            onChange={() => setFilterUsedTracks(!filterUsedTracks)}
          >
            Show All
          </ToggleButton>
        </ListItem>
        <ListItem divider={true}>
          <MultiFilter callback={f => setTrackFilter(() => f)} />
        </ListItem >

        <TrackList
          id={props.playlist.id}
          tracks={props.playlist.tracks.filter(trackFilter).filter(usedFilter)}
          isDragDisabled={true}
          isDropDisabled={true}
          component={List}
          childComponent={ListItem}
        />
      </List>
    </div>
  )
}
