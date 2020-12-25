import React, { useState, useEffect } from 'react'
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  Checkbox,
  Grid
} from '@material-ui/core'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import Skeleton from '@material-ui/lab/Skeleton'

import { asPlaylistTrack } from '../helpers/helpers'
import { Track as TrackObj, CheckedList } from '../types'
import { Draggable } from 'react-beautiful-dnd'

import Track from './Tracks/Track'

export default function (props: {
  id: string
  tracks: TrackObj[]
  index?: number
  checked: CheckedList[]
  isDragDisabled?: boolean
  isDeletable: boolean
  style?: any
  toggleChecked: (id: string, track: TrackObj) => any
}) {
  let [tracks, setTracks] = useState<TrackObj[]>([])
  let [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      let expandedTracks: TrackObj[] = []
      props.tracks.map(async track => {
        expandedTracks.push(await track.expand())
      })
      setTracks([...expandedTracks])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let list = props.checked.find(list => list.id === props.id)
    let isChecked = false
    if (list) {
      isChecked = list.tracks.includes(tracks[0])
    }
    setChecked(isChecked)
  }, [tracks, props.checked, props.id])

  function Checkboxes (props: {
    id: string
    track: TrackObj
    isDeletable: boolean
    toggleChecked: (id: string, track: TrackObj) => any
  }) {
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
      draggableId={asPlaylistTrack(props.tracks[0]).uuid!}
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
          <Grid>
            {tracks ? (
              <div>
                <Grid item>
                  <Checkboxes
                    id={props.id}
                    toggleChecked={props.toggleChecked}
                    isDeletable={props.isDeletable}
                    track={tracks[0]}
                  />
                </Grid>
                <Grid item>
                  <>
                    {tracks.forEach(track => {
                      if (!props.isDragDisabled) {
                        return (
                          <>
                            <Track
                              track={track}
                              isDragging={snapshot.isDragging}
                            />
                            <ListItemSecondaryAction>
                              <ListItemIcon>
                                <DragHandleIcon />
                              </ListItemIcon>
                            </ListItemSecondaryAction>
                          </>
                        )
                      } else {
                        return (
                          <Track
                            track={track}
                            isDragging={snapshot.isDragging}
                          />
                        )
                      }
                    })}
                  </>
                </Grid>
              </div>
            ) : (
              <Skeleton variant='rect' />
            )}
          </Grid>
        </ListItem>
      )}
    </Draggable>
  )
}
