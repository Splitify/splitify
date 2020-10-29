import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  IconButton,
  Button,
  Checkbox,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@material-ui/core'
import { Playlist as PlaylistObj, Track as TrackObj } from '../types'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import MultiFilter, { TrackFilter } from './MultiFilter'
import TrackEntry from './TrackEntry'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const useStyles = makeStyles(theme => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  }
}))

export default function Subplaylist(props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const [trackFilter, setTrackFilter] = useState<TrackFilter>({ filter: (t: TrackObj) => true });

  // TODO: Maybe put genres for each genre
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    for (let artist of track.artists) {
      for (let genre of artist.genres) {
        if (selectedGenres.includes(genre)) {
          return true
        }
      }
    }
    return false
  }

  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  let [tracks, setTracks] = useState(props.source.tracks)

  // Resolves filter index to track source index
  function FITI(idx: number) {
    return tracks.findIndex(t => t.id === filterView[idx].id)
  }

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

  let [filterView, updateFilteredView] = useState<TrackObj[]>([])

  useEffect(() => {
    updateFilteredView(
      tracks.filter(TrackCorrectGenre).filter(trackFilter.filter)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, selectedGenres, trackFilter.filter])

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  return (
    <div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <EditPlaylistNameDialog
          name={props.playlist.name}
          onSave={(newName?: string) => {
            setEditDialogOpen(false);
            if (newName) props.playlist.name = newName;
          }} />
      </Dialog>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                {props.playlist.name}
                <IconButton onClick={() => setEditDialogOpen(true)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)} startIcon={<DeleteIcon />}>
                  Delete
                  </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={props.genres}
                  disableCloseOnSelect
                  getOptionLabel={option => option}
                  onChange={(event: any, newValue: string[]) => {
                    console.log(newValue)
                    setSelectedGenres(newValue)
                  }}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </React.Fragment>
                  )}
                  renderInput={params => (
                    <TextField
                      style={{ width: '100%' }}
                      {...params}
                      variant='outlined'
                      label='Genres'
                      placeholder='Add Genre'
                    />
                  )}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <MultiFilter callback={(f: TrackFilter) => setTrackFilter(f)} />
              </TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext
            onDragEnd={evt => {
              console.log(evt)
              if (!evt.destination) return

              let sourceIdx = FITI(evt.source?.index)
              let destIdx = FITI(evt.destination?.index)


              
              if (destIdx > sourceIdx) {
              // Before: 0  1  2 [3] 4  5  6  7  8  9
              // After:  0  1  2  4  5  6  7 [3] 8  9

              setTracks(tracks => [
                 ...tracks.slice(0, sourceIdx),
                 ...tracks.slice(sourceIdx + 1, destIdx+1),
                 tracks[sourceIdx],
                 ...tracks.slice(destIdx+ 1)
              ])
            } else {
              // destIdx < sourceIdx
              // Before: 0  1  2  3  4  5  6 [7] 8  9
              // After:  0  1  2 [7] 3  4  5  6  8  9
              setTracks(tracks => [
                ...tracks.slice(0, destIdx),
                tracks[sourceIdx],
                ...tracks.slice(destIdx, sourceIdx),
                ...tracks.slice(sourceIdx+1 )
              ])
            }
            }}
          >
            <Droppable droppableId={props.playlist.id}>
              {(provided, snapshot) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {filterView.map((track, idx) => (
                    <Draggable
                      draggableId={track.id}
                      index={idx}
                      key={track.id}
                    >
                      {(provided, snapshot) => (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            component='th'
                            scope='row'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TrackEntry track={track} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>
    </div>
  )
}
