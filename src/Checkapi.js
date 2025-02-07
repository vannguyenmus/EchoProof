import React, { useState, useEffect } from 'react';
export default function Checkapi() {
    // State to store the song name entered by the user
    const [songName, setSongName] = useState('');
    const [songExists, setSongExists] = useState(null);
    const [songs, setSongs] = useState([]);

    // Fetch songs from the API when the component mounts
    useEffect(() => {
        async function fetchSongs() {
            try {
                const response = await fetch('https://663dce9de1913c4767957cdf.mockapi.io/testingproject');
                const data = await response.json();
                setSongs(data); // Store the fetched songs in the state
            } catch (error) {
                console.error('Error fetching songs ,,,,,,,,,,,,,,,,.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,:', error);
            }
        }

        fetchSongs();
    }, []);

    // Function to check if the song exists in the fetched songs
    const checkIfSongExists = (songName) => {
        return songs.some(song => song.songName.toLowerCase() === songName.toLowerCase());
    };

    // Handle the form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form reload
        const exists = checkIfSongExists(songName); // Check if the song exists in the API data
        setSongExists(exists); // Update the state with the result
    };

    return <div>
        <h1>Check if Song Exists in API</h1>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter song name"
                value={songName}
                onChange={(e) => setSongName(e.target.value)} // Update songName state on input change
            />
            <button type="submit">Check</button>
        </form>

        {/* Display the result */}
        {songExists !== null && (
            <p>{songExists ? 'The song exists in the API!' : 'The song does not exist in the API.'}</p>
        )}
    </div>
}