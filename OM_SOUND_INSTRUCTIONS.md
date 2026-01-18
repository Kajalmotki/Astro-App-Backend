# Om Sound File Instructions

## Required Audio File

Please place your 432 Hz Om sound file in the `public` folder with the name:
**`om-432hz.mp3`**

### File Requirements:
- **Frequency**: 432 Hz (healing frequency)
- **Format**: MP3 (recommended) or WAV
- **Duration**: 1-3 minutes (will loop automatically)
- **Quality**: High quality, clear Om chant

### File Location:
```
d:\astro app\public\om-432hz.mp3
```

The OmPlayer component will automatically load and play this file when users click the sacred Om button in the header.

## Alternative Formats Supported:
If you prefer a different format, update the audio source in:
`src/components/OmPlayer.jsx` line 13

Change from:
```javascript
audioRef.current = new Audio('/om-432hz.mp3');
```

To your preferred format:
```javascript
audioRef.current = new Audio('/om-432hz.wav');
// or
audioRef.current = new Audio('/om-432hz.ogg');
```
