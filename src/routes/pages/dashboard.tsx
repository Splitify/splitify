import React, { useState }from "react"
import { RouteComponentProps, withRouter } from "react-router-dom";
import Playlist from '../../components/Playlist'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Auth from '../../auth'
import MasterPlaylist from "../../components/MasterPlaylist";
import { Playlist as PlaylistObj } from "../../types";
import { Track as TrackObj } from "../../types"
import { Album } from "../../types/Album";

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
    const album: Album = {
        id: "1",
        name: " ",
        label: " ",
        artists: [],
        genres: [],
        image: " ",
        release_date: new Date("2020-09-02"),
        total_tracks: 2,
        popularity: 1,
        uri: "55"
    }
    
    const tracksData: Array<TrackObj> = [
        {
            album,
            artists: [],
            id: "1",
            duration_ms: 1,
            explicit: true,
            is_local: true,
            name: "track 1",
            popularity: 1,
            preview_url: null,
            track_number: 1,
            type: "",
            uri: "",
            features: {
                genre: "Pop",
                loudness: "",
                danceability: "",
                instrumentalness: "",
            }
        },{
            album,
            artists: [],
            id: "2",
            duration_ms: 1,
            explicit: true,
            is_local: true,
            name: "track 2",
            popularity: 1,
            preview_url: null,
            track_number: 1,
            type: "",
            uri: "",
            features: {
                genre: "EDM",
                loudness: "",
                danceability: "",
                instrumentalness: "",
            }
        },{
            album,
            artists: [],
            id: "3",
            duration_ms: 1,
            explicit: true,
            is_local: true,
            name: "track 3",
            popularity: 1,
            preview_url: null,
            track_number: 1,
            type: "",
            uri: "",
            features: {
                genre: "Blues",
                loudness: "",
                danceability: "",
                instrumentalness: "",
            }
        }
    ]
    const masterPlaylistData: PlaylistObj = {
        id: 'testid',
        name: 'testname',
        description: 'test',
        image: '',
        owner: { id: 'b0ss', display_name: 'Owner' },
        snapshot_id: '',
        tracks: tracksData,
        uri: ''
    }
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

    const allGenres: Array<string> = []
    masterPlaylistData.tracks.map((track: TrackObj) => (
      allGenres.push(" " + track.features.genre + " ")
    ))
    const [genres, setGenres] = useState(allGenres)

    return (
    <div className={classes.root}>
        <Button variant="contained" color="primary" onClick={async () => Auth.logout().then(() => {
                window.location.href = window.location.origin + "/";
        })}>
            Logout
        </Button>
        <Grid style={{padding:"10%"}} container spacing={5}>
        <Grid item xs={4}>
        <MasterPlaylist playlist={masterPlaylistData}/>
        </Grid>
        {playlists.map(p => (
        <Grid item xs={4}>
            <Playlist genres={genres} playlist={emptyPlaylist} id={p} delete={() => deletePlaylist(p)}/>
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




