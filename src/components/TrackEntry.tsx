import React, { useState, useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Track as TrackObj } from '../types'
// import Track from './Track'

// let id: number = 0

export default function (props: { track: TrackObj }) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {track ? (
        /*<Track track={track} />*/ track.name
      ) : (
        <Skeleton variant='rect' />
      )}
    </>
  )
}
