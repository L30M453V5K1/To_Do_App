package com.example.QuestApp.controller;

import com.example.QuestApp.model.ApiResponse;
import com.example.QuestApp.model.Quest;
import com.example.QuestApp.service.QuestService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        Set<Quest.Day> repeatDays1 = new HashSet<>(Arrays.asList(Quest.Day.MONDAY, Quest.Day.WEDNESDAY));
        quest1 = new Quest(1, "Find the lost key", true, false, "image1.jpg", true, repeatDays1, LocalTime.of(10, 0));

        Set<Quest.Day> repeatDays2 = new HashSet<>();
        quest2 = new Quest(2, "Defeat the dragon", false, true, "image2.jpg", false, repeatDays2, null);
    }

    @AfterEach
    void tearDown() {
        reset(questService); // Reset mocks after each test
    }

    // Test for browserMessage()
    @Test
    void testBrowserMessage_ReturnsCorrectApiResponse() {
        ApiResponse response = questController.browserMessage();
        assertNotNull(response);
        assertEquals("Congratulations! Your app is working!", response.getMessage());
    }

    // Test for getAllQuests()
    @Test
    void testGetAllQuests_ReturnsListOfQuests() {
        when(questService.getAllQuests("asc", false, ""))
                .thenReturn(Arrays.asList(quest1, quest2));
        List<Quest> result = questController.getAllQuests("asc", false, "");

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Find the lost key", result.get(0).getDescription());
        assertTrue(result.get(0).isRepeatable());
        assertEquals(LocalTime.of(10, 0), result.get(0).getRepeatTime());
        assertTrue(result.get(0).getRepeatDays().contains(Quest.Day.MONDAY));
        verify(questService, times(1)).getAllQuests("asc", false, "");
    }

    @Test
    void testGetAllQuests_NoQuestsFound() {
        when(questService.getAllQuests("asc", false, ""))
                .thenReturn(Collections.emptyList());
        List<Quest> result = questController.getAllQuests("asc", false, "");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(questService, times(1)).getAllQuests("asc", false, "");
    }

    // Test for addQuest()
    @Test
    void testAddQuest_SuccessfulCreation() {
        Set<Quest.Day> repeatDays = new HashSet<>(Arrays.asList(Quest.Day.TUESDAY, Quest.Day.THURSDAY));
        Quest newQuest = new Quest(3, "Save the princess", false, false, "image3.jpg", true, repeatDays, LocalTime.of(8, 30));
        when(questService.createQuest(newQuest)).thenReturn(newQuest);

        Quest result = questController.addQuest(newQuest);

        assertNotNull(result);
        assertEquals("Save the princess", result.getDescription());
        assertTrue(result.isRepeatable());
        assertEquals(LocalTime.of(8, 30), result.getRepeatTime());
        assertTrue(result.getRepeatDays().contains(Quest.Day.TUESDAY));
        verify(questService, times(1)).createQuest(newQuest);
    }

    @Test
    void testAddQuest_WithInvalidQuest_DoesNotThrowException() {
        Quest invalidQuest = new Quest(0, "", false, false, "", false, new HashSet<>(), null);
        when(questService.createQuest(invalidQuest)).thenReturn(invalidQuest);

        Quest result = questController.addQuest(invalidQuest);

        assertNotNull(result);
        assertFalse(result.isRepeatable());
        assertNull(result.getRepeatTime());
        verify(questService).createQuest(invalidQuest);
    }

    // Test for updateQuest()
    @Test
    public void testUpdateQuest_Success() throws Exception {
        int questId = 1;
        Set<Quest.Day> updatedRepeatDays = new HashSet<>(Arrays.asList(Quest.Day.FRIDAY));
        Quest updatedQuest = new Quest(questId, "Some new description", true, true, "newImage.jpg", true, updatedRepeatDays, LocalTime.of(12, 15));
        when(questService.updateQuest(eq(questId), any(Quest.class))).thenReturn(updatedQuest);

        Quest result = questController.updateQuest(questId, updatedQuest);

        assertNotNull(result);
        assertTrue(result.isRepeatable());
        assertEquals(LocalTime.of(12, 15), result.getRepeatTime());
        assertTrue(result.getRepeatDays().contains(Quest.Day.FRIDAY));
        verify(questService, times(1)).updateQuest(questId, updatedQuest);
    }

    @Test
    public void testUpdateQuest_QuestNotFound() throws Exception {
        int questId = 1;
        Quest updatedQuest = new Quest(questId, "Updated Quest Description", true, false, "image1.jpg", false, new HashSet<>(), null);

        when(questService.updateQuest(eq(questId), any(Quest.class)))
                .thenThrow(new Exception("Quest not found"));

        Exception exception = assertThrows(Exception.class, () -> {
            questController.updateQuest(questId, updatedQuest);
        });

        assertEquals("Quest not found", exception.getMessage());
        verify(questService, times(1)).updateQuest(questId, updatedQuest);
    }

    // Test for deleteQuest()
    @Test
    public void testDeleteQuest_Success() throws Exception {
        int questId = 1;
        doNothing().when(questService).deleteQuest(questId);

        ApiResponse response = questController.deleteQuest(questId);

        assertNotNull(response);
        assertEquals("Successfully deleted quest with id: " + questId, response.getMessage());
        verify(questService, times(1)).deleteQuest(questId);
    }

    @Test
    public void testDeleteQuest_QuestNotFound() throws Exception {
        int questId = 1;
        doThrow(new Exception("Quest not found")).when(questService).deleteQuest(questId);

        Exception exception = assertThrows(Exception.class, () -> {
            questController.deleteQuest(questId);
        });

        assertEquals("Quest not found", exception.getMessage());
        verify(questService, times(1)).deleteQuest(questId);
    }
}
