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

    const [playlistNames, setPlaylistNames] = useState(["New Sub-Playlist 1"]); // TODO: replace this with some 

    const deletePlaylist = (name: string) => {
        console.log("Deleting playlist ", name);
        setPlaylistNames(playlistNames.filter(k => k !== name));
    }

    const addPlaylist = () => {
        const baseName = "New Sub-Playlist ";
        let num = 1;
        while (playlistNames.includes(baseName + num)) {
            num++;
        }
        console.log("Adding playlist ", baseName + num);
        setPlaylistNames([...playlistNames, baseName + num]); 
    }
    
    const editPlaylistName = (oldName: string, newName: string) => {
        console.log("Changing", oldName, "to", newName);
        playlistNames[playlistNames.indexOf(oldName)] = newName;
        setPlaylistNames([...playlistNames]);
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
        {playlistNames.map(p => (
        <Grid item xs={4}>
            <Playlist playlist={playlistData} name={p} delete={() => deletePlaylist(p)} rename={editPlaylistName}/>
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




