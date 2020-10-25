import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import AudioFeatureSlider from './AudioFeatureSlider'
import {
  Button,
  Checkbox,
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



const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


export function CheckboxesTags(props: {
  giveOptionToPlaylist : (option: string, checked: boolean) => void
}) {

  const handleChange = (selected:string, checked: boolean) => {
    props.giveOptionToPlaylist(selected, checked)
  }
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={audioFeaturesTags}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            onChange={() => {handleChange(option.title, selected)}}
          />
          {option.title}
        </React.Fragment>
      )}
      renderInput={(params) => (
        
        <TextField         style={{ width: '100%' }}
        {...params}
        variant='outlined'
        label='Audio Features'
        placeholder='Add Feature' />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const audioFeaturesTags = [
  { title: 'Acousticness'},
  {  title: 'Danceability'},
  {  title: 'Energy'},
  {  title: 'Instrumentalness'},
  {  title: 'Liveness',}, 
  {  title: 'Speechiness'},
  {  title: 'Valence'}
];

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


  const addSlider = (option:string) => {
    setSliders([...sliders, {name : option, min:10, max:90}]);
    console.log("Adding sliders ", option);
}
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

const getOptionFromCheckboxes = (option : string, checked : boolean) =>
{
  if (checked === true){
    deleteSlider(option)
  }else{
    addSlider(option);
  }
  console.log(sliders)
}
const TrackInRange = (track : TrackObj) : boolean => {
  var found = true;
  sliders.map((slider) => {
    if (track.features){
      if (slider.name === 'Acousticness' && track.features.acousticness < slider.min/100 || track.features.acousticness > slider.max/100){
        found=false;
      }
      if (slider.name === 'Danceability' && track.features.danceability < slider.min/100 || track.features.danceability > slider.max/100){
        found=false;
      }
      if (slider.name === 'Energy' && track.features.energy < slider.min/100 || track.features.energy > slider.max/100){
        found=false;
      }
      if (slider.name === 'Instrumentalness' && track.features.instrumentalness < slider.min/100 || track.features.instrumentalness > slider.max/100){
        found=false;
      }
      if (slider.name === 'Liveness' && track.features.liveness < slider.min/100 || track.features.liveness > slider.max/100){
        found=false;
      }
      // if (slider.name === 'Loudness' && track.features.loudness < slider.min/100 || track.features.loudness > slider.max/100){
      //   found=false;
      // }
      if (slider.name === 'Speechiness' && track.features.speechiness < slider.min/100 || track.features.speechiness > slider.max/100){
        found=false;
      }
      // if (slider.name === 'Tempo' && track.features.tempo < slider.min/100 || track.features.tempo > slider.max/100){
      //   found=false;
      // }
      if (slider.name === 'Valence' && track.features.valence < slider.min/100 || track.features.valence > slider.max/100){
        found=false;
      }
  }
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

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
        {sliders.map(p => (

          <AudioFeatureSlider feature_name = {p.name} feature_value = {[p.min,p.max]} delete = {() => deleteSlider(p.name)} giveFeaturesToPlaylist = {getFeaturesFromSlider}/>
        ))}
          <TableRow>
            {/* <TableCell>{props.playlist.tracks[0]}</TableCell> */}
            <TableCell>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => props.onDelete && props.onDelete(props.playlist)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
          <TableRow> 
            <CheckboxesTags giveOptionToPlaylist = {getOptionFromCheckboxes}/>
            </TableRow>

        </TableHead>
        <TableBody>
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
          {tracks.filter(TrackCorrectGenre && TrackInRange).map(track => (
            <TableRow key={track.id}>
              <TableCell colSpan={2} component='th' scope='row'>
                <Track track={track} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
