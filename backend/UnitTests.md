Test Description:
I write unit tests for QuestServiceImpl, focusing on its core methods: getAllQuests, updateQuest, and deleteQuest. The tests cover both positive and negative scenarios to check correctness, error handling, and functionality under various conditions.

1. getAllQuests with filters and search:
    * Verifies quest filtering by importance and searching by description.
    * Ensures the list is correctly sorted and filtered.
2. updateQuest:
    * Confirms quest updates work correctly when the quest exists.
    * Verifies error handling for non-existing quests.
3. deleteQuest:
    * Checks that quests are deleted if they exist.
    * Tests error handling when quests are not found.
      
Annotations used: @Mock and @InjectMocks to mock the repository and inject it into the service.

Test Success:
* All tests passed.
* getAllQuests confirmed proper filtering, searching, and sorting.
* updateQuest revealed missing error handling for non-existing quests, which was fixed by adding proper exception handling (orElseThrow).
* deleteQuest passed, ensuring the quest is deleted when found and handled errors correctly.

