import React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStylesSlider = makeStyles({
    root: {
      width: 300,
    },
  });

export default function AudioFeatureSlider(props: {
    featureName: string,
    featureValue: number[],
    featureLimits: number[],
    featureLabel: string,
    delete: () => void;
    onFeatureUpdate: (name:string, feature: number[]) => void,
}) {
    const classes = useStylesSlider();
    return(
            <div className = {classes.root}>
                <Typography id="range-slider" gutterBottom>
                    {props.featureName}
                    
                </Typography>
                <Slider
                    onChangeCommitted={(evt, val) => props.onFeatureUpdate(props.featureName, [val].flat())}
                    aria-label = {props.featureName}
                    orientation = "horizontal"
                    valueLabelDisplay = "auto"
                    //valueLabelFormat = {(x) => x.toString().concat(props.featureLabel)}
                    aria-labelledby = "range-slider"
                    min = {props.featureLimits[0]}
                    max = {props.featureLimits[1]}
                    defaultValue = {props.featureValue}
                    marks = {[
                        {value : props.featureLimits[0], label: props.featureLimits[0].toString().concat(props.featureLabel)},
                        {value : props.featureLimits[1], label: props.featureLimits[1].toString().concat(props.featureLabel)}
                    ]}
                />
                
            </div>
        )
    }
    

