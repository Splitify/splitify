import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import AudioFeatureSlider from './AudioFeatureSlider'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import {
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
import Track from './Track'
import EditPlaylistNameDialog from './EditPlaylistNameDialog'



export function FeatureMenu(props: {
  onSelect: (option: FeatureSliderItem) => void
  hidden: string[]
}) {
  const options = ['Acousticness', 'Danceability', 'Energy',
    'Instrumentalness', 'Liveness', 'Speechiness', 'Valence'].filter(o => !props.hidden.includes(o));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  
  return (
    <div>
      <Button aria-controls="feature-menu" aria-haspopup="true" onClick={handleMenuOpen}>
        Add Audio Feature
      </Button>
      <Menu
        id="feature-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map(o => (<MenuItem onClick={() => props.onSelect({ name: o, min: 10, max: 90 })}>{o}</MenuItem>))}
      </Menu>
    </div>
  );
}


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

interface FeatureSliderItem {
  name: string
  min: number
  max: number
}

export default function Subplaylist(props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const [sliders, setSliders] = useState<FeatureSliderItem[]>([]);

  const deleteSlider = (id: String) => {
    console.log("Deleting slider ", id);
    setSliders(sliders.filter(k => k.name !== id));
  }

  const updateSlider = (id: String, range: number[]) => {
    setSliders(
      sliders.map(
        el => el.name === id ? { ...el, min: range[0], max: range[1] } : el
      )
    )

  }

  const handleAddFeature = (option: FeatureSliderItem) => {
    if (!sliders.find(slider=>slider.name === option.name)) {
      setSliders([...sliders, option])
    }
  }

  const TrackInRange = (track: TrackObj): boolean => {
    var found = true;
    sliders.forEach((slider) => {
      if (track.features) {
        for (const [feature,value] of Object.entries(track.features)){
          if (slider.name.toLowerCase() === feature && (value < slider.min / 100 || value > slider.max / 100)){
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

  // TODO: setTracks will be used for deletion, reordering and moving
  // eslint-disable-next-line
  let [tracks, setTracks] = useState(props.source.tracks)

  // Save tracks to playlist when updated
  useEffect(() => {
    props.playlist.tracks = tracks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks])

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
                <FeatureMenu onSelect={handleAddFeature} hidden={sliders.map(el => el.name)} />
              </TableCell>
            </TableRow>
            {sliders.map(p => (
              <TableRow>
                <TableCell>
                  <AudioFeatureSlider featureName={p.name} featureValue={[p.min, p.max]} delete={() => deleteSlider(p.name)} onFeatureUpdate={updateSlider} />
                </TableCell>
                <Button variant="contained" color="secondary" onClick={() => deleteSlider(p.name)} startIcon={<DeleteIcon />}>
                </Button>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
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
            {tracks.filter(TrackCorrectGenre).filter(TrackInRange).map(track => (

              <TableRow key={track.id}>
                <TableCell colSpan={2} component='th' scope='row'>
                  <Track track={track} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
