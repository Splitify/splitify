import React , { useState } from 'react';
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
    featureValue: Number[],
    delete: () => void;
    onFeatureUpdate: (name:string, feature: Number[]) => void,
}) {
    const classes = useStylesSlider();
    //state for slider
    const [sliderVal, setSliderVal] = useState(props.featureValue);

    const handleChange = (event: any, value: number | number[]) => {
        console.log('changing a value')
        if (typeof(value) === 'number'){
            setSliderVal([value,value])
            props.onFeatureUpdate(props.featureName,[value,value]);

        }else{
            setSliderVal(value)
            props.onFeatureUpdate(props.featureName,value);
        }
    };


    return(
            <div className = {classes.root}>
                <Typography id="range-slider" gutterBottom>
                    {props.featureName}
                    
                </Typography>
                <Slider
                    onChangeCommitted={(handleChange)}
                    aria-label = {props.featureName}
                    orientation = "horizontal"
                    valueLabelDisplay = "auto"
                    aria-labelledby = "range-slider"
                    defaultValue = {sliderVal.map((num) => {
                        console.log(num, typeof num)
                        return Number(num)})}
                />
                
            </div>
        )
    }
    

