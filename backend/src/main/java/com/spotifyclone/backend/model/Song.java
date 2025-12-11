package com.spotifyclone.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;
    private String album;
    
    private Integer duration; // Duration in seconds
    private String audioUrl; 
    private String thumbnailUrl;
}