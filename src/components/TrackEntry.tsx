import React, { useState, useEffect } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Track as TrackObj } from '../types'
import { Draggable } from 'react-beautiful-dnd'
import Track from './Track'
import DragHandleIcon from '@material-ui/icons/DragHandle'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

export default function (props: {
  track: TrackObj
  parent?: string
  index?: number
  isDragDisabled?: boolean
  component: React.ElementType
}) {
  let [track, setTrack] = useState<TrackObj>()

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Wrapper = props.component;

  return (
    <Draggable
      draggableId={`${props.parent}:${props.track.id}`}
      index={props.index ?? -1}
      isDragDisabled={props.isDragDisabled}
    >
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            cursor: 'pointer',
            ...(snapshot.isDragging
              ? { backgroundColor: '#E6E6E6' }
              : undefined)
          }}
        >
          {track ? (
            <Track track={track} isDragging={snapshot.isDragging} />
          ) : (
            <Skeleton variant='rect' />
          )}
          {props.isDragDisabled ?? 
            <ListItemIcon>
              <DragHandleIcon />
            </ListItemIcon>
          }
        </Wrapper>
      )}
    </Draggable>
  )
}
