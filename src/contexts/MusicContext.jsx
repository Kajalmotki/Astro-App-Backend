import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const tracks = [
    { id: 'om', name: 'Om Mantra', icon: '🕉️', src: '/audio/om-namah-shivay.mp3' },
    { id: 'cosmic', name: 'Cosmic 432Hz', icon: '✨', src: '/om-432hz.mp3' },
    { id: 'rain', name: 'Gentle Rain', icon: '🌧️', src: '/audio/rain.mp3' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', src: '/audio/ocean.mp3' },
    { id: 'bowl', name: 'Singing Bowl', icon: '🔔', src: '/audio/tibetan-bowl.mp3' },
    { id: 'forest', name: 'Forest Birds', icon: '🐦', src: '/audio/forest.mp3' },
    { id: 'night', name: 'Night Crickets', icon: '🦗', src: '/audio/night.mp3' },
    { id: 'flute', name: 'Deep Flute', icon: '🎍', src: '/audio/flute.mp3' }
];

export const MusicProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(tracks[0]);
    const audioRef = useRef(null);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio(currentTrack.src);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle Track Change
    useEffect(() => {
        if (!audioRef.current) return;

        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current.src = currentTrack.src;

        if (wasPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentTrack]);

    // Cleanup on unmount (only if provider unmounts, usually App root)
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [])

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const playTrack = (track) => {
        setCurrentTrack(track);
        if (!isPlaying) {
            setIsPlaying(true);
            // Small delay to let effect update src
            setTimeout(() => {
                if (audioRef.current) audioRef.current.play().catch(e => console.error(e));
            }, 50);
        }
    };

    return (
        <MusicContext.Provider value={{ isPlaying, currentTrack, togglePlay, playTrack, tracks }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);
