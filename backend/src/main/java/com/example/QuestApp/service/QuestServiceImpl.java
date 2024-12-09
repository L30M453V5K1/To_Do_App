package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestServiceImpl implements QuestService {

    @Autowired
    private QuestRepository questRepository;

    @Override
    public List<Quest> getAllQuests(String sort, boolean importantFilter, String search) {
        // Convert the immutable list to a mutable list
        List<Quest> quests = new ArrayList<>((List<Quest>) questRepository.findAll());

        // Apply the filter if needed
        if (importantFilter) {
            quests = quests.stream()
                    .filter(Quest::isImportant) // Filter only important quests
                    .collect(Collectors.toList());
        }

        // Apply search if needed (matching description)
        if (search != null && !search.isEmpty()) {
            quests = quests.stream()
                    .filter(quest -> quest.getDescription().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Sort the quests by ID (ascending or descending)
        if ("desc".equalsIgnoreCase(sort)) {
            quests.sort(Comparator.comparing(Quest::getId).reversed());
        } else {
            quests.sort(Comparator.comparing(Quest::getId));
        }

        return quests;
    }

    @Override
    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    @Override
    public Quest updateQuest(int id, Quest newQuest) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        quest.setDescription(newQuest.getDescription());
        quest.setImportant(newQuest.isImportant());
        quest.setCompleted(newQuest.isCompleted());
        quest.setImageUrl(newQuest.getImageUrl()); // Ensure the imageUrl is updated
        return questRepository.save(quest);
    }



    @Override
    public void deleteQuest(int id) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        questRepository.delete(quest);
    }
}
