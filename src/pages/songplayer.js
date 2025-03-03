import React, { useEffect, useState, useRef } from "react";
import "./songplayer.css";
import { fetchSpotifyToken, getSpotifyToken } from "./firebase-config";

// Helper function to generate a random state
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const SongPlayer = () => {
    const [selectedSong, setSelectedSong] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState("");
    const [token, setToken] = useState('');
    const [player, setPlayer] = useState(null);

    const spotifyClientId = "1017f35acbf44abfa9c2e9466d5fc059"; // Replace with your Spotify Client ID
    const redirectUri = 'http://localhost:3003/songplayer'; // Replace with your redirect URI
    const scope = 'streaming user-read-email user-read-private';

    const handleSongClick = (song) => {
        setSelectedSong(song);
    };

    useEffect(() => {
        const authenticate = async () => {
            try {
                await fetchSpotifyToken();
            } catch (error) {
                console.error('Spotify authentication failed:', error);
            }
        };
        authenticate();
    }, []);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            try {
                const token = getSpotifyToken();
                const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(value)}&type=track&limit=5`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data.tracks.items);
                } else {
                    console.error('Search failed:', response.status);
                }
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    // Spotify login and player setup
    useEffect(() => {
        const hash = window.location.hash;
        let _token = window.localStorage.getItem('spotify_token');
        if (!_token && hash) {
            _token = hash
                .substring(1)
                .split('&')
                .find((el) => el.startsWith('access_token'))
                .split('=')[1];
            window.localStorage.setItem('spotify_token', _token);
        }
        if (_token) {
            setToken(_token);
        }
    }, []);

    const loginWithSpotify = () => {
        const state = generateRandomString(16);
        window.localStorage.setItem('spotify_auth_state', state);

        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${spotifyClientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl;
    };

    const transferPlayback = async (accessToken, deviceId) => {
        const body = JSON.stringify({
            device_ids: [deviceId],
        });

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                console.log('Playback transferred successfully!');
            } else {
                console.error('Failed to transfer playback:', response.statusText);
            }
        } catch (error) {
            console.error('Error making the request:', error);
        }
    };

    const playTrack = async (accessToken, deviceId, trackUri) => {
        const body = JSON.stringify({
            uris: [trackUri],
            offset: { position: 0 },
            position_ms: 0,
            device_id: deviceId
        });

        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                console.log('Track is now playing!');
            } else {
                console.error('Failed to start track playback:', response.statusText);
            }
        } catch (error) {
            console.error('Error making the request:', error);
        }
    };

    useEffect(() => {
        if (token) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Spotify Web Player',
                    getOAuthToken: (cb) => cb(token),
                    volume: 0.5,
                });

                player.addListener('ready', async ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    await transferPlayback(token, device_id);
                    if (selectedSong) {
                        playTrack(token, device_id, selectedSong.uri);
                    }
                });

                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.connect().then(success => {
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                    }
                });
                setPlayer(player);
            };
        }
    }, [token, selectedSong]);

    return (
        <div className="app">
            <SearchBar query={query} handleSearch={handleSearch} />
            <div className="main-content">
                <SongList songs={searchResults} onSongClick={handleSongClick} />
                <div className="details">
                    {selectedSong && <SongCredits credits={{ artist: selectedSong }} />}
                    {selectedSong && <NowPlaying song={selectedSong} />}
                </div>
            </div>
            {!token ? (
                <button onClick={loginWithSpotify} className="btn-spotify">
                    Login with Spotify
                </button>
            ) : (
                <div>
                    {/* <h2>Spotify Web Playback Player</h2>
                    <p>You're now logged in and the player is ready!</p> */}
                </div>
            )}
        </div>
    );
};

const SearchBar = ({ query, handleSearch }) => (
    <div className="search-bar">
        <input
            type="text"
            placeholder="Search for songs, artist"
            value={query}
            onChange={handleSearch}
        />
    </div>
);

const SongList = ({ songs, onSongClick }) => (
    <div className="song-list">
        {songs.map((song) => (
            <SongItem key={song.id} song={song} onClick={() => onSongClick(song)} />
        ))}
    </div>
);

const SongItem = ({ song, onClick }) => (
    <div className="song-item" onClick={onClick}>
        <img src={song.album.images[0]?.url} alt={`${song.name} cover`} />
        <div className="song-info">
            <h4>{song.name}</h4>
            <p>{song.artists.map(artist => artist.name).join(", ")}</p>
        </div>
        <button className="play-button">▶</button>
    </div>
);

const SongCredits = ({ credits }) => {
    // .artists[0].name
    const { artist } = credits
    const artists = artist.artists
    const album = artist.album
    console.log(credits)
    console.log(credits.artist.album)

    return (
        <div className="song-credits">
        <h3>Credits</h3>
        {/* <p><strong>{credits.artist}</strong></p> */}
        <p><b>Artist:</b> {artists.map(artist => artist.name).join(", ")}</p>
        <p><b>Album:</b> {album.name}</p>
    </div>
    )
};

const NowPlaying = ({ song }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef(null); // Store the interval ID to clear it later

    const totalDuration = song.duration_ms / 1000; // Convert to seconds
    const currentTimeInMinutes = (currentTime / 60).toFixed(2);
    const totalDurationInMinutes = (totalDuration / 60).toFixed(2);

    // Update the range as time progresses
    useEffect(() => {
        if (isPlaying) {
            // Start the interval when playing
            intervalRef.current = setInterval(() => {
                setCurrentTime((prevTime) => {
                    if (prevTime >= totalDuration) {
                        clearInterval(intervalRef.current); // Stop when the song ends
                        return totalDuration;
                    }
                    return prevTime + 1; // Increment time by 1 second
                });
            }, 1000); // Update every second
        } else {
            clearInterval(intervalRef.current); // Stop the interval when paused
        }

        return () => {
            clearInterval(intervalRef.current); // Cleanup interval on component unmount
        };
    }, [isPlaying, totalDuration]);

    // Handle play/pause toggle
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Handle manual change in the range (seeking)
    const handleRangeChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
    };

    return (
        <div className="now-playing">
            <div className="manual">
                <img src={song.album.images[0]?.url} alt={`${song.name} cover`} />
                <div>
                    <h4>{song.name}</h4>
                    <p>{song.artists.map(artist => artist.name).join(", ")}</p>
                </div>
            </div>
            <div className="controls">
                <input
                    type="range"
                    min="0"
                    max={totalDuration}
                    value={currentTime}
                    onChange={handleRangeChange}
                />
                <div className="timing">
                    <span>{currentTimeInMinutes}</span>
                    <span>{totalDurationInMinutes}</span>
                </div>
                <div className="buttons">
                    <button>⏮</button>
                    <button onClick={handlePlayPause}>
                        {isPlaying ? "⏸" : "▶"}
                    </button>
                    <button>⏭</button>
                </div>
            </div>
        </div>
    );
};

export default SongPlayer;
