import React, { useState } from 'react'
import { Slider, Typography, makeStyles, Popover } from '@material-ui/core'
import { FeatureSliderData } from './FeatureSliderData'

const useStylesSlider = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  popover: {
    pointerEvents: 'none'
  },
  paper: {
    padding: theme.spacing(1)
  }
}))

export default function (props: {
  feature: FeatureSliderData
  delete: () => void
  onFeatureUpdate: (name: string, feature: number[]) => void
}) {
  const classes = useStylesSlider()
  const [popupAnchor, setPopupAnchor] = useState(null)

  return (
    <div className={classes.root}>
      <Typography
        id='range-slider'
        gutterBottom
        style={{ minWidth: 130 }}
        onMouseEnter={(event: any) => setPopupAnchor(event.currentTarget)}
        onMouseLeave={() => setPopupAnchor(null)}
      >
        {props.feature.name}
      </Typography>
      <Popover
        id='mouse-over-popover'
        className={classes.popover}
        classes={{
          paper: classes.paper
        }}
        open={!!popupAnchor}
        anchorEl={popupAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        disableRestoreFocus
      >
        {props.feature.description}
      </Popover>
      <Slider
        onChangeCommitted={(evt, val) =>
          props.onFeatureUpdate(props.feature.name, [val].flat())
        }
        getAriaLabel={() => props.feature.name}
        orientation='horizontal'
        valueLabelDisplay='auto'
        //valueLabelFormat = {(x) => x.toString().concat(props.featureLabel)}
        aria-labelledby='range-slider'
        min={props.feature.min}
        max={props.feature.max}
        defaultValue={[props.feature.min, props.feature.max]}
        style={{
          marginLeft: 25,
          marginRight: 30
        }}
        marks={[
          {
            value: props.feature.min,
            label: props.feature.min.toString().concat(props.feature.units)
          },
          {
            value: props.feature.max,
            label: props.feature.max.toString().concat(props.feature.units)
          }
        ]}
      />
    </div>
  )
}
