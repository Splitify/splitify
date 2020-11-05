import React from 'react'
import { Slider, Typography, makeStyles } from '@material-ui/core'
import { FeatureSliderData } from './FeatureSliderData'

const useStylesSlider = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    width: '100%'
  }
}))

export default function (props: {
  feature: FeatureSliderData
  delete: () => void
  onFeatureUpdate: (name: string, feature: number[]) => void
}) {
  const classes = useStylesSlider()
  return (
    <div className={classes.root}>
      <Typography id='range-slider' gutterBottom>
        {props.feature.name}
      </Typography>
      <Slider
        onChangeCommitted={(evt, val) =>
          props.onFeatureUpdate(props.feature.name, [val].flat())
        }
        aria-label={props.feature.name}
        orientation='horizontal'
        valueLabelDisplay='auto'
        //valueLabelFormat = {(x) => x.toString().concat(props.featureLabel)}
        aria-labelledby='range-slider'
        min={props.feature.min}
        max={props.feature.max}
        defaultValue={[props.feature.min, props.feature.max]}
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
