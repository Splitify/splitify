import React from 'react'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'
import { FeatureSliderData } from './FeatureSliderData'

const useStylesSlider = makeStyles({
  root: {
    width: 280
  }
})

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
            value: props.feature.currentMin,
            label: props.feature.currentMin.toString().concat(props.feature.units)
          },
          {
            value: props.feature.currentMax,
            label: props.feature.currentMax.toString().concat(props.feature.units)
          }
        ]}
      />
    </div>
  )
}
