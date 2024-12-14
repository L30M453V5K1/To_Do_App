package com.example.QuestApp.service;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.model.Quest.Day;
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

@ExtendWith(MockitoExtension.class)  // This ensures that Mockito annotations are processed
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
                new HashSet<>(Arrays.asList(Day.MONDAY, Day.WEDNESDAY)), LocalTime.of(10, 0));
        quest2 = new Quest(2, "Defeat the dragon", false, true, "dragon.jpg", false,
                Collections.emptySet(), null);
        quest3 = new Quest(3, "Save the princess", true, false, "princess.png", true,
                new HashSet<>(Arrays.asList(Day.FRIDAY, Day.SATURDAY)), LocalTime.of(15, 30));
    }

    @AfterEach
    void tearDown() {
        // Reset the interactions with the mocked repository after each test
        reset(questRepository);
    }

    // Test for `getAllQuests` with filtering and searching
    @Test
    void testGetAllQuestsWithFilters() {
        // Arrange
        List<Quest> quests = Arrays.asList(quest1, quest2, quest3);
        when(questRepository.findAll()).thenReturn(quests);

        // Act
        List<Quest> result = questService.getAllQuests("asc", true, "princess");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Save the princess", result.get(0).getDescription());
        verify(questRepository).findAll();
    }

    // Test for `getAllQuests` with sorting
    @Test
    void testGetAllQuestsSorted() {
        // Arrange
        List<Quest> quests = Arrays.asList(quest1, quest2, quest3);
        when(questRepository.findAll()).thenReturn(quests);

        // Act
        List<Quest> result = questService.getAllQuests("desc", false, null);

        // Assert
        assertEquals(3, result.size());
        assertEquals(3, result.get(0).getId());  // Ensure sorting is applied
        verify(questRepository).findAll();
    }

    // Test for `updateQuest` when quest exists and is updated
    @Test
    void testUpdateQuest() throws Exception {
        // Arrange
        Quest existingQuest = quest1;
        Quest updatedQuest = new Quest(1, "Find the hidden artifact", true, true, "artifact.jpg", true,
                new HashSet<>(Arrays.asList(Day.TUESDAY, Day.THURSDAY)), LocalTime.of(14, 0));

        when(questRepository.findById(1)).thenReturn(Optional.of(existingQuest));
        when(questRepository.save(existingQuest)).thenReturn(updatedQuest);

        // Act
        Quest result = questService.updateQuest(1, updatedQuest);

        // Assert
        assertEquals("Find the hidden artifact", result.getDescription());
        assertTrue(result.isCompleted());
        assertEquals(LocalTime.of(14, 0), result.getRepeatTime());
        assertEquals(2, result.getRepeatDays().size());
        verify(questRepository).findById(1);
        verify(questRepository).save(existingQuest);
    }

    // Test for `updateQuest` when quest does not exist
    @Test
    void testUpdateQuestNotFound() throws Exception {
        // Arrange
        Quest updatedQuest = new Quest(1, "Find the hidden artifact", true, true, "artifact.jpg", true,
                new HashSet<>(Arrays.asList(Day.TUESDAY, Day.THURSDAY)), LocalTime.of(14, 0));

        when(questRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            questService.updateQuest(1, updatedQuest);
        });

        assertEquals("Quest not found!", exception.getMessage());
        verify(questRepository).findById(1);
    }

    // Test for `deleteQuest` when quest exists and is deleted
    @Test
    void testDeleteQuest() throws Exception {
        // Arrange
        Quest questToDelete = quest1;

        when(questRepository.findById(1)).thenReturn(Optional.of(questToDelete));

        // Act
        questService.deleteQuest(1);

        // Assert
        verify(questRepository).findById(1);
        verify(questRepository).delete(questToDelete);
    }

    // Test for `deleteQuest` when quest does not exist
    @Test
    void testDeleteQuestNotFound() throws Exception {
        // Arrange
        when(questRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            questService.deleteQuest(1);
        });

        assertEquals("Quest not found!", exception.getMessage());
        verify(questRepository).findById(1);
        verify(questRepository, never()).delete(any());
    }

    // Test for `createQuest` with all fields
    @Test
    void testCreateQuest_Success() {
        // Arrange
        Quest newQuest = new Quest(0, "Slay the mighty dragon", true, false, "dragon_slayer.jpg", true,
                new HashSet<>(Arrays.asList(Day.SUNDAY)), LocalTime.of(17, 0));
        Quest savedQuest = new Quest(4, "Slay the mighty dragon", true, false, "dragon_slayer.jpg", true,
                new HashSet<>(Arrays.asList(Day.SUNDAY)), LocalTime.of(17, 0));

        when(questRepository.save(newQuest)).thenReturn(savedQuest);

        // Act
        Quest result = questService.createQuest(newQuest);

        // Assert
        assertNotNull(result);
        assertEquals(savedQuest.getId(), result.getId());
        assertEquals("Slay the mighty dragon", result.getDescription());
        assertEquals(LocalTime.of(17, 0), result.getRepeatTime());
        assertEquals(1, result.getRepeatDays().size());
        verify(questRepository).save(newQuest);
    }

    // Test for `createQuest` with invalid data
    @Test
    void testCreateQuest_Failure_InvalidData() {
        // Arrange
        Quest invalidQuest = new Quest(0, null, true, false, null, true, Collections.emptySet(), null);

        when(questRepository.save(invalidQuest)).thenThrow(new IllegalArgumentException("Quest description cannot be null"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            questService.createQuest(invalidQuest);
        });

        assertEquals("Quest description cannot be null", exception.getMessage());
        verify(questRepository).save(invalidQuest);
    }
}
