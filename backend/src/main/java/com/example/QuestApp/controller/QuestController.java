package com.example.QuestApp.controller;

import com.example.QuestApp.model.ApiResponse;
import com.example.QuestApp.model.Quest;
import com.example.QuestApp.service.QuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    // New GET endpoint to fetch a single quest by its ID
    @GetMapping("/api/index/{id}")
    public Quest getQuestById(@PathVariable int id) throws Exception {
        return questService.getQuestById(id); // Add a method in your service to fetch quest by ID
    }

    @PostMapping("/api/index")
    public Quest addQuest(@RequestBody Quest quest) {
        return questService.createQuest(quest);
    }

    @PutMapping("/api/index/{id}")
    public Quest updateQuest(@PathVariable int id, @RequestBody Quest quest) throws Exception {
        System.out.println("Received updated quest: " + quest);
        return questService.updateQuest(id, quest);
    }

    @DeleteMapping("/api/index/{id}")
    public ApiResponse deleteQuest(@PathVariable int id) throws Exception {
        questService.deleteQuest(id);
        return new ApiResponse("Successfully deleted quest with id: " + id);
    }
}
