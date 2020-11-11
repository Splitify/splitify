import React from 'react'
import { Slider, Typography, makeStyles } from '@material-ui/core'
import { FeatureSliderData } from './FeatureSliderData'

const useStylesSlider = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
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
      <Typography id='range-slider' gutterBottom style={{ minWidth: 130 }}>
        {props.feature.name}
      </Typography>
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
