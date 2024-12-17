package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class scheduler {

    @Autowired
    private QuestRepository questRepository;

    // Run every minute (adjust as needed)
    @Scheduled(cron = "0 * * * * *") // "0 * * * * *" means every minute
    public void generateRecurrentTasks() {
        List<Quest> repeatableQuests = questRepository.findByRepeatableTrue();

        LocalDateTime now = LocalDateTime.now();
        DayOfWeek currentDay = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        for (Quest quest : repeatableQuests) {
            if (shouldRepeatToday(quest, currentDay) && shouldRepeatNow(quest, currentTime)) {
                Quest newQuest = cloneQuest(quest);
                questRepository.save(newQuest);
                System.out.println("Created new recurring task for: " + quest.getDescription());
            }
        }
    }

    private boolean shouldRepeatToday(Quest quest, DayOfWeek currentDay) {
        if (quest.getRepeatDays() == null || quest.getRepeatDays().isEmpty()) {
            return false; // No days specified
        }

        // Convert stored repeatDays to a list and check if the current day matches
        List<String> repeatDays = Arrays.asList(quest.getRepeatDays().split(","));
        return repeatDays.contains(currentDay.name());
    }

    private boolean shouldRepeatNow(Quest quest, LocalTime currentTime) {
        return quest.getRepeatTime() != null && quest.getRepeatTime().equals(currentTime);
    }

    private Quest cloneQuest(Quest originalQuest) {
        Quest newQuest = new Quest();
        newQuest.setDescription(originalQuest.getDescription());
        newQuest.setImportant(originalQuest.isImportant());
        newQuest.setCompleted(false); // New task is not completed
        newQuest.setImageUrl(originalQuest.getImageUrl());
        newQuest.setRepeatable(false); // Cloned task is a single instance
        newQuest.setRepeatDays(null);
        newQuest.setRepeatTime(null);

        return newQuest;
    }
}
