import React, { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom";
import Playlist from '../../components/Playlist'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Auth from '../../auth'
import MasterPlaylist from "../../components/MasterPlaylist";
import PlaylistWrapper from "../../components/PlaylistWrapper/"

import { Playlist as PlaylistObj } from "../../types";
import { allGenresFromPlaylist, getPlaylist } from "../../helpers/helpers";

import { v4 as uuid } from 'uuid';

export const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    playlist: {
        //Add styling for playlists here
    },
}));

interface IDashboardProps extends RouteComponentProps {

}

const Dashboard: React.FC<IDashboardProps> = () => {

    //The width of the grids have to be dynamic, not a fixed width
    const classes = useStyles();

    const [isMasterSelected, setIsMasterSelected] = useState(false);
    
    const deletePlaylist = (playlist: PlaylistObj) => {
        console.log("Deleting playlist", playlist.id);
        setPlaylists(playlists.filter(p => p.id !== playlist.id));
    }

    const createPlaylist = () : PlaylistObj => {
        return {
            id: 'temp:' + uuid(),
            name: 'Playlist',
            description: '',
            image: '',
            owner: { id: 'owner', display_name: 'Owner' },
            snapshot_id: '',
            tracks: [],
            uri: '',
            expand: async function() {return this}
        }
    }

    const addPlaylist = () => {
        const playlist = createPlaylist()        
        console.log("Adding playlist", playlist.id);
        setPlaylists([...playlists, playlist]);
    }

    const [playlists, setPlaylists] = useState<PlaylistObj[]>([createPlaylist()]);
    
    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={async () => Auth.logout().then(() => {
                window.location.href = window.location.origin + "/";
            })}>
                Logout
        </Button>
            <Grid style={{ padding: "10%" }} container spacing={5}>
                <Grid item xs={4}>
                    <PlaylistWrapper component={MasterPlaylist} onSelect={p => setIsMasterSelected(true)} />
                </Grid>
                
                {isMasterSelected ? 
                <>
                {playlists.map(p => (
                    <Grid item xs={4} key={p.id}>
                        <Playlist playlist={p} onDelete={() => deletePlaylist(p)} />
                    </Grid>
                ))}
                <Grid item xs={2}>
                    <Button variant="contained" color="primary" onClick={() => addPlaylist()}>
                        Add
                    </Button>
                </Grid>
                </>
            : null
                }
            </Grid>
        </div>
    );
}

export default withRouter(Dashboard)




