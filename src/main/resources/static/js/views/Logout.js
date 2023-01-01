import createView from "../createView.js";

export default function Logout(props) {
    return `<div id="logout-container">

</div>`;
}

export function LogoutEvent() {
    // window.localStorage.removeItem("access_token");
    // window.localStorage.removeItem("refresh_token");
    // window.localStorage.removeItem("user");
    // window.localStorage.removeItem("login.fail");
    window.localStorage.clear();
    createView("/");
}
