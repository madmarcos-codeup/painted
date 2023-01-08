import {showNotification} from "../messaging.js";
import CreateView from "../createView.js";
import {getHeaders, getUser, isLoggedIn} from "../auth.js";

export default function Home(props) {
    let storyHTML = makeStoryHTML(props.stories);
    let html = `
<div id="story-container" class="container-fluid home-content overflow-hidden gx-4">
    <div class="row">    
        ${storyHTML}
    </div>
</div>
    `;
    return html;
}

function makeStoryHTML(stories) {
    let user = getUser();

    let html = "";
    if(!stories || stories.length === 0) {
        return `
<div class="col">
    <p>Sorry, but we currently do not have any stories for you. :(</p>
</div>`;
    }

    for (let i = 0; i < stories.length; i++) {
        const story = stories[i];

        let adminControls = "";
        if(user && user.role === "ADMIN") {
            adminControls = `
    <span id="edit-story-${story.id}" class="edit-story-button"><a class="edit-story-link" data-link href="/editstory/${story.id}">Edit</a></span>
    <span id="delete-story-${story.id}" class="edit-story-button"><a class="edit-story-link delete-story-link" data-id="${story.id}" href="#">Delete</a></span>
`;
        }

        const categoryHTML = getCategoryHTML(story);

        const storyHTML = story.story.replace(/(?:\r\n|\r|\n)/g, '<br>');

        let storyAudioHTML = "";
        if(story.audioData) {
            storyAudioHTML = `
            <h6>Audio version</h6>
            <audio id="vet_audio-${story.id}" 
                        controls
                        src="${!story || !story.audioData ? undefined : story.audioData}">                        
                    </audio>
            `;
        }
        // console.log(story.photoURL);
        html += `
<div id="story-${story.id}" class="col-2 col-md-4 card vet-story">
            <div class="w-100 d-flex justify-content-center">
                <img class="mt-2 border border-3-secondary w-75 pt-2 card-img-top img-circle profile-image" src="${!story.photoData ? "images/generic_male.jpeg" : story.photoData}" alt="Veteran's photo">
            </div>
<!--            <i class="fas fa-edit"></i>-->
            ${adminControls}
            <div class="card-body">
                <h4 class="card-title">${story.vetName}</h4>
                <div class="card-text story-text">
                    <h5>${story.storyTitle}</h5>
                    ${storyAudioHTML}
                    <p>${storyHTML}</p>
                    
                    <div id="category-container d-flex flex-wrap">
                        ${categoryHTML}
                    </div>
                </div>
            </div>
        </div>
`;
    }
    return html;
}

function getCategoryHTML(story) {
    if(!story || !story.categories || story.categories.length === 0) {
        return "";
    }
    let html = "<h6 class=\"my-category-group\">Categories</h6>";
    for (let i = 0; i < story.categories.length; i++) {
        html += `<span class="story-category">${story.categories[i].name}</span>`;
    }
        
    return html;
}

/*
        <div id="story-3" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 card vet-story">
            <img class="card-img-top img-circle profile-image" src="https://randomuser.me/api/portraits/men/33.jpg" alt="user">
            <div class="card-body">
                <h4 class="card-title">Bob Smith</h4>
                <div class="card-text story-text">
                    <h5>Bob's story</h5>
                    <p>Click here for the audio version of this story</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam atque autem dignissimos dolores facilis illum inventore ipsum, minus, neque quas quos reiciendis repellat rerum sunt tenetur vero! Fugiat, voluptate.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam atque autem dignissimos dolores facilis illum inventore ipsum, minus, neque quas quos reiciendis repellat rerum sunt tenetur vero! Fugiat, voluptate.</p>
                </div>
            </div>
        </div>
 */
export function HomeEvents() {
    // a user who tries to log in should redirect to /home and should see a notification
    const loginFail = localStorage.getItem("login.fail");
    if(loginFail && loginFail === "true") {
        console.log("login.fail is " + loginFail);
        showNotification("I don't know you.", "warning");
        localStorage.removeItem("login.fail");
    }

    const links = document.querySelectorAll(".delete-story-link");
    for (const link of links) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const id = this.getAttribute("data-id");
            deleteStory(id);
        });
    }
}

function deleteStory(id) {
    const request = {
        method: "DELETE",
        headers: getHeaders(),
    }
    const url = BACKEND_HOST_URL + `/api/stories/${id}`;
    fetch(url, request)
        .then(function(response) {
            if(response.status !== 200) {
                console.log("fetch returned bad status code: " + response.status);
                console.log(response.statusText);
                return;
            }
            CreateView("/");
        })

}