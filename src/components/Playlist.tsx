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
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slider from '@material-ui/core/Slider';

import { Playlist as PlaylistObj, Track as TrackObj } from "../types"
import { isPropertySignature } from 'typescript';

const useStylesDialogue = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
const useStylesslider = makeStyles({
  root: {
    height: 300,
  },
});
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
function valuetext(value:Number) {
  return `${value}°C`;
}
export function FullScreenDialog(props: {
  features: Number[][],
  giveFeaturesToPlaylist: (features: Number[][]) => void,
})  {
  //states for sliders
  const [AcousticnessVal, setAcousticnessVal] = useState(props.features[0]);
  const [DanceabilityVal, setDanceabilityVal] = useState(props.features[1]);
  const [EnergyVal, setEnergyVal] = useState(props.features[2]);
  const [InstrumentalnessVal, setInstrumentalnessVal] = useState(props.features[3]);
  const [LivenessVal, setLivenessVal] = useState(props.features[4]);
  const [LoudnessVal, setLoudnessVal] = useState(props.features[5]);
  const [SpeechinessVal, setSpeechinessVal] = useState(props.features[6]);
  const [ValenceVal, setValenceVal] = useState(props.features[7]);
  const [TempoVal, setTempoVal] = useState(props.features[8]);
  const classes = useStylesDialogue();
  const classes2 = useStylesslider();
  const [open, setOpen] = React.useState(false);

  function handleChange (value:any) {
    console.log('changing a value')
    console.log(value)
    if (typeof(value) === 'number'){
      return [value,value]
    }else{
      return value
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    //??????
    setOpen(false);
  };

  const handleSave = (features: Number[][]) => {
    props.giveFeaturesToPlaylist(features)
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Audio Features
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Audio Features
            </Typography>
            <Button autoFocus color="inherit" onClick={() => handleSave([AcousticnessVal, 
              DanceabilityVal, 
              EnergyVal, 
              InstrumentalnessVal, 
              LivenessVal,
              LoudnessVal,
              SpeechinessVal,
              ValenceVal,
              TempoVal ])}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes2.root}>
      <Typography id="range-slider" gutterBottom>
        AudioFeatures
      </Typography>
      <TableRow> 
      </TableRow>
      <Slider 
        onChangeCommitted={(event, value) =>
          setAcousticnessVal(handleChange(value))
        }
        aria-label = "acousticness"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {AcousticnessVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setDanceabilityVal(handleChange(value))
        }
        aria-label = "danceability"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {DanceabilityVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setEnergyVal(handleChange(value))
        }
        aria-label = "energy"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {EnergyVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setInstrumentalnessVal(handleChange(value))
        }
        aria-label = "instrumentalness"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {InstrumentalnessVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setLivenessVal(handleChange(value))
        }
        aria-label = "liveness"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {LivenessVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setLoudnessVal(handleChange(value))
        }
        aria-label = "loudness"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {LoudnessVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setSpeechinessVal(handleChange(value))
        }
        aria-label = "speechiness"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {SpeechinessVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setValenceVal(handleChange(value))
        }
        aria-label = "valence"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {ValenceVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
      <Slider
        onChangeCommitted={(event, value) =>
          setTempoVal(handleChange(value))
        }
        aria-label = "tempo"
        orientation="vertical"
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        defaultValue = {TempoVal.map((num) => Number(num))}
        getAriaValueText={valuetext}
      />
    </div>
      </Dialog>
    </div>
  );
}


export default function Playlist(props: {
  playlist: PlaylistObj;
  genres: string[];
  id: Number;
  delete: () => void;
}) {
  const classes = useStyles();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [checked, setChecked] = useState<string[]>([])
  const [features, setFeatures] = useState<Number[][]>([[10,90],[10,90],[10,90],[10,90],[10,90],[10,90],[10,90],[10,90],[10,90]])
  
  const handleDelete = (genreToDelete: any) => () => {
    setSelectedGenres((selectedGenres: string[]) => selectedGenres.filter((genre: string) => genre !== genreToDelete));
  };  

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

  const getFeaturesFromDialog = (incomingFeatures: Number[][]) => {
    setFeatures(incomingFeatures)
    console.log(features)
  }

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
          <FullScreenDialog features = {features} giveFeaturesToPlaylist={getFeaturesFromDialog}/>
          <TableRow>
            <TableCell>Sub-Playlist</TableCell>
            <TableCell>
              <Button variant="contained" color="secondary" onClick={props.delete}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
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
