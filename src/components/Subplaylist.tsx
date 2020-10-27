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
  giveOptionToPlaylist : (option: string) => void
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (selected:any) => {
    props.giveOptionToPlaylist(selected)
  }
  return (
    <div> 
    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Add Audio Feature
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleChange({name:'Acousticness', min:10, max:90})}>Acousticness</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Danceability', min:10, max:90})}>Danceability</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Energy', min:10, max:90})}>Energy</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Instrumentalness', min:10, max:90})}>Instrumentalness</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Liveness', min:10, max:90})}>Liveness</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Speechiness', min:10, max:90})}>Speechiness</MenuItem>
        <MenuItem onClick={() => handleChange({name:'Valence', min:10, max:90})}>Valence</MenuItem>
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

export default function Subplaylist (props: {
  source: PlaylistObj
  playlist: PlaylistObj
  genres: string[]
  onDelete?: (playlist: PlaylistObj) => any
}) {
  const classes = useStyles()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const [sliders, setSliders] = useState<{name:string, min:number, max:number}[]>([]); 

  const deleteSlider = (id: String) => {
    console.log("Deleting slider ", id);
    setSliders(sliders.filter(k => k.name !== id));
}

const updateSlider = (id:String, range:Number[]) => {
  setSliders(
    sliders.map(
      el => el.name===id? {...el,min : Number(range[0]), max:Number(range[1])}:el
    )
  )    
  
}
const getFeaturesFromSlider = (name:string, incomingFeatures: Number[]) => {
  updateSlider(name, incomingFeatures)
  
}

const getOptionFromMenu = (option:any) =>
{ 
  var found = false;
  for(var i = 0; i < sliders.length; i++) {
    if (sliders[i].name === option.name) {
        found = true;
        break;
    }
  }
  if (!found){
    setSliders([...sliders,option])
  }
}
const TrackInRange = (track : TrackObj) : boolean => {
  var found = true;
  sliders.map((slider) => {
    if (track.features){
      if (slider.name === 'Acousticness' && (track.features.acousticness < slider.min/100  || track.features.acousticness > slider.max/100)){
        found=false;
      }
      if (slider.name === 'Danceability' && (track.features.danceability < slider.min/100  || track.features.danceability > slider.max/100)){
        found=false;
      }
      if (slider.name === 'Energy' && (track.features.energy < slider.min/100 || track.features.energy > slider.max/100)){
        found=false;
      }
      if (slider.name === 'Instrumentalness' && (track.features.instrumentalness < slider.min/100 || track.features.instrumentalness > slider.max/100)){
        found=false;
      }
      if (slider.name === 'Liveness' && (track.features.liveness < slider.min/100 || track.features.liveness > slider.max/100)){
        found=false;
      }
      // if (slider.name === 'Loudness' && track.features.loudness < slider.min/100 || track.features.loudness > slider.max/100){
      //   found=false;
      // }
      if (slider.name === 'Speechiness' && (track.features.speechiness < slider.min/100 || track.features.speechiness > slider.max/100)){
        found=false;
      }
      // if (slider.name === 'Tempo' && track.features.tempo < slider.min/100 || track.features.tempo > slider.max/100){
      //   found=false;
      // }
      if (slider.name === 'Valence' && (track.features.valence < slider.min/100 || track.features.valence > slider.max/100)){
        found=false;
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
          return TrackInRange(track)
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
              {sliders.map(p => (
                <TableRow> 
                <TableCell> 
              <AudioFeatureSlider feature_name = {p.name} feature_value = {[p.min,p.max]} delete = {() => deleteSlider(p.name)} giveFeaturesToPlaylist = {getFeaturesFromSlider}/>
              </TableCell>
              <Button variant="contained" color="secondary" onClick = {() =>deleteSlider(p.name)}startIcon={<DeleteIcon />}>
              </Button>
              </TableRow>
            ))}
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
          </TableHead>
          <TableBody>

            <TableRow> 
              <TableCell colSpan = {2}>
            <FeatureMenu giveOptionToPlaylist = {getOptionFromMenu}/>
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
            {tracks.filter(TrackCorrectGenre ).map(track => (
              
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
