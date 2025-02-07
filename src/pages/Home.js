import "./Homestyles.css"
import landimage from "./landimage.png";
import detect from "./detect.png";
import chatbot from "./chatbot.png";
import Homemarket from "./Homemarket";
function Home() {
    return (
        <div className="home-wrapper">
            <div className="home">
                <div className="home-text">
                    <h1 margin-top="70px" className="UpperText">Music Protection for creators</h1>
                    <h2 className="UpperText"> Accessible for everyone </h2>
                    <h2 className="LowerText" style={{ fontSize: "30px", fontStyle: "italic" }}> "Protect Your Sound. Unlock Global Access Legally"</h2>
                </div>
                <img id="hands" width="25%" height="30%" src={landimage} />
            </div>
            <div>
                <p className="body"> Music Detection: Is this song a hit or a rip-off? Let's break it down</p>
            </div>
            <br></br>
            <div className="pic-container">
                <img src={detect}></img>
            </div >
            <div>
                <br></br>
                <p className="body"> AI Chatbot: Discuss, and find solutions for your songs</p>
            </div>
            <div className="pic-container">
                <img style={{ marginBottom: "50px" }} src={chatbot}></img>
            </div >
            <div>
                <h2 style={{ padding: "0 100px" }} className="UpperText"> Don't have the copyright?</h2>
                <div margin-bottom="20px " margin-left="40px" id="text-box">
                    <p className="column LowerText">
                        01/ <br></br>
                        Artists become their own platform.
                        Submit your song to our “Copyright
                        Office” or  “License Approval”
                        and navigate your result with our direction
                    </p>
                    <p className="column LowerText">
                        02/<br></br>
                        Echo Proof provides transparent analysis about your song
                        if copyright infringement is detected during processing.
                    </p>
                    <p className="column LowerText">
                        03/<br></br>
                        Discover our results and communicate with the ChatBot if you have any questions
                    </p>
                </div>
            </div>
            <Homemarket />
        </div>

    );
}
export default Home;