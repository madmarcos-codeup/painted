import {getHeaders, isLoggedIn} from "../auth.js";
import CreateView from "../createView.js";

let story = undefined;
let photoImageData = undefined;
let audioData = undefined;

export default function addStory(props) {
    story = props.story;
    if(story && story.photoData) {
        photoImageData = story.photoData;
    } else {
        photoImageData = undefined;
    }
    if(story && story.audioData) {
        audioData = story.audioData;
    } else {
        audioData = undefined;
    }

    // console.log(story);

    const addStoryHTML = generateAddStoryHTML(props.story);

    // console.log(props);

    return `
        <div id="addstory-container" class="container-fluid app-content">
            <header>
                <h1>${!props.story ? "Add" : "Edit"} Story</h1>
            </header>
            <main>
                ${addStoryHTML}
            </main>
        </div>
    `;
}

function generateAddStoryHTML(story) {
    let addHTML = ``;

    // if(!isLoggedIn()) {
    //     return addHTML;
    // }

    // const categoryHTML = generateCategoryHTML(categories);

    addHTML = `
            <form id="addstory-form">
                <div class="mb-3">
                    <label for="vet_name" class="form-label">Veteran's name</label><br>
                    <input id="vet_name" name="vet_name" class="form-control" value="${!story || !story.vetName ? "" : story.vetName}" type="text" placeholder="Enter name of veteran">
                    <div class="invalid-feedback">
                        Vet's name cannot be blank.
                    </div>
                    <div class="valid-feedback">
                        Vet's name is ok!
                    </div>
                </div>

                <div class="mb-3">
                    <label for="vet_photo_file" class="form-label">Veteran's photo</label><br>
                    <input id="vet_photo_file" name="vet_photo_file" class="form-control" type="file" accept="image/jpeg, image/png, image/jpg, image/gif">
                    <img id="vet_photo" name="vet_photo" class="card-img-top img-circle profile-image vet-photo-image" src="${!story || !story.photoData ? "images/generic_male.jpeg" : story.photoData}" alt="No image specified">
                </div>
                
                <div class="mb-3">
                    <label for="story_title" class="form-label">Story title</label><br>
                    <input id="story_title" name="story_title" class="form-control" value="${!story || !story.storyTitle ? "" : story.storyTitle}" type="text" placeholder="Enter story title">
                    <div class="invalid-feedback">
                        Story title cannot be blank.
                    </div>
                    <div class="valid-feedback">
                        Story title is ok!
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="story_content" class="form-label">Story content</label><br>
                    <textarea id="story_content" name="story_content" class="form-control" rows="5" cols="50" placeholder="Enter story content">${!story || !story.story ? "" : story.story}</textarea>
                    <div class="invalid-feedback">
                        Content cannot be blank.
                    </div>
                    <div class="valid-feedback">
                        Content is ok!
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="vet_audio_file" class="form-label">Story audio (mp3)</label><br>
                    <input id="vet_audio_file" name="vet_audio_file" class="form-control" type="file" accept="audio/mpeg">
                    <audio id="vet_audio" 
                        controls
                        src="${!story || !story.audioData ? undefined : story.audioData}">                        
                    </audio>
                </div>

                <button data-id="0" id="saveStory" name="saveStory" type="button" class="my-button button btn-primary">Save story</button>
            </form>`;

    return addHTML;
}

export function addStoryEvent() {
    setupImageHandler();
    setupAudioHandler();
    setupSaveHandler();
}

// from https://medium.com/@codefoxx/how-to-upload-and-preview-an-image-with-javascript-749b92711b91
function setupImageHandler() {
    const photoInput = document.querySelector("#vet_photo_file");
    photoInput.addEventListener("change", function(event) {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            photoImageData = reader.result;
            document.querySelector("#vet_photo").src = photoImageData;
        });
        reader.readAsDataURL(this.files[0]);
    });
}

function setupAudioHandler() {
    const audioInput = document.querySelector("#vet_audio_file");
    audioInput.addEventListener("change", function(event) {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            audioData = reader.result;
            document.querySelector("#vet_audio").src = audioData;
        });
        reader.readAsDataURL(this.files[0]);
    });
}

function setupSaveHandler() {
    const saveButton = document.querySelector("#saveStory");
    if(saveButton) {
        saveButton.addEventListener("click", function (event) {
            const storyId = parseInt(this.getAttribute("data-id"));
            saveStory(storyId);
        });
    }
}

function saveStory(storyId) {
    // get the title and content for the new/updated post
    const vetName = document.querySelector("#vet_name");
    const storyTitle = document.querySelector("#story_title");
    const storyContent = document.querySelector("#story_content");

    // don't allow save if title or content are invalid
    // if(!validateFields()) {
    //     return;
    // }

    // don't need this anymore since I am now using bootstrap validation

    // if(titleField.value.trim().length < 1) {
    //     showNotification("Title cannot be blank!", "warning");
    //     return;
    // }
    // if(contentField.value.trim().length < 1) {
    //     showNotification("Content cannot be blank!", "warning");
    //     return;
    // }
    // make the new/updated post object
    // const selectedCategories = getSelectedCategories();
    const newStory = {
        vetName: vetName.value,
        storyTitle: storyTitle.value,
        story: storyContent.value,
        photoData: photoImageData,
        audioData
    }

    // console.log(newStory);

    // make the request
    const request = {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newStory)
    }
    let url = BACKEND_HOST_URL + "/api/stories";

    if(story) {
        request.method = "PUT";
        url = `${BACKEND_HOST_URL}/api/stories/${story.id}`;
    }

    // if we are updating a post, change the request and the url
    // if(postId > 0) {
    //     request.method = "PUT";
    //     url += `/${postId}`;
    // }

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