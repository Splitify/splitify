import React , { useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStylesslider = makeStyles({
    root: {
      width: 300,
    },
  });
export default function AudioFeatureSlider(props: {
    feature_name: string,
    feature_value: Number[],
    giveFeaturesToPlaylist: (feature: Number[]) => void,
}) {
    const classes = useStylesslider();
    //state for slider
    const [SliderVal, setSliderVal] = useState(props.feature_value);

    const handleChange = (event: any, value: number | number[]) => {
        console.log('changing a value')
        console.log(value)
        setSliderVal(value as number[]);
        props.giveFeaturesToPlaylist(value as number[]);
    };

    function valuetext(value:Number) {
        return `${value}`;
    }

    return(
            <div className = {classes.root}>
                <Typography id="range-slider" gutterBottom>
                    {props.feature_name}
                    
                </Typography>
                <Slider
                    onChangeCommitted={handleChange}
                    aria-label = {props.feature_name}
                    orientation = "horizontal"
                    valueLabelDisplay = "auto"
                    aria-labelledby = "range-slider"
                    defaultValue = {SliderVal.map((num) => Number(num))}
                    getAriaValueText = {valuetext}
                />
            </div>
        )
    }
    

