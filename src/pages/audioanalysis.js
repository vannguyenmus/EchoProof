import React, { useEffect, useState } from "react";
import "./AudioAnalysisUI.css";

const Analysis = () => {
	const [files, setFiles] = useState([null, null]);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [analysisResults, setAnalysisResults] = useState([null, null]);
	const [trackIds, setTrackIds] = useState(["21619411", "21619410"]);

	// Update these tokens when create a new account
	// token is from integration
	// compareToken is from GraphQL
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiSW50ZWdyYXRpb25BY2Nlc3NUb2tlbiIsInZlcnNpb24iOiIxLjAiLCJpbnRlZ3JhdGlvbklkIjoxNDA2LCJ1c2VySWQiOjk3MTIzLCJhY2Nlc3NUb2tlblNlY3JldCI6IjgyMTNjZmM4YTUyZDQ2NWEzNmJkOThmZWZhYTRkZTczMDBiZjAwOWJhYjg0NWU1M2M5ZDZiNzM2MzYzNzk2ODYiLCJpYXQiOjE3NDE0NTc3NDN9.2ao7kVgk1u5_y0MRs9ta_KKZhTvOpwpjWGq8RIbZJgI";
	const compareToken =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiQWNjZXNzVG9rZW4iLCJ2ZXJzaW9uIjoiMS4wIiwicmVmcmVzaEtleUlkIjozODkzNTUsInVzZXJJZCI6MTg1MjcyLCJpYXQiOjE3Mzg5MDk3MzQsImV4cCI6MTczOTUxNDUzNH0.YGHelUKp8xYyWQ8hvjvSuHQ2Z1MjKtBTxbYJFzdlSMY";

	// useEffect(() => {
	//     // Initial data fetch for demo purposes
	//     const fetchInitialData = async () => {
	//         try {
	//             const results = await Promise.all(trackIds.map(fetchSongAnalysis));
	//             setAnalysisResults(results.map(data => data.data.libraryTrack.audioAnalysisV6.result));
	//         } catch (error) {
	//             console.error('Error fetching initial data:', error);
	//         }
	//     };

	//     fetchInitialData();
	// }, []);

    useEffect(() => {
        console.log(analysisResults)
    }, [analysisResults])

	const handleFileChange = (index, event) => {
		const newFiles = [...files];
		newFiles[index] = event.target.files[0];
		setFiles(newFiles);
	};

	const uploadFile = async (file) => {
		if (!file) return null;

		const authHeader = {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		};

		const requestUploadLink = await fetch("https://api.cyanite.ai/graphql", {
			method: "POST",
			headers: authHeader,
			body: JSON.stringify({
				query: `mutation { fileUploadRequest { id uploadUrl } }`,
			}),
		});

		const requestUploadLinkData = await requestUploadLink.json();
		const { id, uploadUrl } = requestUploadLinkData.data.fileUploadRequest;

		await fetch(uploadUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "audio/mpeg",
			},
			body: file,
		});

		const createTrack = await fetch("https://api.cyanite.ai/graphql", {
			method: "POST",
			headers: authHeader,
			body: JSON.stringify({
				query: `mutation CreateTrack($input: LibraryTrackCreateInput!) { libraryTrackCreate(input: $input) { ... on LibraryTrackCreateSuccess { createdLibraryTrack { id } } } }`,
				variables: {
					input: {
						uploadId: id,
						title: file.name,
					},
				},
			}),
		});

		const createTrackData = await createTrack.json();
		return createTrackData.data.libraryTrackCreate.createdLibraryTrack.id;
	};

	const fetchSongAnalysis = async (trackId) => {
		const response = await fetch("https://api.cyanite.ai/graphql", {
			method: "POST",
			headers: {
				authorization: "Bearer " + token,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				variables: {
					id: trackId,
				},
				query: `query LibraryTrackQuery($id: ID!) {
                    libraryTrack(id: $id) {
                        __typename
                        ... on LibraryTrack {
                        title
                        audioAnalysisV6 {
                            __typename
                            ... on AudioAnalysisV6Finished {
                            result {
                                genreTags
                                bpmRangeAdjusted
                                keyPrediction {
                                confidence
                                }
                                subgenreTags
                                energyDynamics
                                voiceTags
                                key
                                moodTags
                            }
                            }
                            ... on AudioAnalysisV6Failed {
                            error {
                                message
                            }
                            }
                        }
                        }
                    }
                    }`,
			}),
		});

		const data = await response.json();
		return data;
	};

	const handleCompare = async () => {
		setLoading(true);
		try {
			let newTrackIds = [...trackIds];

			// If there are files selected, upload them and get new track IDs
			if (files[0] || files[1]) {
				// const uploadedIds = await Promise.all(files.map(uploadFile));

				// // Only update track IDs for files that were uploaded successfully
				// newTrackIds = trackIds.map((id, index) => {
				// 	return uploadedIds[index] || id;
				// });

				// setTrackIds(newTrackIds);

				// Wait for analysis to complete (simplified for demo)
				await new Promise((resolve) => setTimeout(resolve, 3000));
			}

			const similarityCheck = await fetch("https://api.cyanite.ai/graphql", {
				method: "POST",
				headers: {
					authorization: "Bearer " + token,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					variables: {
						libraryTrackId: newTrackIds[0],
						target: { library: {} },
					},
					query: `query SimilaritySearchQuery($target: SimilarTracksTarget!, $libraryTrackId: ID!) {
                    libraryTrack(id: $libraryTrackId) {
                        __typename
                        ... on LibraryTrack {
                        similarTracks(target: $target, first: 3) {
                            __typename
                            ... on SimilarTracksConnection {
                            pageInfo {
                                hasNextPage
                            }
                            edges {
                                __typename
                                node {
                                __typename
                                ... on SpotifyTrack {
                                    id
                                }
                                ... on LibraryTrack {
                                    id
                                    title
                                }
                                }
                                cursor
                            }
                            }
                            ... on SimilarTracksError {
                            code
                            message
                            }
                        }
                        }
                    }
                    }`,
				}),
			});

			const similarityCheckData = await similarityCheck.json();
			const similarTrack =
				similarityCheckData.data.libraryTrack.similarTracks.edges.find(
					(edge) => edge.node.id === newTrackIds[1],
				);

			const analysisResults = await Promise.all(
				newTrackIds.map(fetchSongAnalysis),
			);
			setAnalysisResults(
				analysisResults.map(
					(data) => data.data.libraryTrack.audioAnalysisV6.result,
				),
			);

			const similarityScore = similarTrack
				? "High similarity detected between tracks"
				: "Low similarity detected between tracks";
			setResult(similarityScore);
		} catch (error) {
			console.error(error);
			setResult("An error occurred during comparison.");
		}
		setLoading(false);
	};

	// Format key for display
	const formatKey = (key) => {
		if (!key) return "N/A";
		// Convert "ebMajor" to "Eb Major"
		return key
			.replace(/([A-Z])/g, " $1") // Insert space before capital letters
			.replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
			.trim();
	};

	// Helper to display tags nicely
	const displayTags = (tags) => {
		if (!tags || tags.length === 0) return "N/A";
		return tags.join(", ");
	};

	// Generate random waveform heights for visualization
	const generateWaveform = () => {
		return Array.from({ length: 50 }, (_, i) => {
			const height = 20 + Math.floor(Math.random() * 30);
			return (
				<div
					key={i}
					className="wave-bar"
					style={{ height: `${height}px` }}
				></div>
			);
		});
	};

	return (
		<div className="container">
			<h1 className="title">Song Analysis Comparison</h1>

			<div className="top-bar">
				<div className="upload-container">
					<label>Track 1:</label>
					<input
						type="file"
						accept="audio/mp3"
						onChange={(e) => handleFileChange(0, e)}
						className="upload-btn"
					/>
				</div>
				<div className="upload-container">
					<label>Track 2:</label>
					<input
						type="file"
						accept="audio/mp3"
						onChange={(e) => handleFileChange(1, e)}
						className="upload-btn"
					/>
				</div>
			</div>

			<div className="analyze-section">
				<button
					className="compare-btn"
					onClick={handleCompare}
					disabled={loading}
				>
					{loading ? "Analyzing..." : "🔍 Compare Tracks"}
				</button>
			</div>

			{result && (
				<div className="result-container">
					<div className="result">{result}</div>
					<div className="similarity-meter">
						<div
							className="similarity-fill"
							style={{ width: result.includes("High") ? "80%" : "30%" }}
						></div>
					</div>
				</div>
			)}

			<div className="comparison-container">
				<div className="table-container">
					<div className="table-header">
						<div>Properties</div>
						<div>Track 1</div>
						<div>Track 2</div>
					</div>

					<div className="table-row-container">
						<div className="table-row">
							<div className="property">BPM</div>
							<div className="value">
								{analysisResults[0]?.bpmRangeAdjusted || "N/A"}
							</div>
							<div className="value">
								{analysisResults[1]?.bpmRangeAdjusted || "N/A"}
							</div>
						</div>

						<div className="table-row">
							<div className="property">Key</div>
							<div className="value">{formatKey(analysisResults[0]?.key)}</div>
							<div className="value">{formatKey(analysisResults[1]?.key)}</div>
						</div>

						<div className="table-row">
							<div className="property">Voice</div>
							<div className="value">
								{displayTags(analysisResults[0]?.voiceTags)}
							</div>
							<div className="value">
								{displayTags(analysisResults[1]?.voiceTags)}
							</div>
						</div>

						<div className="table-row">
							<div className="property">Energy</div>
							<div className="value">
								{analysisResults[0]?.energyDynamics || "N/A"}
							</div>
							<div className="value">
								{analysisResults[1]?.energyDynamics || "N/A"}
							</div>
						</div>

						<div className="table-row">
							<div className="property">Genre</div>
							<div className="value">
								{displayTags(analysisResults[0]?.genreTags)}
							</div>
							<div className="value">
								{displayTags(analysisResults[1]?.genreTags)}
							</div>
						</div>

						<div className="table-row">
							<div className="property">Subgenre</div>
							<div className="value">
								{displayTags(analysisResults[0]?.subgenreTags)}
							</div>
							<div className="value">
								{displayTags(analysisResults[1]?.subgenreTags)}
							</div>
						</div>

						<div className="table-row">
							<div className="property">Mood</div>
							<div className="value">
								{displayTags(analysisResults[0]?.moodTags)}
							</div>
							<div className="value">
								{displayTags(analysisResults[1]?.moodTags)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Most Representative Segment */}


			{analysisResults[0] != null && analysisResults[1] != null ? (
				<>
					{" "}
					<div className="segment-btn-container">
						<button className="segment-btn">
							🎵 Play Most Representative Segments
						</button>
					</div>
					{/* Audio Waveforms */}
					<div className="waveform-cont-cont">
						<div className="waveform-container">
							<div className="waveform-title">Track 1</div>
							<div className="waveform-row">
								<button className="play-circle">▶</button>
								<div className="waveform">{generateWaveform()}</div>
							</div>

							<div className="waveform-title">Track 2</div>
							<div className="waveform-row">
								<button className="play-circle">▶</button>
								<div className="waveform">{generateWaveform()}</div>
							</div>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
};

export default Analysis;
