import React , { useState } from 'react';
import Slider from '@material-ui/core/Slider';

export default function AudioFeatureSlider(props: {

}) {

    function handleChange (value:any) {
        console.log('changing a value')
        console.log(value)
        if (typeof(value) === 'number'){
          return [value,value]
        }else{
          return value
        }
    }

    const [SliderVal, setSliderVal] = useState

    return(
        <Slider
            onChangeCommitted={(event, value) =>
                setSliderVal(handleChange(value))
            }
            aria-label = "tempo"
            orientation="vertical"
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            defaultValue = {SliderVal.map((num) => Number(num))}
            getAriaValueText={valuetext}
        />
    )

}