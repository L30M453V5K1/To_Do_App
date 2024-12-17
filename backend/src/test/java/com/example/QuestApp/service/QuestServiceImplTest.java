package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class QuestServiceImplTest {

    @Mock
    private QuestRepository questRepository;

    @InjectMocks
    private QuestServiceImpl questService;

    private Quest quest1;
    private Quest quest2;
    private Quest quest3;

    @BeforeEach
    void setUp() {
        quest1 = new Quest(1, "Find the lost key", true, false, null, true,
                "MONDAY,WEDNESDAY", LocalTime.of(10, 0));
        quest2 = new Quest(2, "Defeat the dragon", false, true, "dragon.jpg", false,
                null, null);
        quest3 = new Quest(3, "Save the princess", true, false, "princess.png", true,
                "FRIDAY,SATURDAY", LocalTime.of(15, 30));
    }

    @AfterEach
    void tearDown() {
        reset(questRepository);
    }

    // Test for getAllQuests with empty result
    @Test
    void testGetAllQuests_ReturnEmptyList() {
        when(questRepository.findAll()).thenReturn(Collections.emptyList());

        List<Quest> result = questService.getAllQuests("asc", false, null);

        assertTrue(result.isEmpty());
        verify(questRepository).findAll();
    }

    // Test for getAllQuests with null filters
    @Test
    void testGetAllQuests_NullFilters() {
        List<Quest> quests = Arrays.asList(quest1, quest2, quest3);
        when(questRepository.findAll()).thenReturn(quests);

        List<Quest> result = questService.getAllQuests(null, true, null);

        assertEquals(3, result.size());
        verify(questRepository).findAll();
    }

    // Test for getAllQuests with null sorting direction (defaults)
    @Test
    void testGetAllQuests_DefaultSortOrder() {
        List<Quest> quests = Arrays.asList(quest3, quest2, quest1); // Random order
        when(questRepository.findAll()).thenReturn(quests);

        List<Quest> result = questService.getAllQuests(null, false, null);

        assertEquals(3, result.size());
        assertEquals(1, result.get(0).getId()); // Ensure ascending sort by ID
        verify(questRepository).findAll();
    }

    // Test for getQuestById when quest exists
    @Test
    void testGetQuestById_Success() throws Exception {
        when(questRepository.findById(1)).thenReturn(Optional.of(quest1));

        Quest result = questService.getQuestById(1);

        assertNotNull(result);
        assertEquals(quest1.getDescription(), result.getDescription());
        verify(questRepository).findById(1);
    }

    // Test for getQuestById when quest does not exist
    @Test
    void testGetQuestById_NotFound() {
        when(questRepository.findById(999)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> questService.getQuestById(999));

        assertEquals("Quest not found!", exception.getMessage());
        verify(questRepository).findById(999);
    }

    // Test for updateQuest with partial updates
    @Test
    void testUpdateQuest_PartialUpdate() throws Exception {
        Quest existingQuest = quest1;

        Quest partialUpdate = new Quest(1, "Find the golden key", false, false, null, false,
                null, null);

        when(questRepository.findById(1)).thenReturn(Optional.of(existingQuest));
        when(questRepository.save(existingQuest)).thenReturn(existingQuest);

        Quest result = questService.updateQuest(1, partialUpdate);

        assertEquals("Find the golden key", result.getDescription()); // Updated
        assertEquals(quest1.isCompleted(), result.isCompleted());     // Unchanged
        verify(questRepository).findById(1);
        verify(questRepository).save(existingQuest);
    }

    // Test for createQuest with null repeatDays
    @Test
    void testCreateQuest_NullRepeatDays() {
        Quest newQuest = new Quest(0, "Conquer the kingdom", true, false, "kingdom.jpg", true,
                null, LocalTime.of(12, 0));

        Quest savedQuest = new Quest(4, "Conquer the kingdom", true, false, "kingdom.jpg", true,
                null, LocalTime.of(12, 0));

        when(questRepository.save(any(Quest.class))).thenReturn(savedQuest);

        Quest result = questService.createQuest(newQuest);

        assertNotNull(result);
        assertNull(result.getRepeatDays()); // Ensure repeatDays remains null
        verify(questRepository).save(newQuest);
    }

    // Test for deleteQuest by invalid ID
    @Test
    void testDeleteQuest_InvalidId() {
        when(questRepository.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> questService.deleteQuest(99));

        assertEquals("Quest not found!", exception.getMessage());
        verify(questRepository).findById(99);
    }

    // Test for getAllQuests with multiple filters
    @Test
    void testGetAllQuests_MultipleFilters() {
        List<Quest> quests = Arrays.asList(quest1, quest3);
        when(questRepository.findAll()).thenReturn(quests);

        List<Quest> result = questService.getAllQuests("asc", true, "princess");

        assertEquals(1, result.size());
        assertEquals("Save the princess", result.get(0).getDescription());
        verify(questRepository).findAll();
    }

    // Test for invalid update where description is null
    @Test
    void testUpdateQuest_InvalidData() {
        Quest invalidUpdate = new Quest(1, null, true, false, null, false, null, null);
        when(questRepository.findById(1)).thenReturn(Optional.of(quest1));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            questService.updateQuest(1, invalidUpdate);
        });

        assertEquals("Quest description cannot be null", exception.getMessage());
        verify(questRepository).findById(1);
    }
}
