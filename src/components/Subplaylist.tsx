import React, { useEffect, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons'
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
  TextField,
  makeStyles
} from '@material-ui/core'
import { Playlist as PlaylistObj, Track as TrackObj} from '../types'
import SortSelector from './SortSelector'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'
import MultiFilter, { TrackFilter } from './MultiFilter'
import { FeatureMenu, AudioFeatureSlider, FeatureSliderItem as FeatureSliderItemObj } from './FeatureSelector/'
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sortType, setSortType] = useState("")

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />
  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  const [tracks, setTracks] = useState(props.source.tracks)

  const [trackFilter, setTrackFilter] = useState<TrackFilter>((t: TrackObj) => true);
  const [sliders, setSliders] = useState<FeatureSliderItemObj[]>([]);

  const deleteSlider = (id: String) => {
    console.log("Deleting slider ", id);
    setSliders(sliders.filter(k => k.name !== id));
  }

  const updateSlider = (id: String, range: number[]) => {
    setSliders(
      sliders.map(
        el => el.name === id ? { ...el, currentMin: range[0], currentMax: range[1] } : el
      )
    )

  }

  const handleAddFeature = (option: FeatureSliderItemObj) => {
    if (!sliders.find(slider=>slider.name === option.name)) {
      setSliders([...sliders, option])
    }
  }

  const TrackInRange = (track: TrackObj): boolean => {
    var found = true;
    sliders.forEach((slider) => {
      if (track.features) {
        for (const [feature,value] of Object.entries(track.features)){
          //special cases for loudness and tempo.
          // note that this needs to be a nested if statement to make else if only trigger if it isn't tempo or loudness
          if (slider.name.toLowerCase() === 'loudness' || slider.name.toLowerCase() === 'tempo'){
            if (slider.name.toLowerCase() === feature && (value < slider.currentMin || value > slider.currentMax )){
              found=false
            }
          } else if (slider.name.toLowerCase() === feature && (value < slider.currentMin / 100 || value > slider.currentMax / 100)){
            found= false;
          }
        }
      }
      return found;
    })
    return found;
  }
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

  const sortTracks = (track1: TrackObj, track2: TrackObj): number => {
    let var1: string = "";
    let var2: string = "";
    console.log("sorting")
    switch(sortType) {
      case "Track Name":
        var1 = track1.name
        var2 = track2.name
        break;
      case "Artist":
        var1 = track1.artists[0].name
        var2 = track2.artists[0].name
        break;
      case "Album":
        if (track1.album){
          var1 = track1.album.name
        }
        if (track2.album){
          var2 = track2.album.name
        }
        break;
      default:
        var1 = track1.name
        var2 = track2.name
    }
    return var1.localeCompare(var2)
  };

  const changeSortType = (type: string): void => {
    setSortType(type)
  }

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
      tracks.filter(TrackCorrectGenre).filter(trackFilter)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, selectedGenres, trackFilter])

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
                  <SortSelector setSort={changeSortType}/>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => props.onDelete && props.onDelete(props.playlist)} startIcon={<DeleteIcon />}>
                  Delete
                  </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <FeatureMenu onSelect={handleAddFeature} hidden={sliders.map(el => el.name)} />
              </TableCell>
            </TableRow>
            {sliders.map(p => (
              <TableRow>
                <TableCell size = 'small'>
                  <AudioFeatureSlider feature={p} delete={() => deleteSlider(p.name)} onFeatureUpdate={updateSlider} />
                </TableCell>
                <TableCell> 
                <Button variant="contained" color="secondary" onClick={() => deleteSlider(p.name)}  size = {'small'} startIcon={<DeleteIcon />}/>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>
                <Autocomplete
                  multiple
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
              <TableCell colSpan={3}>
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

              setTracks(tracks => {
                const newTracks = [...tracks];
                const [removed] = newTracks.splice(sourceIdx, 1);
                newTracks.splice(destIdx, 0, removed);
                return newTracks
              })

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
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style, 
                            ...(snapshot.isDragging ? {backgroundColor: '#E6E6E6'} : undefined)
                          }}
                          >
                          <TableCell
                            colSpan={2}
                            scope='row'
                          >
                            <TrackEntry track={track} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>
    </div>
  )
}
