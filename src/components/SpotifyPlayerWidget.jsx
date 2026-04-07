import React, { useContext, useState, useEffect } from 'react';
import { SpotifyContext } from '../context/SpotifyContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

export default function SpotifyPlayerWidget() {
  const { 
    token, isReady, currentTrack, isPlaying, 
    login, logout, playTrack, togglePlayPause, 
    volume, setAppVolume, searchTracks, isWidgetOpen, setIsWidgetOpen,
    position, duration, nextTrack, prevTrack, seekPosition
  } = useContext(SpotifyContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const formatTime = (ms) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        const tracks = await searchTracks(searchQuery);
        setResults(tracks);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchTracks]);

  if (!isWidgetOpen) return null;

  return (
    <div className="absolute top-24 right-8 w-80 sm:w-80 md:w-[22rem] rounded-[24px] z-[200] animate-page-enter transform transition-all shadow-[0_25px_70px_rgba(29,185,84,0.2)] group">
      
      {/* Animated Gradient Border Wrap */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1db954]/60 via-purple-500/20 to-black/90 rounded-[24px] p-[1px] -z-10"></div>
      
      {/* Inner Container */}
      <div className="bg-[#0a0510]/80 backdrop-blur-3xl w-full h-full rounded-[23px] flex flex-col relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-[#1db954]/10 blur-[60px] pointer-events-none rounded-t-[23px]"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
          <h3 className="text-white font-extrabold tracking-widest flex items-center gap-2 text-xs uppercase">
            <MusicNoteIcon sx={{ color: '#1db954', fontSize: 18 }} className={isPlaying ? 'animate-bounce' : ''} /> 
            Focus Player
          </h3>
          <button 
            onClick={() => setIsWidgetOpen(false)}
            className="text-gray-400 hover:text-white transition-all hover:rotate-90 hover:scale-110 p-1"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-5 relative z-10">
          {!token ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1db954]/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-[#1db954]/40 shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                 <MusicNoteIcon fontSize="large" sx={{ color: '#1db954' }} />
              </div>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">Elevate your study session. Connect your Premium account to stream full tracks natively.</p>
              <button 
                onClick={login}
                className="w-full py-3.5 bg-[#1db954] hover:bg-[#1ed760] text-black font-extrabold text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_20px_rgba(29,185,84,0.3)] hover:shadow-[0_15px_30px_rgba(29,185,84,0.5)] hover:-translate-y-1 active:translate-y-0"
              >
                Connect Spotify
              </button>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative group/search">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-[#1db954] transition-colors" fontSize="small" />
                <input 
                  type="text"
                  placeholder="Search and queue tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#1db954]/60 focus:bg-white/5 focus:shadow-[0_0_20px_rgba(29,185,84,0.15)] transition-all"
                />
              </div>

              {/* Results */}
              {searchQuery && (
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {isSearching ? (
                    <p className="text-center text-xs text-gray-500 py-4 font-mono animate-pulse">Searching catalog...</p>
                  ) : results.length > 0 ? (
                    results.map((track, idx) => (
                      <div 
                        key={track.id}
                        onClick={() => {
                          const urisArray = results.map(t => t.uri);
                          playTrack(urisArray, idx);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] group/track"
                      >
                        <img src={track.album.images[2]?.url || track.album.images[0]?.url} alt="" className="w-12 h-12 rounded-lg shadow-md group-hover/track:shadow-[#1db954]/40 transition-shadow" />
                        <div className="overflow-hidden">
                          <p className="text-white text-sm font-bold truncate group-hover/track:text-[#1db954] transition-colors">{track.name}</p>
                          <p className="text-gray-400 text-xs truncate">{track.artists.map(a => a.name).join(', ')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-gray-500 py-4">No tracks found.</p>
                  )}
                </div>
              )}

              {/* Current Player Status */}
              {!searchQuery && (
                 <div className="flex flex-col mt-2">
                   {currentTrack ? (
                     <div className="flex flex-col items-center mb-6 relative">
                       {/* Animated Glow behind Album Art */}
                       {isPlaying && (
                         <div className="absolute top-4 w-48 h-48 bg-[#1db954]/25 rounded-full blur-[40px] animate-[pulse_3s_infinite] pointer-events-none"></div>
                       )}
                       <img 
                         src={currentTrack.album.images[0]?.url} 
                         alt="" 
                         className={`w-40 h-40 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.6)] mb-5 border border-white/5 z-10 transition-all duration-700 ${isPlaying ? 'scale-100 hover:scale-105 hover:shadow-[0_20px_50px_rgba(29,185,84,0.3)]' : 'scale-95 grayscale-[30%]'}`} 
                       />
                       <div className="text-center w-full overflow-hidden z-10">
                         <h4 className="text-white text-lg font-extrabold truncate drop-shadow-md">{currentTrack.name}</h4>
                         <p className="text-[#1db954] font-medium text-xs uppercase tracking-widest truncate mt-1">{currentTrack.artists.map(a=>a.name).join(', ')}</p>
                       </div>
                     </div>
                   ) : (
                     <div className="text-center py-10 text-gray-500 text-sm bg-[#1db954]/5 rounded-2xl border border-[#1db954]/20 border-dashed mb-4">
                       {isReady ? 'Search for a track to begin' : <span className="animate-pulse">Connecting to Spotify...</span>}
                     </div>
                   )}

                   {/* Playback Controls Area */}
                   <div className="flex flex-col w-full bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/5 transition-all">
                     {/* Seek Bar */}
                     <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono mb-3">
                       <span className="w-8 text-right">{formatTime(position)}</span>
                       <div className="relative flex-1 h-3 flex items-center cursor-pointer group/slider">
                         <input 
                           type="range" 
                           min="0" max={duration || 100} 
                           value={position}
                           onChange={(e) => seekPosition(parseInt(e.target.value))}
                           className="absolute w-full accent-[#1db954] h-1.5 bg-white/10 rounded-full appearance-none outline-none z-10 hover:h-2 transition-all cursor-pointer"
                         />
                       </div>
                       <span className="w-8 text-left">{formatTime(duration)}</span>
                     </div>

                     {/* Media Buttons */}
                     <div className="flex items-center justify-between mt-1">
                        
                        <div className="flex items-center gap-1.5 w-16">
                          <VolumeUpIcon sx={{ fontSize: 16 }} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
                          <input 
                            type="range" 
                            min="0" max="1" step="0.01"
                            value={volume}
                            onChange={(e) => setAppVolume(parseFloat(e.target.value))}
                            className="w-full accent-[#1db954] h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer hover:h-1.5 transition-all"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <button onClick={prevTrack} className="text-gray-400 hover:text-white hover:scale-125 active:scale-95 transition-all" disabled={!isReady || (!currentTrack && !isPlaying)}>
                            <SkipPreviousIcon fontSize="medium" />
                          </button>
                          <button 
                            onClick={togglePlayPause}
                            disabled={!isReady || (!currentTrack && !isPlaying)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${isReady && (currentTrack || isPlaying) ? 'bg-white text-black hover:bg-[#1db954] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(29,185,84,0.6)]' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                          >
                            {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" className="ml-0.5" />}
                          </button>
                          <button onClick={nextTrack} className="text-gray-400 hover:text-white hover:scale-125 active:scale-95 transition-all" disabled={!isReady || (!currentTrack && !isPlaying)}>
                            <SkipNextIcon fontSize="medium" />
                          </button>
                        </div>
                        
                        <div className="w-16"></div> {/* Spacer to align Play button center */}
                     </div>
                   </div>
                 </div>
              )}
              
              {!searchQuery && <button onClick={logout} className="text-[10px] font-bold text-gray-500 hover:text-red-400 mt-4 text-center transition-colors uppercase tracking-widest w-full opacity-60 hover:opacity-100">Disconnect Account</button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
