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
        quest1 = new Quest(1, "Do something", true, false, null);
        quest2 = new Quest(2, "Do something else", false, true, null);
        quest3 = new Quest(3, "Do a third thing", true, false, null);
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
        List<Quest> result = questService.getAllQuests("asc", true, "dragon");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Do a third thing", result.get(0).getDescription());
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
        Quest updatedQuest = new Quest(1, "Do something, but differently", true, true, "Something.jpg");

        when(questRepository.findById(1)).thenReturn(Optional.of(existingQuest));
        when(questRepository.save(existingQuest)).thenReturn(updatedQuest);

        // Act
        Quest result = questService.updateQuest(1, updatedQuest);

        // Assert
        assertEquals("Do something, but differently", result.getDescription());
        assertTrue(result.isImportant());
        assertTrue(result.isCompleted());
        verify(questRepository).findById(1);
        verify(questRepository).save(existingQuest);
    }

    // Test for `updateQuest` when quest does not exist
    @Test
    void testUpdateQuestNotFound() throws Exception {
        // Arrange
        Quest updatedQuest = new Quest(1, "Do something, but differently", true, true, "SomethingElse.jpg");

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

    @Test
    void testCreateQuest_Success() {
        // Instantiating
        Quest newQuest = new Quest(0, "Do a totally new thing", true, false, "CoolImage.png");
        Quest savedQuest = new Quest(1, "Do a totally new thing", true, false, "Wooow.jpg");  // The saved quest has an ID assigned

        when(questRepository.save(newQuest)).thenReturn(savedQuest);

        // Act
        Quest result = questService.createQuest(newQuest);

        // Assert
        assertNotNull(result);
        assertEquals(savedQuest.getId(), result.getId());
        assertEquals(savedQuest.getDescription(), result.getDescription());
        assertTrue(result.isImportant());
        assertFalse(result.isCompleted());
        verify(questRepository).save(newQuest);
    }

    @Test
    void testCreateQuest_Failure_InvalidData() {
        // Instantiating
        Quest invalidQuest = new Quest(0, null, true, false, null);  // Invalid quest with null description

        when(questRepository.save(invalidQuest)).thenThrow(new IllegalArgumentException("Quest description cannot be null"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            questService.createQuest(invalidQuest);
        });

        assertEquals("Quest description cannot be null", exception.getMessage());
        verify(questRepository).save(invalidQuest);
    }


}
