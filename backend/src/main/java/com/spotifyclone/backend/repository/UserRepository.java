package com.spotifyclone.backend.repository;

import com.spotifyclone.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    // This helps us find a user by their name during Login
    AppUser findByUsername(String username);
}