import React, { Dispatch, SetStateAction, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

export default function Subplaylist (props: {
  setSort: (type: string) => void
}) {
	const useStyles = makeStyles((theme: Theme) =>
  	createStyles({
		formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		},
		selectEmpty: {
		marginTop: theme.spacing(2),
		},
  	}),
);
	const classes = useStyles();
	const [sortType, setSortType] = useState('');

	const handleChange = (event: any) => {
		props.setSort(event.target.value as string);
		setSortType(event.target.value)
	};
	
	return (
		<FormControl className={classes.formControl}>
			<InputLabel>Sort</InputLabel>
			<Select
				value={sortType}
				onChange={handleChange}
			>
			<MenuItem value={"Track Name"}>Track Name</MenuItem>
			<MenuItem value={"Artist"}>Artist</MenuItem>
			<MenuItem value={"Album"}>Album</MenuItem>
			</Select>
	</FormControl>
	)
}