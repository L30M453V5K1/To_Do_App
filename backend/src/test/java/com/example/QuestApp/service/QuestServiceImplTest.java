package com.example.QuestApp;

import com.example.QuestApp.model.Quest;
import com.example.QuestApp.repository.QuestRepository;
import com.example.QuestApp.service.QuestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
        quest1 = new Quest(1, "Find the lost key", true, false);
        quest2 = new Quest(2, "Save the princess", false, true);
        quest3 = new Quest(3, "Defeat the dragon", true, false);
    }

    // Test for `getAllQuests` with filtering and searching
    @Test
    void testGetAllQuestsWithFilters() {
        // Arrange
        List<Quest> quests = Arrays.asList(quest1, quest2, quest3);
        when(questRepository.findAll()).thenReturn(quests);

        // Act
        List<Quest> result = questService.getAllQuests("asc", true, "dragon");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Defeat the dragon", result.get(0).getDescription());
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
        Quest existingQuest = new Quest(1, "Find the lost key", false, false);
        Quest updatedQuest = new Quest(1, "Find the golden key", true, true);

        when(questRepository.findById(1)).thenReturn(Optional.of(existingQuest));
        when(questRepository.save(existingQuest)).thenReturn(updatedQuest);

        // Act
        Quest result = questService.updateQuest(1, updatedQuest);

        // Assert
        assertEquals("Find the golden key", result.getDescription());
        assertTrue(result.isImportant());
        assertTrue(result.isCompleted());
        verify(questRepository).findById(1);
        verify(questRepository).save(existingQuest);
    }

    // Test for `updateQuest` when quest does not exist
    @Test
    void testUpdateQuestNotFound() throws Exception {
        // Arrange
        Quest updatedQuest = new Quest(1, "Find the golden key", true, true);

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
        Quest questToDelete = new Quest(1, "Find the lost key", false, false);

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
}
