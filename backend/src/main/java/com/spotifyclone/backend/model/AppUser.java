package com.spotifyclone.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "app_users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true) // No two users can have the same username
    private String username;
    
    private String password; // In a real app, we would hash this!
    
    private String role; // "ADMIN", "ARTIST", "USER"
}