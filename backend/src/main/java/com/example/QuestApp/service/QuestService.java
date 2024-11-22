package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import java.util.List;

public interface QuestService {

    List<Quest> getAllQuests(String sort, boolean importantFilter);
    Quest createQuest(Quest quest);
    Quest updateQuest(int id, Quest newQuest) throws Exception;
    void deleteQuest(int id) throws Exception;
}
