package com.example.QuestApp.controller;

import com.example.QuestApp.model.ApiResponse;
import com.example.QuestApp.model.Quest;
import com.example.QuestApp.service.QuestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestControllerTest {

    @Mock
    private QuestService questService;

    @InjectMocks
    private QuestController questController;

    private Quest quest1;
    private Quest quest2;

    @BeforeEach
    void setUp() {
        quest1 = new Quest(1, "Find the lost key", true, false);
        quest2 = new Quest(2, "Defeat the dragon", false, true);
    }

    // Test for browserMessage()
    @Test
    void testBrowserMessage_ReturnsCorrectApiResponse() {
        // Act
        ApiResponse response = questController.browserMessage();

        // Assert
        assertNotNull(response);
        assertEquals("Congratulations! Your app is working!", response.getMessage());
    }

    // Test for getAllQuests()
    @Test
    void testGetAllQuests_ReturnsListOfQuests() {
        // Arrange
        when(questService.getAllQuests("asc", false, "")).thenReturn(Arrays.asList(quest1, quest2));

        // Act
        List<Quest> result = questController.getAllQuests("asc", false, "");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Find the lost key", result.get(0).getDescription());
        verify(questService, times(1)).getAllQuests("asc", false, "");
    }

    @Test
    void testGetAllQuests_NoQuestsFound() {
        // Arrange
        when(questService.getAllQuests("asc", false, "")).thenReturn(Collections.emptyList());

        // Act
        List<Quest> result = questController.getAllQuests("asc", false, "");

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(questService, times(1)).getAllQuests("asc", false, "");
    }

    // Test for addQuest()
    @Test
    void testAddQuest_SuccessfulCreation() {
        // Arrange
        Quest newQuest = new Quest(3, "Save the princess", false, false);
        when(questService.createQuest(newQuest)).thenReturn(newQuest);

        // Act
        Quest result = questController.addQuest(newQuest);

        // Assert
        assertNotNull(result);
        assertEquals("Save the princess", result.getDescription());
        verify(questService, times(1)).createQuest(newQuest);
    }

    @Test
    void testAddQuest_WithInvalidQuest_DoesNotThrowException() {
        // Arrange
        Quest invalidQuest = new Quest(0, "", false, false);
        when(questService.createQuest(invalidQuest)).thenReturn(invalidQuest);

        // Act
        Quest result = questController.addQuest(invalidQuest);

        // Assert
        assertNotNull(result); // Ensure the result is not null
        assertEquals(invalidQuest, result); // Ensure the result matches the input
        verify(questService).createQuest(invalidQuest); // Verify the service is called
    }

}
