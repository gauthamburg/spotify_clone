package com.spotifyclone.backend.controller;

import com.spotifyclone.backend.model.Song;
import com.spotifyclone.backend.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs") // All endpoints start with /songs
public class SongController {

    @Autowired
    private SongRepository songRepository;

    // 1. Get all songs
    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // 2. Add a new song
    @PostMapping
    public Song addSong(@RequestBody Song song) {
        return songRepository.save(song);
    }
    
    // 3. Test endpoint
    @GetMapping("/test")
    public String test() {
        return "Spotify Clone API is up and running!";
    }
}