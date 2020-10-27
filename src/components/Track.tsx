import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Track as TrackObj } from '../types'
import { CardMedia } from '@material-ui/core';

const strArrayToEngligh = (arr: string[]) => {
  const re = /(.*), (\w+)/;
  return arr.join(", ").replace(re, "$1 and $2")
}

const numToNaturalTime = (n: Number) => {
  const date = new Date(n.valueOf());
  return `${date.getMinutes()} min ${date.getSeconds()} sec`
}

export default function Track(props: { track: TrackObj }): JSX.Element {

  const useStyles = makeStyles((theme) => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }));

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
    
  
  const artistEnglish = strArrayToEngligh(props.track.artists.map(a => a.name));
  const albumEnglish = props.track.album?.name ?? "";
  const genresEnglish = strArrayToEngligh(Array.from(new Set(props.track.artists.map(a => a.genres).flat())));
  const lengthEnglish = numToNaturalTime(props.track.duration_ms);
  
  const open = Boolean(anchorEl);
  return (
    <React.Fragment>
      <CssBaseline />
      <div>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          align="center"
        >
          {props.track.name}
        </Typography>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>
            Artists: {artistEnglish}
            <br/>
            {albumEnglish.length > 0 ? "Album: " + albumEnglish : ""}
            <br/>
            {genresEnglish.length > 0 ? "Genres: " + genresEnglish : ""}
            <br />
            Track: {props.track.track_number} of {props.track.album?.total_tracks}
            <br />
            Popularity: {props.track.popularity}
            <br />
            Length: {lengthEnglish}
            <br />
            Explicit: {props.track.explicit}
            <br />
            {/* Release date: {props.track.album?.release_date} */}
            <br />
            Features: {props.track.features?.toString()}
            
          </Typography>
        </Popover>
        <CardMedia image={props.track.album?.image.toString()} />
      </div>
    </React.Fragment>
  )
}
