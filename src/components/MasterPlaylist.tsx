import React, { useEffect, useState } from 'react'
import TrackEntry from './TrackEntry'
import { allGenresFromPlaylist } from '../helpers/helpers'
import { Playlist as PlaylistObj } from '../types'
import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'

const useStyles = makeStyles({
  table: {
    //Add styling for tables here
  }
})

export default function MasterPlaylist (props: { playlist: PlaylistObj }) {
  const classes = useStyles()

  // Note: This genre list is likely to be incomplete until all Tracks have been expanded
  // Then again idk - Andrew
  const [genres, setGenres] = useState<string[]>([]);

  // Async state update
  let _tick = useState(false)[1]
  const tick = () => _tick(v => !v)

  useEffect(() => {
    // Expand the playlist (get tracks) and update the UI every 250ms
    ;(async () => {
      let intl = setInterval(() => tick(), 250)
      props.playlist.expand().then(function () {
        clearInterval(intl)
        tick()
        Promise.all(props.playlist.tracks.map(t => t.expand())).then(
          () => setGenres(allGenresFromPlaylist(props.playlist))
        )
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // TODO: Changing playlist? props.playlist

  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: 1000, overflow: 'auto' }}
    >
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow key='heading'>
            <TableCell>Master Playlist: {props.playlist.name}</TableCell>
          </TableRow>
          <TableRow key='genres'>
            <TableCell>{genres.toString()}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.playlist.tracks.map((track, i) => (
            <TrackEntry track={track} key={i} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
