package com.example.QuestApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column
    private String imageUrl; // Store the path or URL to the image
}
