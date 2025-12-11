package com.spotifyclone.backend.repository;

import com.spotifyclone.backend.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    // This gives us save(), findAll(), delete() automatically!
}