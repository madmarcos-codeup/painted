package docrob.sarahvet.controller;

import docrob.sarahvet.data.User;
import docrob.sarahvet.data.UserRole;
import docrob.sarahvet.misc.FieldHelper;
import docrob.sarahvet.repository.StoryRepository;
import docrob.sarahvet.data.Story;
import docrob.sarahvet.service.AuthBuddy;
import docrob.sarahvet.service.S3Service;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping(value = "/api/stories", produces = "application/json")
public class StoryController {
    private StoryRepository storyRepository;
    private AuthBuddy authBuddy;

    private S3Service s3Service;

    @GetMapping("")
    public List<Story> fetchStories() {
        return storyRepository.findAll();
    }

    @PostMapping("")
    public void createStory(@RequestBody Story newStory, @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        User loggedInUser = authBuddy.getUserFromAuthHeaderJWT(authHeader);
        if(loggedInUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

//        if(newStory.getPhotoImageData() != null) {
//            String photoFileName = s3Service.uploadFileFromBase64(newStory.getPhotoImageData());
//            newStory.setPhotoName(photoFileName);
//        }

        newStory.setAuthor(loggedInUser);
        storyRepository.save(newStory);
    }

    @GetMapping("/{id}")
    public Optional<Story> fetchStoryById(@PathVariable long id) {
        Optional<Story> optionalStory = storyRepository.findById(id);
        if(optionalStory.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Story id " + id + " not found");
        }
        return optionalStory;
    }

    @DeleteMapping("/{id}")
    public void deleteStoryById(@PathVariable long id, @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        User loggedInUser = authBuddy.getUserFromAuthHeaderJWT(authHeader);
        if(loggedInUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Optional<Story> optionalStory = storyRepository.findById(id);
        if(optionalStory.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Story id " + id + " not found");
        }
        Story originalStory = optionalStory.get();
//        if(loggedInUser.getRole() != UserRole.ADMIN || loggedInUser.getId() != originalStory.getAuthor().getId()) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
//        }

        storyRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public void updateStory(@RequestBody Story updatedPost, @PathVariable long id, @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        User loggedInUser = authBuddy.getUserFromAuthHeaderJWT(authHeader);
        if(loggedInUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        Optional<Story> optionalStory = storyRepository.findById(id);
        if(optionalStory.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Story " + id + " not found");
        }
        Story originalStory = optionalStory.get();

//        if(loggedInUser.getRole() != UserRole.ADMIN || loggedInUser.getId() != originalStory.getAuthor().getId()) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
//        }

        // in case id is not in the request body (i.e., updatedPost), set it
        // with the path variable id
        originalStory.setId(id);

        // copy any new field values FROM updatedPost TO originalPost
        BeanUtils.copyProperties(updatedPost, originalStory, FieldHelper.getNullPropertyNames(updatedPost));

        storyRepository.save(originalStory);
    }
}
