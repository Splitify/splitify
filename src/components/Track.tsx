import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Track as TrackObj } from '../types'
import { Grid } from '@material-ui/core';
import ExplicitIcon from '@material-ui/icons/Explicit';
import {
  BarChart, Bar, Cell, XAxis, YAxis
} from 'recharts';

const strArrayToEngligh = (arr: string[]) => {
  const re = /(.*), (\w+)/;
  return arr.join(", ").replace(re, "$1 and $2")
}

const numToNaturalTime = (n: Number) => {
  const date = new Date(n.valueOf());
  return `${date.getMinutes()} min ${date.getSeconds()} sec`
}

const COLOURS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const EXCLUDED_FEATURES = [ // TODO: This should be shared with Zach's feature code
  "duration_ms",
  "tempo",
  "mode",
  "time_signature",
  "key"];

export default function Track(props: { track: TrackObj }): JSX.Element {

  const useStyles = makeStyles((theme) => ({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '80%',
      maxHeight: '80%',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridGap: theme.spacing(3),
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
  const genresEnglish = strArrayToEngligh(Array.from(new Set(props.track.artists.map(a => a.genres).flat())));
  const lengthEnglish = numToNaturalTime(props.track.duration_ms);

  const data = Object.entries(props.track.features ?? {}).map(([k, v]) => {
    return { name: k, value: v };
  }).filter(v => !EXCLUDED_FEATURES.includes(v.name))


  const albumGrid = (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <img className={classes.img} alt="complex" src={props.track.album?.image.toString()} />
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom variant="subtitle1">
          {props.track.album?.name} {props.track.explicit ? <ExplicitIcon /> : ""}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Released: {props.track.album?.release_date.toDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Track: {props.track.track_number} of {props.track.album?.total_tracks}
        </Typography>
      </Grid>
    </Grid>
  );

  var colourIndex = -1;

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
          style={{ width: '40%' }}
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
          </Typography>
          <Grid container spacing={2}>
            {props.track.album === undefined ? "" : albumGrid}
            <Grid item>
              Artists: {artistEnglish}
            </Grid>
            <Grid item>
              {genresEnglish.length > 0 ? "Genres: " + genresEnglish : ""}
            </Grid>
            <Grid item>
              Popularity: {props.track.popularity}
            </Grid>
            <Grid item>
              Length: {lengthEnglish}
            </Grid>
            <Grid item>
              <BarChart width={400} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 50 }} layout={"vertical"}
              >
                <XAxis type={"number"} domain={[0, 1]} hide />
                <YAxis type={"category"} dataKey={"name"} width={100} axisLine={false} tickSize={0} />
                <Bar dataKey="value">
                  {
                    data.map((entry, index) => {
                      colourIndex = colourIndex + 1;
                      return <Cell fill={COLOURS[colourIndex % COLOURS.length]} />;
                    })
                  }
                </Bar>
              </BarChart>
            </Grid>
          </Grid>
        </Popover>
      </div>
    </React.Fragment>
  )
}
