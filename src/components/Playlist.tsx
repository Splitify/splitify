import React , { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Track from './Track';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { isPropertySignature } from 'typescript';
import AudioFeatureSlider from './AudioFeatureSlider'


const useStyles = makeStyles((theme) => ({
  table: {
    //Add styling for tables here
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    }
  },
  paper: {
      width: 200,
      height: 230,
      overflow: 'auto',
  },
  button: {
      margin: theme.spacing(0.5, 0),
  },
}));

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
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Audio Features" placeholder="Favorites" />
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const audioFeaturesTags = [
  { title: 'Acousticness'},
  {  title: 'Danceability'},
  {  title: 'Duration'},
  {  title: 'Energy'},
  {  title: 'Instrumentalness'},
  {  title: 'Liveness',}, 
  {  title: 'Loudness'},
  {  title: 'Speechiness'},
  {  title: 'Tempo'},
  {  title: 'Mode'},
  {  title: 'Time Signature'},
  {  title: 'Valence'}
];

export default function Playlist(props: {
  playlist: PlaylistObj;
  genres: string[];
  id: Number;
  delete: () => void;
}) {
  const classes = useStyles();
  //genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [checked, setChecked] = useState<string[]>([])
  //slider list
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

  const handleDelete = (genreToDelete: any) => () => {
    setSelectedGenres((selectedGenres: string[]) => selectedGenres.filter((genre: string) => genre !== genreToDelete));
  };  

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
  const TrackCorrectGenre = (track: TrackObj): boolean => {
    var found = false;
    track.artists.map((artist) => {
      artist.genres.map((genre) => {
        if (selectedGenres.includes(genre)) {
          found = true
        }
      })
    })
    return found;
  }
  
  const handleToggle = (genre: string) => () => {
    const currentIndex = checked.indexOf(genre);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(genre);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleSelectGenres = () => {
    setSelectedGenres(checked)
    console.log(checked)
    console.log(selectedGenres)
  };



  const customList = (genres: string[]) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {genres.map((genre) => {
          const labelId = `transfer-list-item-${genre}-label`;
          return (
            <ListItem key={genre} role="listitem" button onClick={handleToggle(genre)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(genre) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={genre} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          {sliders.map(p => (

            <AudioFeatureSlider feature_name = {p.name} feature_value = {[p.min,p.max]} delete = {() => deleteSlider(p.name)} giveFeaturesToPlaylist = {getFeaturesFromSlider}/>

          ))}
          <TableRow>
            <TableCell>Sub-Playlist</TableCell>

            <TableCell>
              <Button variant="contained" color="secondary" onClick={props.delete}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
          <TableRow> <CheckboxesTags giveOptionToPlaylist = {getOptionFromCheckboxes}/></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
          {customList(props.genres)}
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleSelectGenres}
            aria-label="move selected right"
          >
          Choose Genres
          </Button>
          </TableRow>
          <TableRow>
          <div className={classes.root}>
            {selectedGenres.map((genre) => {
              if (genre){
                return (
                  <Chip
                    label={genre}
                    onDelete={handleDelete(genre)}
                  />
                );
              }
              
            })}
          </div>
          </TableRow>
          {/* //FIXME: Simplify / expand */}
          {props.playlist.tracks.map((track: TrackObj) => {
            console.log(TrackCorrectGenre(track) === true)
            if (TrackCorrectGenre(track)) {
              return (<TableRow key={track.id}> 
                {/* UUID for each track item */}
                  <TableCell component="th" scope="row">
                    <Track track={track} />
                  </TableCell>
                </TableRow>)
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
