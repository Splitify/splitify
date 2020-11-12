import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import Skeleton from '@material-ui/lab/Skeleton'

import { Track as TrackObj, CheckedList } from '../types'
import Track from './Track'

import DragHandleIcon from '@material-ui/icons/DragHandle'
import { ListItem, ListItemSecondaryAction, ListItemIcon, Checkbox } from '@material-ui/core'
import { asPlaylistTrack } from '../helpers/helpers'

export default function (props: {
  id: string
  track: TrackObj
  index?: number
  checked: CheckedList[]
  isDragDisabled?: boolean
  isDeletable: boolean
  style?: any
  toggleChecked: (id: string, track: TrackObj) => any
}) {
  let [track, setTrack] = useState<TrackObj>()
  let [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      setTrack(await props.track.expand())
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let list = props.checked.find((list) => list.id === props.id)
    let isChecked = false
    if (list) {
      isChecked = list.tracks.includes(track!)
    }
    setChecked(isChecked)}, [track, props.checked, props.id]
    )

  function Checkboxes(props: {id: string, track: TrackObj, isDeletable: boolean, toggleChecked: (id: string, track: TrackObj) => any}) {
    if (props.isDeletable) {
      return (
        <Checkbox
          checked={checked}
          tabIndex={-1}
          disableRipple
          onClick={props.toggleChecked(props.id, props.track)}
        />
      )
    } else {
      return <div></div>
    }
  }
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
              <Checkboxes id={props.id} toggleChecked={props.toggleChecked} isDeletable={props.isDeletable} track={track}/>
              <Track track={props.track} isDragging={snapshot.isDragging} />
              {props.isDragDisabled ?? (
                <ListItemSecondaryAction>
                  <ListItemIcon>
                    <DragHandleIcon />
                  </ListItemIcon>
                </ListItemSecondaryAction>
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
