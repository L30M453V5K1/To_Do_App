package com.example.QuestApp.repository;

import com.example.QuestApp.model.Quest;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface QuestRepository extends CrudRepository<Quest, Integer> {
    List<Quest> findByRepeatableTrue(); // Fetch all repeatable tasks
}
