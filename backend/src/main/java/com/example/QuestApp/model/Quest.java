package com.example.QuestApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column
    private String description;

    @Column(nullable = false)
    private boolean important;

    @Column(nullable = false)
    private boolean completed;

    @Column(columnDefinition = "LONGTEXT") // Set the column type to LONGTEXT
    private String imageUrl; // Store the path or URL to the image

    @Column(nullable = false)
    private boolean repeatable; // Whether the quest is repeatable

    @ElementCollection(targetClass = Day.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "quest_repeat_days", joinColumns = @JoinColumn(name = "quest_id"))
    @Column(name = "day")
    private Set<Day> repeatDays = new HashSet<>(); // Days of the week for repeatable quests

    private LocalTime repeatTime; // Time when the quest repeats

    public enum Day {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }
}
