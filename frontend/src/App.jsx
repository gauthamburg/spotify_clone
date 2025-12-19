import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [songs, setSongs] = useState([])
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playingSongId, setPlayingSongId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // State for the "Add Song" Modal
  const [showModal, setShowModal] = useState(false)
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: 0,
    thumbnailUrl: '',
    audioUrl: ''
  })

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = () => {
    axios.get('http://localhost:8080/songs')
      .then(response => setSongs(response.data))
      .catch(error => console.error("Error:", error))
  }

  const handlePlayPause = (song) => {
    if (playingSongId === song.id) {
      // Toggle Play/Pause for current song
      if (isPlaying) {
        currentAudio.pause()
        setIsPlaying(false)
      } else {
        currentAudio.play()
        setIsPlaying(true)
      }
      return
    }

    // New Song selected
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    const audio = new Audio(song.audioUrl)
    audio.play()
    setCurrentAudio(audio)
    setPlayingSongId(song.id)
    setIsPlaying(true)
    
    // Auto-reset when song ends
    audio.onended = () => setIsPlaying(false)
  }

  const handleSaveSong = () => {
    axios.post('http://localhost:8080/songs', newSong)
      .then(response => {
        console.log("Saved:", response.data)
        setShowModal(false) // Close modal
        fetchSongs() // Refresh list
        setNewSong({ title: '', artist: '', album: '', duration: 0, thumbnailUrl: '', audioUrl: '' }) // Reset form
      })
      .catch(error => console.error("Error saving song:", error))
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">🟢 Spotify Clone</div>
        <div className="nav-item active">🏠 Home</div>
        <div className="nav-item">🔍 Search</div>
        <div className="nav-item">📚 Your Library</div>
        <div className="nav-item" style={{marginTop: 'auto'}}>➕ Create Playlist</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h2>Good afternoon</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Song</button>
        </div>

        <div className="song-grid">
          {songs.map(song => (
            <div key={song.id} className="song-card" onClick={() => handlePlayPause(song)}>
              <img src={song.thumbnailUrl} alt={song.title} className="song-image" />
              <div className="play-icon-overlay">
                {playingSongId === song.id && isPlaying ? '⏸' : '▶'}
              </div>
              <h4>{song.title}</h4>
              <p style={{color: '#b3b3b3', fontSize: '14px', margin: '4px 0'}}>{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player Bar */}
      <div className="player-bar">
        <div className="now-playing">
          {playingSongId && (
            <>
              <img 
                src={songs.find(s => s.id === playingSongId)?.thumbnailUrl} 
                style={{width: '56px', borderRadius: '4px'}} 
              />
              <div>
                <div style={{fontWeight: 'bold'}}>{songs.find(s => s.id === playingSongId)?.title}</div>
                <div style={{fontSize: '12px', color: '#b3b3b3'}}>{songs.find(s => s.id === playingSongId)?.artist}</div>
              </div>
            </>
          )}
        </div>
        <div className="controls">
          <button className="play-btn-large" onClick={() => currentAudio && handlePlayPause({id: playingSongId})}>
             {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
        <div style={{width: '30%'}}></div>
      </div>

      {/* Add Song Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add a New Song</h3>
            <input placeholder="Song Title" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
            <input placeholder="Artist" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
            <input placeholder="Album" value={newSong.album} onChange={e => setNewSong({...newSong, album: e.target.value})} />
            <input placeholder="Image URL (e.g. https://...)" value={newSong.thumbnailUrl} onChange={e => setNewSong({...newSong, thumbnailUrl: e.target.value})} />
            <input placeholder="Audio URL (e.g. https://...mp3)" value={newSong.audioUrl} onChange={e => setNewSong({...newSong, audioUrl: e.target.value})} />
            
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} style={{background: 'transparent', border: 'none', color: 'white', cursor: 'pointer'}}>Cancel</button>
              <button onClick={handleSaveSong} className="add-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App