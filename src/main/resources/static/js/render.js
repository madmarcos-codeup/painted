import Navbar from "./views/partials/Navbar.js";
import {getNotificationElement, showNotification} from "./messaging.js";

/**
 * Pushes the current URI to the URL bar and sets the HTML of the app div.
 * @param props - the data required for view rendering
 * @param route - the object containing information for the given endpoint
 */
export default function render(props, route) {
    const app = document.querySelector('#app');
    // const title = `REST Blog - ${route.title}`;
    const title = APP_TITLE;
    document.title = title;
    app.innerHTML = `${Navbar(null)} ${getNotificationElement()} ${route.returnView(props)}`;
    if (route.viewEvent){
        route.viewEvent();
    }

}
