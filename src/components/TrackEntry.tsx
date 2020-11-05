import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Skeleton from '@material-ui/lab/Skeleton'

import { Track as TrackObj } from '../types'
import Track from './Track'

import DragHandleIcon from '@material-ui/icons/DragHandle'
import { ListItem, ListItemIcon } from '@material-ui/core'

export default function (props: {
  track: TrackObj
  parent?: string
  index?: number
  isDragDisabled?: boolean
  style?: any
}) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Draggable
      draggableId={`${props.parent}:${props.track.id}`}
      index={props.index ?? -1}
      isDragDisabled={props.isDragDisabled}
    >
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...props.style,
            ...provided.draggableProps.style,
            cursor: 'pointer',
            ...(snapshot.isDragging
              ? { backgroundColor: '#E6E6E6' }
              : undefined)
          }}
          divider={true}
        >
          {track ? (
            <>
              <Track track={track} isDragging={snapshot.isDragging} />
              {props.isDragDisabled ?? (
                <ListItemIcon>
                  <DragHandleIcon />
                </ListItemIcon>
              )}
            </>
          ) : (
            <Skeleton variant='rect' />
          )}
        </ListItem>
      )}
    </Draggable>
  )
}
