import React, { useState, useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Track as TrackObj } from '../types'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Track from './Track'

export default function (props: { track: TrackObj }) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TableRow style={{cursor: 'pointer'}}>
      <TableCell colSpan={100}>
        {track ? (
          <Track track={track} />
        ) : (
          <Skeleton variant='rect' />
        )}
      </TableCell>
    </TableRow>
  )
}
