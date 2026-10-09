# Homepage film files

Drop the encoded film here and point `src/data/film.ts` at it. The hero switches from the placeholder to the video automatically.

## Files

| File | Use | Target |
|---|---|---|
| `hero-landscape.mp4` | Tablets and desktops | 1920×1080, about 1.5 Mbps, under 10 MB |
| `hero-portrait.mp4` | Phones (optional, falls back to landscape) | 1080×1920, about 1.2 Mbps, under 10 MB |
| `poster-landscape.jpg` | First frame while the video loads, and the reduced-motion still | 1920×1080, under 300 KB |
| `poster-portrait.jpg` | Same, phones | 1080×1920, under 300 KB |

## Encoding

H.264 High profile, yuv420p, `+faststart` so playback starts before the download finishes. From a ProRes master:

```
ffmpeg -i master-16x9.mov -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -b:v 1500k -maxrate 2000k -bufsize 4000k -vf scale=1920:1080 -an -movflags +faststart hero-landscape.mp4

ffmpeg -i master-9x16.mov -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -b:v 1200k -maxrate 1600k -bufsize 3200k -vf scale=1080:1920 -an -movflags +faststart hero-portrait.mp4
```

Keep the audio track (`-c:a aac -b:a 96k` instead of `-an`) if the sound button should work. The site autoplays muted either way.

Posters:

```
ffmpeg -ss 00:00:01 -i hero-landscape.mp4 -frames:v 1 -q:v 3 poster-landscape.jpg
```

## Size

Vercel serves anything in `public/` from its CDN, so files up to ~10 MB are fine here. For a longer or heavier cut, host on Vercel Blob or Mux and put the absolute URL in `film.sources` instead.

## Subtitles

Subtitles are not burnt in. They come from `film.captions` in `src/data/film.ts` and are rendered by the site, so they can be edited without re-encoding. Update the timings to the final edit.
