import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [songs, setSongs] = useState([])

  // This runs AUTOMATICALLY when the page loads
  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = () => {
    // Talk to your Java Backend
    axios.get('http://localhost:8080/songs')
      .then(response => {
        console.log("Data received:", response.data)
        setSongs(response.data) // Save the songs to our variable
      })
      .catch(error => {
        console.error("Error fetching songs:", error)
      })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1>🎵 My Spotify Clone</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {songs.map(song => (
          <div key={song.id} style={{ backgroundColor: '#181818', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            {/* Display Album Art */}
            <img 
              src={song.thumbnailUrl} 
              alt={song.title} 
              style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} 
            />
            
            {/* Song Details */}
            <h3 style={{ margin: '5px 0' }}>{song.title}</h3>
            <p style={{ color: '#b3b3b3', margin: 0 }}>{song.artist}</p>
            
            {/* Play Button (Fake for now, real later) */}
            <button style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              backgroundColor: '#1db954', 
              border: 'none', 
              borderRadius: '20px', 
              color: 'white', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App