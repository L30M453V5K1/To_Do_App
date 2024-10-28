package com.example.QuestApp.repository;

import com.example.QuestApp.model.Quest;
import org.springframework.data.repository.CrudRepository;

public interface QuestRepository extends CrudRepository<Quest, Integer> {
}
