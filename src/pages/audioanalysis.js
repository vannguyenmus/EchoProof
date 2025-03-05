import React, { useEffect, useState } from "react";
import "./AudioAnalysisUI.css";

const Analysis = () => {
    const [files, setFiles] = useState([null, null]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Update these tokens when create a new account
    // token is from integration
    // compareToken is from GraphQL
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiSW50ZWdyYXRpb25BY2Nlc3NUb2tlbiIsInZlcnNpb24iOiIxLjAiLCJpbnRlZ3JhdGlvbklkIjoxNDUwLCJ1c2VySWQiOjE4OTE5OCwiYWNjZXNzVG9rZW5TZWNyZXQiOiIyZjA2NWJkOTg5MzRmZjIxOGIzNDhiYzQyZmE0NDkzYmI3ZmQyNGRiNzVlYmIxMDczMGQwZDM4NjgxZDQ1YmEwIiwiaWF0IjoxNzQwMjQxNjQ1fQ.absrbBx0PZ8jli3RTp-_3SKLMzaogKGvoBHuUhAMWOk";
    const compareToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiQWNjZXNzVG9rZW4iLCJ2ZXJzaW9uIjoiMS4wIiwicmVmcmVzaEtleUlkIjozODkzNTUsInVzZXJJZCI6MTg1MjcyLCJpYXQiOjE3Mzg5MDk3MzQsImV4cCI6MTczOTUxNDUzNH0.YGHelUKp8xYyWQ8hvjvSuHQ2Z1MjKtBTxbYJFzdlSMY";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.cyanite.ai/graphql', {
                    method: 'POST',
                    headers: {
                        'authorization': 'Bearer ' + compareToken,
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        operationName: 'SimilaritySearchTracksResults',
                        variables: {
                            first: 10,
                            id: '21619641',
                            target: { library: {} },
                            searchMode: { complete: true },
                            experimentalFilter: null
                        },
                        query: `query SimilaritySearchTracksResults($id: ID!, $first: Int = 10, $searchMode: SimilarTracksSearchMode, $target: SimilarTracksTarget!, $experimentalFilter: experimental_SimilarTracksFilter) {
              track(id: $id) {
                ... on Track {
                  id
                  similarTracks(first: $first, target: $target, searchMode: $searchMode, experimental_filter: $experimentalFilter) {
                    ... on SimilarTracksConnection {
                      edges {
                        node {
                          id
                          title
                          audioUrl
                          cover {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`
                    })
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = (index, event) => {
        const newFiles = [...files];
        newFiles[index] = event.target.files[0];
        setFiles(newFiles);
    };

    const uploadFile = async (file) => {
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

    const handleCompare = async () => {
        setLoading(true);
        try {
            const trackIds = await Promise.all(files.map(uploadFile));
            await new Promise((resolve) => setTimeout(resolve, 30000));

            const similarityCheck = await fetch("https://api.cyanite.ai/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // This token has to be retrieved from cynite's request network tab https://app.cyanite.ai/search?source=spotify&sourceId=2EcvmlJIYbS6u7I61InqOU&sourceUserLibraryId
                    Authorization: "Bearer " + compareToken,
                },
                body: JSON.stringify({
                    operationName: 'SimilaritySearchTracksResults',
                    variables: {
                        first: 10,
                        id: trackIds[0],
                        // id: "21619651",
                        target: { library: {} },
                        searchMode: { complete: true },
                        experimentalFilter: null
                    },
                    query: `query SimilaritySearchTracksResults($id: ID!, $first: Int = 10, $searchMode: SimilarTracksSearchMode, $target: SimilarTracksTarget!, $experimentalFilter: experimental_SimilarTracksFilter) {
              track(id: $id) {
                ... on Track {
                  id
                  similarTracks(first: $first, target: $target, searchMode: $searchMode, experimental_filter: $experimentalFilter) {
                    ... on SimilarTracksConnection {
                      edges {
                        node {
                          id
                          title
                          audioUrl
                          cover {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }`,
                }),
            });

            const similarityCheckData = await similarityCheck.json();
            const similarTrack = similarityCheckData.data.track.similarTracks.edges.find(
                (edge) => edge.node.id === trackIds[1]
            );

            setResult(similarTrack ? "Tracks are similar" : "Tracks are different");
        } catch (error) {
            console.error(error);
            setResult("An error occurred during comparison.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="top-bar">
                {files.map((_, index) => (
                    <input
                        key={index}
                        type="file"
                        accept="audio/mp3"
                        onChange={(e) => handleFileChange(index, e)}
                        className="upload-btn"
                    />
                ))}
            </div>

            <div className="analyze-section">
                <button className="compare-btn" onClick={handleCompare} disabled={loading}>
                    {loading ? "Comparing..." : "🔍 Compare"}
                </button>
            </div>

            {result && <div className="result">{result}</div>}

            <div className="table-container">
                <div className="table-header">
                    <div>File Name</div>
                    <div>BPM</div>
                    <div>Key</div>
                    <div>Voice Gender</div>
                    <div>Voice Presence Profile</div>
                    <div>Genre Tags</div>
                </div>
                <div className="table-row">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            {/* Most Representative Segment */}
            <div className="segment-btn-container">
                <button className="segment-btn">🎵 Most Representative Segment</button>
            </div>

            {/* Audio Waveforms */}
            <div className="waveform-cont-cont">
                <div className="waveform-container">
                    {[1, 2].map((_, idx) => (
                        <div key={idx} className="waveform-row">
                            <button className="play-circle">▶</button>
                            <div className="waveform">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className={`wave-bar ${i % 3 === 0 ? "tall" : ""}`}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Analysis;


// import React from "react";
// import "./AudioAnalysisUI.css"; // Import CSS file

// const Analysis = () => {
//     return (
//         <div className="container">
//             {/* Upload and YouTube Input */}
//             <div className="top-bar">
//                 <button className="upload-btn">Upload</button>
//                 <input
//                     type="text"
//                     placeholder="Paste YouTube URL..."
//                     className="youtube-input"
//                 />
//                 <button className="play-btn">➤</button>
//             </div>

//             {/* Start Analyzing Button */}
//             <div className="analyze-section">
//                 <button className="analyze-btn">⚡ Start Analyzing</button>
//             </div>

//             {/* Analysis Table */}
            // <div className="table-container">
            //     <div className="table-header">
            //         <div>File Name</div>
            //         <div>BPM</div>
            //         <div>Key</div>
            //         <div>Voice Gender</div>
            //         <div>Voice Presence Profile</div>
            //         <div>Genre Tags</div>
            //     </div>
            //     <div className="table-row">
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //         <div></div>
            //     </div>
            // </div>

            // {/* Most Representative Segment */}
            // <div className="segment-btn-container">
            //     <button className="segment-btn">🎵 Most Representative Segment</button>
            // </div>

            // {/* Audio Waveforms */}
            // <div className="waveform-cont-cont">
            //     <div className="waveform-container">
            //         {[1, 2].map((_, idx) => (
            //             <div key={idx} className="waveform-row">
            //                 <button className="play-circle">▶</button>
            //                 <div className="waveform">
            //                     {[...Array(20)].map((_, i) => (
            //                         <div key={i} className={`wave-bar ${i % 3 === 0 ? "tall" : ""}`}></div>
            //                     ))}
            //                 </div>
            //             </div>
            //         ))}
            //     </div>
            // </div>
//         </div>
//     );
// };

// export default Analysis;
