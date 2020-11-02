import React from 'react'

import { BarChart, Bar, Cell, XAxis, YAxis } from 'recharts'

import { Grid, Popover, Typography, makeStyles } from '@material-ui/core'
import ExplicitIcon from '@material-ui/icons/Explicit'

import { Track as TrackObj } from '../types'

const EXCLUDED_FEATURES = [
  // TODO: This should be shared with Zach's feature code
  'duration_ms',
  'tempo',
  'mode',
  'time_signature',
  'loudness',
  'key'
]

const strArrayToEnglish = (arr: string[]) => {
  const re = /(.*), (\w+)/
  return arr.join(', ').replace(re, '$1 and $2')
}

const numToNaturalTime = (n: Number) => {
  const date = new Date(n.valueOf())
  return `${date.getMinutes()} min ${date.getSeconds()} sec`
}

const COLOURS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none'
  },
  img: {
    display: 'block',
    maxWidth: 180,
    maxHeight: 180
  },
  paper: {
    padding: theme.spacing(1)
  }
}))

export default function (props: {
  track: TrackObj
  anchor: Element | null
}) {
  const classes = useStyles()

  let colourIndex = -1
  const artistEnglish = strArrayToEnglish(props.track.artists.map(a => a.name))
  const genresEnglish = strArrayToEnglish(
    Array.from(new Set(props.track.artists.map(a => a.genres).flat()))
  )
  const lengthEnglish = numToNaturalTime(props.track.duration_ms)

  const data = Object.entries(props.track.features ?? {})
    .filter(([k]) => !EXCLUDED_FEATURES.includes(k))
    .map(([k, v]) => {
      return { name: k, value: v }
    })

  return (
    <Popover
      id='mouse-over-popover'
      className={classes.popover}
      classes={{
        paper: classes.paper
      }}
      open={!!props.anchor}
      anchorEl={props.anchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      // onClose={props.onClose}
      disableRestoreFocus
    >
      <Grid container spacing={2}>
        <Grid item xs>
          {props.track.album && (
            <Grid container>
              <Grid item xs>
                <img
                  className={classes.img}
                  alt='complex'
                  src={props.track.album?.image.toString()}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom variant='h4' style={{ fontSize: 30 }}>
                  {props.track.name}
                  {props.track.explicit && <ExplicitIcon /> }
                </Typography>
                <Typography gutterBottom variant='h6'>
                  {props.track.album?.name}
                </Typography>
                <Typography variant='body2' gutterBottom>
                  Released: {props.track.album?.release_date.toDateString()}
                </Typography>
                <Typography variant='body2' gutterBottom color='textSecondary'>
                  Track {props.track.track_number} of{' '}
                  {props.track.album?.total_tracks}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid item xs>
            <Typography gutterBottom variant='body1'>
              Artists: {artistEnglish}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography gutterBottom variant='body1'>
              {genresEnglish.length && ('Genres: ' + genresEnglish)}
            </Typography>
          </Grid>
          <Grid container>
            <Grid item xs>
              <Typography gutterBottom variant='body1'>
                Popularity: {props.track.popularity}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography gutterBottom variant='body1'>
                Length: {lengthEnglish}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs>
          <BarChart
            width={400}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            layout='vertical'
          >
            <XAxis type='number' domain={[0, 1]} hide />
            <YAxis
              type='category'
              dataKey='name'
              width={100}
              axisLine={false}
              tickSize={0}
            />
            <Bar dataKey='value'>
              {data.map((entry, index) => (
                <Cell
                  fill={COLOURS[++colourIndex % COLOURS.length]}
                  key={index}
                />
              ))}
            </Bar>
          </BarChart>
        </Grid>
      </Grid>
    </Popover>
  )
}
