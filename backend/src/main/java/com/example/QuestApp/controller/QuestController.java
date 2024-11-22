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
            @RequestParam(required = false, defaultValue = "false") boolean importantFilter) {
        return questService.getAllQuests(sort, importantFilter);
    }


    @PostMapping("/api/index")
    public Quest addQuest(@RequestBody Quest quest) { //post method has @RequestBody
        return questService.createQuest(quest);
    }

    @PutMapping("/api/index/{id}")
    public Quest updateQuest(@PathVariable int id, @RequestBody Quest quest) throws Exception {
        return questService.updateQuest(id, quest);
    }

    @DeleteMapping("/api/index/{id}")
    public ApiResponse deleteQuest(@PathVariable int id) throws Exception { //delete method has @PathVariable
        questService.deleteQuest(id);
        return new ApiResponse("Successfully deleted quest with id: "+id);
    }

}
