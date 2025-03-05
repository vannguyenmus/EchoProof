import { useEffect, useState } from "react";
import "./submitsong.css";
import { getAccessToken, redirectToAuthCodeFlow, setRegistration } from "./firebase-config";

const RegistrationForm = () => {
    // State to store form values
    const [formData, setFormData] = useState({
        email: "",
        songName: "",
        mainTone: "",
        performers: "",
        songwriters: "",
        publishers: "",
        youtubeURL: "",
        spotifyURL: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent actual form submission
        console.log("Form Data:", formData);
        setRegistration(formData);
        alert("Form submitted! Check the console for details.");
    };

    return (
        <div className="form-container">
            <h1>Submit a Registration</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    className="input-field"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="songName"
                    className="input-field"
                    placeholder="Song Name"
                    value={formData.songName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="mainTone"
                    className="input-field"
                    placeholder="Main Tone"
                    value={formData.mainTone}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="performers"
                    className="input-field"
                    placeholder="Performers"
                    value={formData.performers}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="songwriters"
                    className="input-field"
                    placeholder="Songwriters"
                    value={formData.songwriters}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="publishers"
                    className="input-field"
                    placeholder="Publishers"
                    value={formData.publishers}
                    onChange={handleChange}
                />

                <div className="side-panel">
                    <div className="click-button">
                        <a href="/askAI">
                            <button type="button">Ask for AI Help</button>
                        </a>
                        <a href="/audioanalysis">
                            <button type="button">Compare Song</button>
                        </a>
                    </div>
                    <p>Copy your song link here to start uploading</p>
                    <div className="music-button-group">
                        <input
                            type="text"
                            name="youtubeURL"
                            className="input-field"
                            placeholder="YouTube URL"
                            value={formData.youtubeURL}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="spotifyURL"
                            className="input-field"
                            placeholder="Spotify URL"
                            value={formData.spotifyURL}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="button-row">
                    <button type="button" className="cancel-btn" onClick={() => alert("Form canceled!")}>
                        Cancel
                    </button>
                    <button className="submit-btn" type="submit">
                        Submit & Upload
                    </button>
                </div>
            </form>

            <a href="/home" className="back-home-btn">
                Back to Homepage
            </a>
        </div>
    );
};

export default RegistrationForm;
