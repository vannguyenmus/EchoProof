import React from "react";
import { auth, setFirestoreUser } from "./firebase-config";
import {
    signInWithPopup,
    GoogleAuthProvider,
    getAdditionalUserInfo,
} from "firebase/auth";
import "./login.css";

const Login = () => {
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const additionalInfo = getAdditionalUserInfo(result);

            if (additionalInfo.isNewUser) {
                const userData = {
                    uid: user.uid,
                    userName: user.displayName,
                    profilePic: user.photoURL,
                    investingStrategy: "",
                    deposit: 0,
                    stock: [],
                };

                await setFirestoreUser(user.uid, userData);
            } else {
                console.log("User already exists");
            }
        } catch (err) {
            console.error("Error during sign-in:", err);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="branding">
                    <img
                        src="/logo.png" // Replace with your platform's logo URL
                        alt="Music Licensing Logo"
                        className="logo"
                    />
                    <h1>Music Protection for Creators</h1>
                    <p>Secure your creations and license them with confidence.</p>
                </div>

                <div className="action">
                    <button className="google-button" onClick={signInWithGoogle}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
                            alt="Google Logo"
                            className="google-logo"
                        />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
