import { Album, Artist, Features, User, Playlist, Track } from '../types'

import { api } from '../auth'
import { CachingAccumulumatorinator } from './Accumulumatorinator'
import { getPaginationRawGen } from './helpers'

import Queue from 'queue'



const ToURLParam = (track: string, artist: string) => {
  let params = new URLSearchParams();
  params.append("artist", artist);
  params.append("track", track);
  params.append("api_key", "f21088bf9097b49ad4e7f487abab981e");
  params.append("format", "json");
  params.append("method", "track.gettoptags");
  return params.toString();
}

async function fetchLFM(
  request: RequestInfo
): Promise<any> {
  const response = await fetch(request);
  const res = await response.json();
  // console.log(res);
  return res;
}

const GenreAccumulator = new CachingAccumulumatorinator<
  any
>('genres', 1, async id => ([await fetchLFM("http://ws.audioscrobbler.com/2.0/?" + id)]))

const TrackAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.TrackObjectFull
>('tracks', 50, async ids => (await api.getTracks(ids))['tracks'])
const FeatureAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.AudioFeaturesResponse
>(
  'features',
  100,
  async ids => (await api.getAudioFeaturesForTracks(ids))['audio_features']
)
const AlbumAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.AlbumObjectFull
>('albums', 20, async ids => (await api.getAlbums(ids))['albums'])
const ArtistAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.ArtistObjectFull
>('artists', 50, async ids => (await api.getArtists(ids))['artists'])

export async function parseTrackJSON(
  json: SpotifyApi.TrackObjectFull,
  expand?: boolean
): Promise<Track> {
  let track: Track = {
    features: undefined,
    album: undefined,
    genres: [],
    artists: [],
    duration_ms: json.duration_ms,
    explicit: json.explicit,
    id: json.id,
    // is_local: json.is_local,
    name: json.name,
    popularity: json.popularity,
    preview_url: json.preview_url,
    track_number: json.track_number,
    type: json.type,
    uri: json.uri,
    expand: async function (): Promise<Track> {
      let promise = new Promise<Track>(async (resolve, reject) => {
        this.expand = async () => promise

        this.features = parseFeaturesJSON(
          await FeatureAccumulator.request(this.id)
        )

        this.artists = await Promise.all(
          json.artists.map(async ({ id }) =>
            parseArtistJSON(await ArtistAccumulator.request(id))
          )
        )

        this.album = await parseAlbumJSON(
          await AlbumAccumulator.request(json.album.id)
        )

        this.genres = await parseGenres(
          // await fetchLFM("http://ws.audioscrobbler.com/2.0/?" + ToURLParam(json.name, json.artists[0].name)),
          await GenreAccumulator.requestURL(this.id, ToURLParam(json.name, json.artists[0].name), true),
          this.artists,
          this.album,
        )
        resolve(this)
      })

      return promise
    }
  }
  return expand ? await track.expand() : track
}

const WHITELIST = ["hi", "lo", "fi", "acid", "acousmatic", "acoustic", "adult", "africa", "african", "afro", "age", "aggrotech", "aka", "along", "alternative", "alternativo", "ambient", "american", "americana", "anatolian", "and", "anime", "anison", "anti", "apala", "arab", "arena", "argentine", "art", "asia", "asian", "australia", "australian", "austropop", "avant", "avantgarde", "axé", "bachata", "backbeat", "background", "baggy", "baithak", "bakersfield", "baladas", "balearic", "balkan", "ballad", "ballet", "baltimore", "band", "bands", "bap", "barbershop", "baroque", "bass", "bassline", "beat", "bebop", "benga", "berlin", "big", "bikutsi", "bit", "bitpop", "black", "bleeps", "blue", "bluegrass", "blues", "body", "bolero", "boleros", "bongo", "boogie", "bop", "bossa", "bounce", "bouncy", "boy", "brasileira", "brazilian", "breakbeat", "breakcore", "breaks", "breakstep", "brega", "brick", "british", "britpop", "britpunk", "broken", "brostep", "bubblegum", "bultrón", "cajun", "calypso", "canadian", "cantata", "cantique", "cantopop", "cape", "cappella", "caribbean", "carioca", "ccm", "chamber", "chanson", "chant", "chanukah", "chap", "chicago", "chicano", "chicha", "children’s", "chill", "chillstep", "chillwave", "chimurenga", "chiptune", "choral", "choro", "christian", "christmas", "christmas:", "chutney", "cinema", "cities", "city", "classic", "classical", "close", "club", "coast", "cock", "coding", "coldwave", "college", "comedy", "commercial", "compas", "composition", "computer", "concerto", "concrète", "conjunto", "conscious", "contemporary", "cool", "core", "country", "county", "coupé", "cowboy", "cowpunk", "criolla", "crossover", "crunk", "crunkcore", "crust", "cumbia", "cybergrind", "dance", "dancehall", "dansband", "dark", "darkcore", "darkside", "darkstep", "death", "deathcore", "décalé", "deep", "delta", "detroit", "deutsche", "digital", "dirt", "dirty", "disco", "disney", "diva", "dixieland", "djent", "dnb", "doo", "doom", "doomcore", "downtempo", "dream", "driving", "drone", "drum", "drumfunk", "drum’n’bass", "drumstep", "dub", "dubstep", "dubstyle", "dubtronica", "dutch", "early", "east", "easter", "easy", "electric", "electro", "electroacoustic", "electroclash", "electronic", "electronica", "electronicore", "electronics", "electropop", "electropunk", "electroswing", "elevator", "emotional", "english", "enka", "environmental", "español", "ethereal", "ethio", "ethnic", "eurobeat", "eurodance", "europop", "exercise", "experimental", "expressionist", "fado", "fann", "female", "fiddle", "field", "fijiri", "filk", "fitness", "flamenco", "flava", "florida", "flow", "folk", "folktronica", "foreign", "forró", "franco", "freak", "free", "freestyle", "french", "frevo", "fuji", "full", "funk", "funky", "furniture", "fusion", "future", "futurepop", "gabber", "game", "gana", "gangsta", "garage", "garde", "genge", "german", "ghetto", "ghettotech", "glam", "glitch", "goa", "golden", "gospel", "goth", "gothic", "gregorian", "grime", "grind", "grindcore", "groove", "grosso", "grunge", "gulf", "gypsy", "hair", "halloween", "happy", "hard", "hardbag", "hardcore", "hardstep", "hardstyle", "harmonica", "harmony", "härte", "healing", "heavy", "hellbilly", "high", "highlife", "hill", "hip", "hiplife", "hokum", "holiday", "holiday:", "hong", "honky", "hop", "horrorcore", "house", "housetribal", "huayno", "hyphy", "idm", "illbient", "impressionist", "improvisation", "indie", "indietronica", "industrial", "inspirational", "instrumental", "intelligent", "invasion", "iranian", "isicathamiya", "isolationism", "italo", "jack", "jackin", "jam", "jangle", "japanese", "japanoise", "jazz", "jersey", "jingles", "jit", "jùjú", "jump", "jumpstyle", "jungle", "jungle:", "kansas", "kapuka", "karaoke", "kawaii", "kayokyoku", "kayōkyoku", "khaliji", "kizomba", "kong", "korean", "kuduro", "kwaito", "kwela", "laïkó", "lambada", "laptronica", "latin", "latino", "levenslied", "liquid", "listening", "live", "liwa", "louisiana", "lounge", "love", "lovers", "low", "lowercase", "lubbock", "lullabies", "lyrical", "madchester", "mafioso", "mainstream", "makina", "makossa", "maloya", "mambo", "mandopop", "maracatu", "march", "mariachi", "marrabenta", "mass", "math", "mathcore", "mbalax", "mbaqanga", "mbube", "medieval", "meditation", "memphis", "merengue", "merenrap", "méringue", "metal", "metalcore", "metall", "mex", "mexican", "mexicano", "middle", "midwest", "minimal", "minimalism", "modal", "modern", "moombahton", "morna", "motorpop", "motown", "motswako", "movie", "museve", "music", "música", "musicals", "musique", "nashville", "nature", "nederpop", "neo", "neoclassical", "neofolk", "neotraditional", "nerdcore", "neue", "neurofunk", "new", "nintendocore", "noise", "nortec", "northern", "note", "nova", "novelty", "nrg", "nuevo", "old", "oldschool", "onkyokei", "opera", "oratorio", "orchestral", "organum", "oriented", "original", "orlean", "other", "out", "outlaw", "pagan", "pagode", "palm", "parody", "piano", "piedmont", "pirate", "poetry", "pop", "popera", "popular", "portuguese", "post", "power", "praise", "prog", "progressive", "psybreaks", "psychedelic", "psychobilly", "psyprog", "psytrance", "punk", "punkabilly", "punta", "qawwali", "quartet", "quiet", "ragga", "raggacore", "raggamuffin", "ragtime", "raï", "raíces", "raison", "ranchera", "rap", "rave", "reactionary", "recording", "red", "reggae", "reggaeton", "regional", "regstep", "relaxation", "religious", "renaissance", "requiem", "revival", "rhythm", "road", "rock", "rockabilly", "rocksteady", "roll", "romantic", "romanticism", "roots", "russian", "sakara", "salsa", "samba", "sambass", "sawt", "schlager", "school", "schranz", "score", "scouse", "sega", "seggae", "semba", "sertaneja", "sertanejo", "shoegaze", "shouter", "sing", "singer", "ska", "skool", "skweee", "sludge", "smooth", "soca", "soft", "son", "sonata", "song", "songwriter", "sophisti", "soukous", "soul", "sound", "soundscape", "soundtrack", "south", "southern", "space", "spanish", "spazzcore", "speed", "speedcore", "spoken", "stand", "standards", "steampunk", "step", "stoner", "stories", "storm", "stream", "string", "sung", "sunshine", "suomisaundi", "surf", "swamp", "swing", "symphonic", "symphony", "synth", "synthcore", "synthpop", "synthpunk", "taarab", "taiwanese", "tanbura", "tango", "tape", "tech", "technical", "techno", "technopop", "techstep", "tecno", "tecnobrega", "teen", "tejano", "tekno", "terrorcore", "tex", "texas", "thanksgiving", "themes", "third", "thrash", "timba", "time", "típico", "tone", "tonk", "toytown", "trad", "traditional", "trance", "trap", "travel", "trip", "tropical", "tropicalia", "truck", "tunes", "turbofolk", "turkish", "turntablism", "twin", "twoubadou", "underground", "uplifting", "urban", "vandeville", "vaudeville", "video", "viking", "vispop", "vocal", "wave", "wedding", "west", "western", "wine", "witch", "wonky", "wop", "word", "workout", "world", "worship", "yorkshire", "zouglou", "zouk", "zydeco"]

export function parseGenres(
  lm: any,
  artists: Artist[],
  album?: Album,
) {
  const artistNames = artists.map((a: Artist) => a.name.toLowerCase());
  let genres = lm.toptags?.tag
    .filter((t: any) => t.count > 50 && t.name.length < 20)
    .map((t: any) => t.name.toLowerCase())
    .filter((s: string) => {
      return s.split(" ").some((g: string) => WHITELIST.includes(g))
        || s.split("-").some((g: string) => WHITELIST.includes(g))
    }) ?? [];
  genres.splice(3, 99); // Only keep the first three. The quality goes down quick on some songs
  genres = genres.filter((g: string) => !artistNames.includes(g));

  if (genres.length === 0) {
    genres = album?.genres ?? [];
  }

  if (genres.length === 0) {
    genres = artists.map((a: Artist) => a.genres).flat();
  }
  

  return genres;
}

export function parseFeaturesJSON(
  json: SpotifyApi.AudioFeaturesResponse
): Features {
  return {
    acousticness: json.acousticness,
    danceability: json.danceability,
    duration_ms: json.duration_ms,
    energy: json.energy,
    instrumentalness: json.instrumentalness,
    liveness: json.liveness,
    loudness: json.loudness,
    speechiness: json.speechiness,
    tempo: json.tempo,
    mode: json.mode,
    time_signature: json.time_signature,
    valence: json.valence,
    key: json.key
  }
}

export function parseArtistJSON(json: SpotifyApi.ArtistObjectFull): Artist {
  return {
    followers: json.followers.total,
    genres: json.genres,
    id: json.id,
    image: json.images && json.images.length ? json.images[0].url : '',
    name: json.name,
    popularity: json.popularity,
    type: json.type,
    uri: json.uri
  }
}

export async function parseAlbumJSON(
  json: SpotifyApi.AlbumObjectFull,
  expand?: boolean
): Promise<Album> {
  let album: Album = {
    id: json.id,
    name: json.name,
    artists: [],
    genres: json.genres,
    image: json.images && json.images.length ? json.images[0].url : '',
    release_date: new Date(json.release_date),
    total_tracks: json.tracks.total,
    popularity: json.popularity,
    uri: json.uri,
    expand: async function () {
      this.artists = await Promise.all(
        json.artists.map(async ({ id }) =>
          parseArtistJSON(await ArtistAccumulator.request(id))
        )
      )
      return this
    }
  }

  return expand ? await album.expand() : album
}

export function parseUserJSON({ id, display_name, images }: any): User {
  return {
    id,
    display_name,
    image: images && images.length ? images[0].url : null
  }
}

export async function parsePlaylistJSON(
  json: SpotifyApi.PlaylistObjectFull,
  expand?: boolean,
  expandTrack?: boolean
): Promise<Playlist> {
  let playlist: Playlist = {
    id: json.id,
    name: json.name,
    description: json.description || '',
    image: json.images.length ? json.images[0].url : '',
    owner: parseUserJSON(json.owner),
    snapshot_id: json.snapshot_id,
    uri: json.uri,
    tracks: [],
    expand: async function (expandTrack = false): Promise<Playlist> {
      // Expand playlist to get tracks (Does not expand tracks)

      let promise = new Promise<Playlist>(async (resolve, reject) => {
        this.expand = async () => promise

        const Q = Queue({ autostart: true, concurrency: 1, timeout: 10 * 1000 })

        // TODO: What if it's a local track?

        for await (let trackJSONBare of getPaginationRawGen(
          api.getPlaylistTracks,
          { fields: 'items.track.id,total' },
          this.id
        )) {
          let track = TrackAccumulator.request(
            trackJSONBare['track']['id']
          ).then(async (data: SpotifyApi.TrackObjectFull) =>
            // Add parsed track, optionally request track expansion
            parseTrackJSON(await data, expandTrack)
          )

          Q.push(async cb => {
            this.tracks.push(await track)
            cb && cb()
          })
        }

        Q.push(cb => {
          resolve(this)
          cb && cb()
        })
      })

      return promise
    }
  }

  return expand ? await playlist.expand(expandTrack) : playlist
}
