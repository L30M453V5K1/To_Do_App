package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        validateRepeatableQuest(quest);
        return questRepository.save(quest);
    }

    @Override
    public Quest updateQuest(int id, Quest newQuest) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        quest.setDescription(newQuest.getDescription());
        quest.setImportant(newQuest.isImportant());
        quest.setCompleted(newQuest.isCompleted());
        quest.setImageUrl(newQuest.getImageUrl());
        quest.setRepeatable(newQuest.isRepeatable());
        quest.setRepeatDays(newQuest.getRepeatDays());
        quest.setRepeatTime(newQuest.getRepeatTime());
        validateRepeatableQuest(quest);
        return questRepository.save(quest);
    }

    @Override
    public void deleteQuest(int id) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        questRepository.delete(quest);
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
