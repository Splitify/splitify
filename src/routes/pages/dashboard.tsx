import React, { useEffect, useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom";
import Playlist from '../../components/Playlist'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Auth from '../../auth'
import MasterPlaylist from "../../components/MasterPlaylist";
import { Playlist as PlaylistObj } from "../../types";
import { getStorage } from "../../helpers/localStorage";
import { allGenresFromPlaylist, getPlaylist } from "../../helpers/helpers";
import SpotifyAPI from 'spotify-web-api-js'

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

    const emptyPlaylist: PlaylistObj = {
        id: 'testid2',
        name: 'testname',
        description: 'test',
        image: '',
        owner: { id: 'b0ss', display_name: 'Owner' },
        snapshot_id: '',
        tracks: [],
        uri: ''
    }

    //The width of the grids have to be dynamic, not a fixed width
    const classes = useStyles();

    const [playlists, setPlaylists] = useState([0]); // TODO: replace this with some 
    const [subPlaylist, setSubPlaylist] = useState(emptyPlaylist)
    const [firstLoad, setFirstLoad] = useState(false);
    const [masterPlaylistData, setMasterPlaylist] = useState(emptyPlaylist);

    useEffect(() => {
        setFirstLoad(true);
      }, []);

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
    
    const split = () => {
        setSubPlaylist(masterPlaylistData)
    }

    const allGenres = allGenresFromPlaylist(masterPlaylistData);
    
    if (firstLoad) {
        setFirstLoad(false);
        (async () => {
            const authStore = getStorage('auth');
            const token = await authStore.getItem('token') as string;
            let api = new SpotifyAPI();
            api.setAccessToken(token);
            setMasterPlaylist(await getPlaylist(api));
        })();
    }
    

    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={async () => Auth.logout().then(() => {
                window.location.href = window.location.origin + "/";
            })}>
                Logout
        </Button>
        <Button variant="contained" color="primary" onClick={split}>
                Split
        </Button>
            <Grid style={{ padding: "10%" }} container spacing={5}>
                <Grid item xs={4}>
                    <MasterPlaylist playlist={masterPlaylistData} />
                </Grid>
                {playlists.map(p => (
                    <Grid item xs={4}>
                        <Playlist genres={allGenres} playlist={subPlaylist} id={p} delete={() => deletePlaylist(p)} />
                    </Grid>
                ))}
                <Grid item xs={2}>
                    <Button variant="contained" color="primary" onClick={() => addPlaylist()}>
                        Add
            </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withRouter(Dashboard)




