import React, { useState }from "react"
import { RouteComponentProps, withRouter } from "react-router-dom";
import Playlist from '../../components/Playlist'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Auth from '../../auth'
import MasterPlaylist from "../../components/MasterPlaylist";
import { Playlist as PlaylistObj } from "../../types";
import AddIcon from '@material-ui/icons/Add';

export const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    playlist: {
      //Add styling for playlists here
    },
}));

interface IDashboardProps extends RouteComponentProps{

}

const Dashboard: React.FC<IDashboardProps> = () => {

    //The width of the grids have to be dynamic, not a fixed width
    const classes = useStyles();

    const [playlists, setPlaylists] = useState([0]); // TODO: replace this with some 

    const deletePlaylist = (id: Number) => {
        console.log("Deleting playlist ", id);
        setPlaylists(playlists.filter(k => k !== id));
    }

    const addPlaylist = () => {
        var id = Math.max(...playlists) + 1;
        if (!isFinite(id)) id = 0;
        console.log("Adding playlist ", id);
        setPlaylists([...playlists, id]); 
    }

    const playlistData: PlaylistObj = {
        id: 'testid',
        name: 'testname',
        description: 'test',
        image: '',
        owner: { id: 'b0ss', display_name: 'Owner' },
        snapshot_id: '',
        tracks: [],
        uri: ''
    }

    return (
    <div className={classes.root}>
        <Button variant="contained" color="primary" onClick={async () => Auth.logout().then(() => {
                window.location.href = window.location.origin + "/";
        })}>
            Logouts
        </Button>
        <Grid style={{padding:"10%"}} container spacing={5}>
        <Grid item xs={4}>
        <MasterPlaylist playlist={playlistData}/>
        </Grid>
        {playlists.map(p => (
        <Grid item xs={4}>
            <Playlist playlist={playlistData} id={p} delete={() => deletePlaylist(p)}/>
        </Grid>
        ))}
        <Grid item xs={2}>
            <Button variant="contained" color="primary" onClick={() => addPlaylist()} startIcon={<AddIcon />}>
            Add
            </Button>
        </Grid>
        </Grid>
    </div>
    );
}

export default withRouter(Dashboard)




