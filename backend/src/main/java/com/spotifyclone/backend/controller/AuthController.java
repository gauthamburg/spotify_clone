package com.spotifyclone.backend.controller;

import com.spotifyclone.backend.model.AppUser;
import com.spotifyclone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. REGISTER (Create a new user)
    @PostMapping("/register")
    public AppUser register(@RequestBody AppUser user) {
        // Default role if none provided
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    // 2. LOGIN (Check if password matches)
    @PostMapping("/login")
    public AppUser login(@RequestBody AppUser loginRequest) {
        AppUser user = userRepository.findByUsername(loginRequest.getUsername());
        
        // Simple password check (In production, use BCrypt!)
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return user; // Return the user details (including role)
        }
        
        throw new RuntimeException("Invalid credentials");
    }
}