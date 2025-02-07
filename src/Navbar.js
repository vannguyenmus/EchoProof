export default function Navbar() {
    return <nav className="nav">
        < a href="/home" className="site-title"> Echo Proof</a>
        <ul className="active">
            <li>
                <a href="/home"> Home</a>
            </li>
            <li>
                <a href="/solutions"> Solutions</a>
            </li>
            <li>
                <a href="/marketplace"> Marketplace</a>
            </li>
            {/* <li>
            </li> */}
        </ul>
        <div className="empty">
            <a href="/login" className="login-link"> Login</a>
        </div>
    </nav>
}


// import React from "react";
// import "./Navbar.css";

// export default function Navbar() {
//     return (
//         <nav className="nav">
//             <a href="/home" className="site-title">
//                 Echo Proof
//             </a>
//             <ul className="nav-links">
//                 <li>
//                     <a href="/home">Home</a>
//                 </li>
//                 <li>
//                     <a href="/solutions">Solutions</a>
//                 </li>
//                 <li>
//                     <a href="/marketplace">Marketplace</a>
//                 </li>
//             </ul>
//             <div className="login-button-container">
//                 <button className="login-button">Login</button>
//             </div>
//         </nav>
//     );
// }
