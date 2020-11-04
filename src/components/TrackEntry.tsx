import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Skeleton from '@material-ui/lab/Skeleton'

import { Track as TrackObj } from '../types'
import Track from './Track'

import DragHandleIcon from '@material-ui/icons/DragHandle'
import { ListItem, ListItemIcon, Checkbox } from '@material-ui/core'

export default function (props: {
  track: TrackObj
  parent?: string
  index?: number
  isDragDisabled?: boolean
}) {
  let [track, setTrack] = useState<TrackObj>()
  let [checked, setChecked] = useState<string[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.id)
  };

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
              <Checkbox
                  checked={checked.indexOf(track) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
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
