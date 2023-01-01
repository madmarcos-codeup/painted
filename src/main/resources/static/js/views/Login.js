import {setTokens, setUserInfo} from "../auth.js";
import createView from "../createView.js";

export default function Login(props) {
    return `<div id="login-container">
</div>`;
}

export function LoginEvent() {
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt();
}

async function handleCredentialResponse(loginInfo) {
    const jwt = loginInfo.credential;
    // console.log(jwt);
    setTokens(jwt);
    const user = await setUserInfo(jwt, false);
    // console.log(user);
    if(!user || !user.role) {
        // console.log("login failed");
        localStorage.setItem("login.fail", "true");
    // } else {
    //     console.log("wtf");
    }
    createView("/");
}