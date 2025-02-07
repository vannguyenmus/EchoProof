import "./chatbot.css";
const ChatbotUI = () => {
    return (
        <div className="chatbot-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="menu">
                    <button className="menu-btn">New Chat</button>
                    <button className="menu-btn">Recent Chats</button>
                    <button className="menu-btn">Rephrase my paragraph</button>
                    <button className="menu-btn">Fix this code</button>
                    <button className="menu-btn">How to create a for loop?</button>
                </div>
                <div className="user-info">
                    <p>Welcome back,</p>
                    <h3>Grabiel</h3>
                </div>
            </div>

            {/* Chat Section */}
            <div className="chat-section">
                <div className="chat-header">
                    <h2>What should I do first when I heard a song sound like mine on YouTube?</h2>
                </div>
                <div className="chat-response">
                    <div className="response-box">
                        <h3>Document The Similarities:</h3>
                        <p>
                            Note Down Timestamps, And Record Key Similarities Between Your Song And The
                            One On YouTube. Gather Any Evidence Of Your Song’s Creation Date, Such As
                            Original Recordings, Timestamps, Or Drafts.
                        </p>
                        <h3>Check For Copyright Registration:</h3>
                        <p>
                            Ensure That Your Song Is Registered With A Copyright Office. If It’s Not,
                            You Should Consider Registering It Immediately To Strengthen Your Legal
                            Position.
                        </p>
                        <h3>Contact The Creator:</h3>
                        <p>
                            Politely Reach Out To The Creator Or Uploader Of The Video. Sometimes, This
                            Could Be A Misunderstanding Or An Unintentional Use. Open A Line Of
                            Communication To Discuss The Issue.
                        </p>
                    </div>
                </div>
                {/* Response Type Bar */}
                <div className="response-bar">
                    <input
                        type="text"
                        placeholder="Type your response here..."
                        className="response-input"
                    />
                    <button className="send-btn">
                        <i className="fas fa-paper-plane"></i> Send
                    </button>
                </div>
                {/* Footers */}
                <div className="footer-links">
                    <button className="footer-btn">Articles</button>
                    <button className="footer-btn">Official Offices</button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotUI;