import React, { useState, useEffect } from 'react'
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  Checkbox
} from '@material-ui/core'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Skeleton from '@material-ui/lab/Skeleton'

import { Track as TrackObj } from '../../types'

import { Draggable } from 'react-beautiful-dnd'
import { asPlaylistTrack } from '../../helpers/helpers'

import Track from './Track'

export default function (props: {
  track: TrackObj
  index?: number
  isDragDisabled?: boolean

  canCheck?: boolean
  isChecked?: boolean
  toggleChecked: (state: boolean) => any

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
      draggableId={asPlaylistTrack(props.track).uuid!}
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
            ...(snapshot.isDragging && { backgroundColor: '#E6E6E6' })
          }}
          divider={true}
        >
          {track ? (
            <>
              {props.canCheck && (
                <Checkbox
                  checked={props.isChecked}
                  tabIndex={-1}
                  onChange={() => props.toggleChecked(!props.isChecked)}
                />
              )}
              <Track track={props.track} isDragging={snapshot.isDragging} />
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
