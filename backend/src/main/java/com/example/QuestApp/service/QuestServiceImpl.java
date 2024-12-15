package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestServiceImpl implements QuestService {

    @Autowired
    private QuestRepository questRepository;

    @Override
    public List<Quest> getAllQuests(String sort, boolean importantFilter, String search) {
        List<Quest> quests = new ArrayList<>((List<Quest>) questRepository.findAll());

        if (importantFilter) {
            quests = quests.stream()
                    .filter(Quest::isImportant)
                    .collect(Collectors.toList());
        }

        if (search != null && !search.isEmpty()) {
            quests = quests.stream()
                    .filter(quest -> quest.getDescription().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if ("desc".equalsIgnoreCase(sort)) {
            quests.sort(Comparator.comparing(Quest::getId).reversed());
        } else {
            quests.sort(Comparator.comparing(Quest::getId));
        }

        return quests;
    }

    @Override
    public Quest createQuest(Quest quest) {
        // Validate the quest and ensure it's repeatable if days and time are provided
        if (quest.isRepeatable() && (quest.getRepeatDays() == null || quest.getRepeatDays().isEmpty())) {
            throw new IllegalArgumentException("Repeatable quests must have at least one repeat day.");
        }
        if (quest.isRepeatable() && quest.getRepeatTime() == null) {
            throw new IllegalArgumentException("Repeatable quests must have a repeat time.");
        }

        // Save the quest entity to the database
        return questRepository.save(quest);
    }

    @Override
    public Quest updateQuest(int id, Quest newQuest) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));

        // Update the quest's fields
        quest.setDescription(newQuest.getDescription());
        quest.setImportant(newQuest.isImportant());
        quest.setCompleted(newQuest.isCompleted());
        quest.setImageUrl(newQuest.getImageUrl());
        quest.setRepeatable(newQuest.isRepeatable());
        quest.setRepeatTime(newQuest.getRepeatTime());
        quest.setRepeatDays(newQuest.getRepeatDays()); // Directly update the repeatDays field (string)

        return questRepository.save(quest);
    }

    @Override
    public void deleteQuest(int id) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        questRepository.delete(quest);
    }

    // New method to get a quest by its ID
    @Override
    public Quest getQuestById(int id) throws Exception {
        Optional<Quest> questOptional = questRepository.findById(id);

        if (!questOptional.isPresent()) {
            throw new Exception("Quest not found with ID: " + id); // Throw an exception if quest is not found
        }

        return questOptional.get(); // Return the quest if found
    }

    private void validateRepeatableQuest(Quest quest) {
        if (quest.isRepeatable()) {
            if (quest.getRepeatDays() == null || quest.getRepeatDays().isEmpty()) {
                throw new IllegalArgumentException("Repeatable quests must have at least one repeat day.");
            }
            if (quest.getRepeatTime() == null) {
                throw new IllegalArgumentException("Repeatable quests must have a repeat time.");
            }
        }
    }
}
