package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class QuestServiceImpl implements QuestService {

    @Autowired
    private QuestRepository questRepository;

    @Override
    public List<Quest> getAllQuests(String sort) {
        List<Quest> quests = (List<Quest>) questRepository.findAll();

        // Sort quests based on the sort parameter
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
        questRepository.save(quest);
        return quest;
    }

    @Override
    public void deleteQuest(int id) throws Exception {
        Quest quest = questRepository.findById(id).orElseThrow(() -> new Exception("Quest not found!"));
        questRepository.delete(quest);
    }
}
