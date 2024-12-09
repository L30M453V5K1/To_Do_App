package com.example.QuestApp.controller;

import com.example.QuestApp.model.ApiResponse;
import com.example.QuestApp.model.Quest;
import com.example.QuestApp.service.QuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
public class QuestController {

    @Autowired
    private QuestService questService;

    @GetMapping("/api")
    public ApiResponse browserMessage() {
        return new ApiResponse("Congratulations! Your app is working!");
    }

    @GetMapping("/api/index")
    public List<Quest> getAllQuests(
            @RequestParam(required = false, defaultValue = "asc") String sort,
            @RequestParam(required = false, defaultValue = "false") boolean importantFilter,
            @RequestParam(required = false, defaultValue = "") String search) {
        return questService.getAllQuests(sort, importantFilter, search);
    }

    // TODO
    @PostMapping("/api/index")
    public Quest addQuest(@RequestBody Quest quest) {
        if (quest.getImageUrl() != null && !quest.getImageUrl().isEmpty()) {
            System.out.println("Received image URL: " + quest.getImageUrl());
        }
        return questService.createQuest(quest);
    }

    // TODO
    @PutMapping("/api/index/{id}")
    public Quest updateQuest(
            @PathVariable int id,
            @RequestPart("quest") Quest quest,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            quest.setImageUrl(imageUrl);
        }
        return questService.updateQuest(id, quest);
    }

    // TODO
    private String saveImage(MultipartFile image) throws IOException {
        String filePath = "uploads/" + image.getOriginalFilename(); // Set the file path in the 'uploads' directory
        File file = new File(filePath); // Create a new File object
        file.getParentFile().mkdirs(); // Ensure the directory exists (create if not)
        image.transferTo(file); // Save the file to the specified path
        return image.getOriginalFilename(); // Return a URL to access the image
    }

    @DeleteMapping("/api/index/{id}")
    public ApiResponse deleteQuest(@PathVariable int id) throws Exception { //delete method has @PathVariable
        questService.deleteQuest(id);
        return new ApiResponse("Successfully deleted quest with id: "+id);
    }
}
