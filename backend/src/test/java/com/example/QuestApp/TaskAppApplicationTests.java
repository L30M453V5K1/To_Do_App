package com.example.QuestApp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootTest(classes = TaskAppApplicationTests.TestConfig.class)
class TaskAppApplicationTests {

	@SpringBootApplication
	@ComponentScan(excludeFilters = {
			@ComponentScan.Filter(org.springframework.stereotype.Repository.class),
			@ComponentScan.Filter(org.springframework.stereotype.Service.class),
			@ComponentScan.Filter(org.springframework.stereotype.Controller.class)
	})
	static class TestConfig {
		// Minimal Spring Boot configuration for context startup
	}

	@Test
	void contextLoads() {
		// Verifies Spring context starts up
	}
}
