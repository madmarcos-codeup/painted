import Home, {HomeEvents} from "./views/Home.js";
import PostIndex, {postSetup} from "./views/PostIndex.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";
import Loading from "./views/Loading.js";
import Login, {LoginEvent} from "./views/Login.js";
import Register from "./views/Register.js"
import {RegisterEvent} from "./views/Register.js";
import prepareUserHTML, {prepareUserJS} from "./views/User.js";
// import DoLogin, {DoLoginEvents} from "./views/DoLogin.js";
import Logout, {LogoutEvent} from "./views/Logout.js";
import addStory, {addStoryEvent} from "./views/AddStory.js";

/**
 * Returns the route object for a specific route based on the given URI
 * @param URI
 * @returns {*}
 */
export default function router(URI) {
    const routes = {
        '/': {
            returnView: Home,
            state: {
                stories: '/api/stories'
            },
            uri: '/',
            title: 'Home',
            viewEvent: HomeEvents
        },
        // '/dologin': {
        //     returnView: DoLogin,
        //     state: {},
        //     uri: '/dologin',
        //     title: "DoLogin",
        //     viewEvent: DoLoginEvents
        // },
        '/login': {
            returnView: Login,
            state: {},
            uri: '/login',
            title: "Login via Google",
            viewEvent: LoginEvent
        },
        '/logout': {
            returnView: Logout,
            state: {},
            uri: '/logout',
            title: "Logout",
            viewEvent: LogoutEvent
        },
        '/register': {
            returnView: Register,
            state: {},
            uri: '/register',
            title: 'Register',
            viewEvent: RegisterEvent
        },
        '/addstory': {
            returnView: addStory,
            state: {},
            uri: '/addstory',
            title: 'Add Story',
            viewEvent: addStoryEvent
        },
        '/editstory/:id': {
            returnView: addStory,
            state: {
                story: '/api/stories/:id'
            },
            uri: '/editstory/:id',
            title: "Edit Story",
            viewEvent: addStoryEvent
        },
        '/me': {
            returnView: prepareUserHTML,
            state: {
                me: '/api/users/me'
            },
            uri: '/me',
            title: 'User Info',
            viewEvent: prepareUserJS
        },
        '/about': {
            returnView: About,
            state: {},
            uri: '/about',
            title: 'About',
        },
        '/error': {
            returnView: Error404,
            state: {},
            uri: location.pathname,
            title: ' ERROR',
        },
        '/loading': {
            returnView: Loading,
            state: {},
            uri: location.pathname,
            title: 'Loading...',
        }
    };

    if(!routes[URI]) {
        for(const routeKey in routes) {
            const pattern = new URLPattern({ pathname: routeKey });
            if(pattern.test(BACKEND_HOST_URL + URI)) {
                // console.log(`${URI} MATCHES ${routeKey}`);
                const newPath = pattern.exec(BACKEND_HOST_URL + URI);
                // console.log(newPath);
                const foundRoute = routes[routeKey];
                for(const statePiece in foundRoute.state) {
                    let stateVal = foundRoute.state[statePiece];
                    // replace any found group pieces from newPath
                    for(const pathVar in newPath.pathname.groups) {
                        stateVal = stateVal.replaceAll(`:${pathVar}`, newPath.pathname.groups[pathVar]);
                    }
                    foundRoute.state[statePiece] = stateVal;
                    // console.log("Checking state piece: " + foundRoute.state[statePiece]);
                }
                // modify route.uri
                for(const pathVar in newPath.pathname.groups) {
                    foundRoute.uri = foundRoute.uri.replaceAll(`:${pathVar}`, newPath.pathname.groups[pathVar]);
                }
                console.log(foundRoute);
                return foundRoute;
            }
        }
        // did not find a route matching the URI so let jalopy determine the error route
    }

    return routes[URI];
}

