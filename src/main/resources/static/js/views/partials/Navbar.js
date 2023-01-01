import {getUser, isLoggedIn} from "../../auth.js";

export default function Navbar(props) {
    let nav = `
        <nav id="myNav">
            <a href="/" data-link class="my-link">Home</a>
            <a href="/about" data-link class="my-link">About</a>
        `;

    if (isLoggedIn()) {
        nav += `
            <a href="/logout" data-link class="my-link">Logout</a>
        `;
    } else {
        nav += `
            <a href="/login" data-link class="my-link">Login via Google</a>
        `;
    }

    let user = getUser();

    if(user && user.role === "ADMIN") {
        nav += `
                <a href="/addstory" data-link class="my-link">Add Story</a>
            `;
    }

    let loginName = "Not logged in";
    let loginPhoto = "";
    if (isLoggedIn()) {
        const loggedInUser = getUser();
        if (loggedInUser) {
            // console.log(loggedInUser);

            loginName = "Logged in as " + loggedInUser.userName;
            loginPhoto = loggedInUser.profilePic;
        }
    }
    nav += `
        <div id="login-name-div">
            <span id="login-name">${loginName}</span>
            <img id="login-photo" src="${loginPhoto}"> 
        </div>
        `;

    nav += `</nav>`;
    return nav;
//                <a href="/oauth2/authorization/google" data-link class="my-bypass my-link">Login via Google</a>
}