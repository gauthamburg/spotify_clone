import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // --- AUTH STATE ---
  const [user, setUser] = useState(null) // Stores logged-in user info
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // --- MUSIC APP STATE ---
  const [songs, setSongs] = useState([])
  const [currentAudio, setCurrentAudio] = useState(null)
  const [playingSongId, setPlayingSongId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const [showModal, setShowModal] = useState(false)
  const [newSong, setNewSong] = useState({
    title: '', artist: '', album: '', duration: 0, thumbnailUrl: '', audioUrl: ''
  })

  useEffect(() => {
    if (user) {
      fetchSongs()
    }
  }, [user]) // Only fetch songs AFTER login

  const handleLogin = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8080/auth/login', { username, password })
      .then(response => {
        console.log("Logged in!", response.data)
        setUser(response.data) // Save user info (including role)
        setAuthError('')
      })
      .catch(error => {
        console.error("Login failed", error)
        setAuthError('Invalid username or password!')
      })
  }

  const handleLogout = () => {
    setUser(null)
    if (currentAudio) {
      currentAudio.pause() // Stop music on logout
    }
    setPlayingSongId(null)
    setIsPlaying(false)
  }

  // ... (Keep existing fetchSongs, handlePlayPause, handleSaveSong logic) ...
  const fetchSongs = () => {
    axios.get('http://localhost:8080/songs')
      .then(response => setSongs(response.data))
      .catch(error => console.error("Error:", error))
  }

  const handlePlayPause = (song) => {
    if (playingSongId === song.id) {
      if (isPlaying) {
        currentAudio.pause(); setIsPlaying(false)
      } else {
        currentAudio.play(); setIsPlaying(true)
      }
      return
    }
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0 }
    const audio = new Audio(song.audioUrl)
    audio.play()
    setCurrentAudio(audio)
    setPlayingSongId(song.id)
    setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
  }

  const handleSaveSong = () => {
    axios.post('http://localhost:8080/songs', newSong)
      .then(response => {
        setShowModal(false); fetchSongs()
        setNewSong({ title: '', artist: '', album: '', duration: 0, thumbnailUrl: '', audioUrl: '' })
      })
      .catch(error => console.error("Error saving song:", error))
  }

  // --- RENDER: LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="login-container" style={{
        height: '100vh', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', color: 'white'
      }}>
        <h1 style={{fontSize: '3rem', marginBottom: '40px'}}>🟢 Spotify Clone</h1>
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '300px'}}>
          <input 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{padding: '12px', borderRadius: '30px', border: 'none'}}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{padding: '12px', borderRadius: '30px', border: 'none'}}
          />
          <button type="submit" style={{
            padding: '12px', borderRadius: '30px', border: 'none', 
            backgroundColor: '#1db954', color: 'white', fontWeight: 'bold', cursor: 'pointer'
          }}>
            LOG IN
          </button>
          {authError && <p style={{color: 'red', textAlign: 'center'}}>{authError}</p>}
        </form>
      </div>
    )
  }

  // --- RENDER: MAIN APP ---
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">🟢 Spotify Clone</div>
        <div className="nav-item active">🏠 Home</div>
        <div className="nav-item">🔍 Search</div>
        <div className="nav-item">📚 Your Library</div>
        
        <div style={{marginTop: 'auto', padding: '10px', fontSize: '0.9rem', color: 'gray'}}>
          Logged in as: <strong style={{color: 'white'}}>{user.username}</strong>
          <br />
          Role: <span style={{color: '#1db954'}}>{user.role}</span>
        </div>
        <button onClick={handleLogout} style={{
          marginTop: '10px', background: 'transparent', border: '1px solid gray', 
          color: 'white', padding: '8px', borderRadius: '20px', cursor: 'pointer'
        }}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h2>Good afternoon</h2>
          
          {/* ONLY SHOW 'ADD SONG' IF USER IS ADMIN OR ARTIST */}
          {(user.role === 'ADMIN' || user.role === 'ARTIST') && (
            <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Song</button>
          )}
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

      {/* Add Song Modal - Only accessible if button is clicked */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add a New Song</h3>
            <input placeholder="Song Title" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
            <input placeholder="Artist" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} />
            <input placeholder="Album" value={newSong.album} onChange={e => setNewSong({...newSong, album: e.target.value})} />
            <input placeholder="Image URL" value={newSong.thumbnailUrl} onChange={e => setNewSong({...newSong, thumbnailUrl: e.target.value})} />
            <input placeholder="Audio URL" value={newSong.audioUrl} onChange={e => setNewSong({...newSong, audioUrl: e.target.value})} />
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