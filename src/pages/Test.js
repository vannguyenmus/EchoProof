import React, { useState, useEffect } from 'react';

// Helper function to generate a random state
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function Test() {
    const [token, setToken] = useState('');
    const [player, setPlayer] = useState(null);

    // Define your Spotify credentials and redirect URI
    const spotifyClientId = "1017f35acbf44abfa9c2e9466d5fc059";  // Replace with your Spotify Client ID
    const redirectUri = 'http://localhost:3003/test'; // Replace with your redirect URI

    const scope = 'streaming user-read-email user-read-private';

    // Check if the token exists in URL params after redirect from Spotify
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
                // setIsPlayingOnDevice(true);
                console.log('Playback transferred successfully!');
            } else {
                console.error('Failed to transfer playback:', response.statusText);
            }
        } catch (error) {
            console.error('Error making the request:', error);
        }
    };

    const playTrack = async (accessToken, deviceId) => {
        const trackUri = 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'; // Replace with the track URI you want to play

        const body = JSON.stringify({
            // context_uri: trackUri,
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
                // setIsPlaying(true);
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
                    playTrack(token, device_id);
                });

                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.connect().then(success => {
                    if (success) {
                        console.log('The Web Playback SDK successfully connected to Spotify!');
                    }
                })
                setPlayer(player);
            };
        }
    }, [token]);

    return (
        <div className="App">
            <header className="App-header">
                {!token ? (
                    <button onClick={loginWithSpotify} className="btn-spotify">
                        Login with Spotify
                    </button>
                ) : (
                    <div>
                        <h2>Spotify Web Playback Player</h2>
                        <p>You're now logged in and the player is ready!</p>
                        {/* Add UI for controlling the Spotify player here */}
                    </div>
                )}
            </header>
        </div>
    );
}

export default Test;
