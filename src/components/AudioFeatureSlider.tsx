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
                    aria-labelledby = "range-slider"
                    defaultValue = {props.featureValue}
                />
                
            </div>
        )
    }
    

