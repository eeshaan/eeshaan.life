import useSWR from "swr";
import { useState, useEffect, useRef, Fragment } from "react";
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInSeconds,
} from "date-fns";

const fetcher = (url) => fetch(url).then((r) => r.json());

const SpotifyStatus = () => {
  const {
    data: nowPlaying,
    error: nowPlayingError,
    mutate: mutateNowPlaying,
  } = useSWR("/api/now-playing", fetcher, {
    refreshInterval: 10000,
    shouldRetryOnError: true,
    retryCount: 3,
  });
  const {
    data: recentlyPlayed,
    error: recentError,
    mutate: mutateRecentlyPlayed,
  } = useSWR("/api/recently-played", fetcher, {
    refreshInterval: 60000,
    shouldRetryOnError: true,
    retryCount: 3,
  });
  const [progress, setProgress] = useState(0);
  const [timeAgo, setTimeAgo] = useState("");
  const playedAtRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (nowPlaying) {
      setProgress(Math.min(nowPlaying.progress, nowPlaying.duration));

      if (nowPlaying.isPlaying) {
        const timer = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + 1000;
            if (newProgress >= nowPlaying.duration) {
              clearInterval(timer);
              mutateNowPlaying();
              return nowPlaying.duration;
            }
            return newProgress;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    } else if (!nowPlaying?.isPlaying) {
      mutateRecentlyPlayed();
    }
  }, [nowPlaying, mutateNowPlaying, mutateRecentlyPlayed]);

  useEffect(() => {
    if (recentlyPlayed && !recentlyPlayed.error) {
      playedAtRef.current = parseISO(recentlyPlayed.playedAt);

      const updateTimeAgo = () => {
        const now = new Date();
        const secondsAgo = differenceInSeconds(now, playedAtRef.current);

        if (secondsAgo < 60) {
          setTimeAgo(`${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`);
          timerRef.current = setTimeout(updateTimeAgo, 1000);
        } else {
          setTimeAgo(
            formatDistanceToNowStrict(playedAtRef.current, { addSuffix: true })
          );
          timerRef.current = setTimeout(updateTimeAgo, 60000);
        }
      };

      updateTimeAgo();

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [recentlyPlayed]);

  if (nowPlayingError)
    console.error("Error fetching now playing:", nowPlayingError);
  if (recentError)
    console.error("Error fetching recently played:", recentError);

  if (!nowPlaying || !recentlyPlayed) return <div>Loading...</div>;

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusAndTrack = () => {
    if (nowPlaying.isPlaying || nowPlaying.title) {
      const current = formatTime(Math.min(progress, nowPlaying.duration));
      const total = formatTime(nowPlaying.duration);
      return {
        status: nowPlaying.isPlaying ? "Currently Playing" : "Paused",
        track: nowPlaying,
        progressText: (
          <div className="progress-text">
            <span className="current-progress">{current}</span>
            <span className="progress-separator">/</span>
            <span className="total-duration">{total}</span>
          </div>
        ),
      };
    } else if (recentlyPlayed && !recentlyPlayed.error) {
      return {
        status: "Offline",
        track: recentlyPlayed,
        progressText: <div className="progress-text">Played {timeAgo}</div>,
      };
    } else {
      return {
        status: "Offline",
        track: null,
        progressText: <div className="progress-text">No recent tracks</div>,
      };
    }
  };

  const { status, track, progressText } = getStatusAndTrack();

  return (
    <a
      href={track?.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`spotify-status ${status.toLowerCase().replace(" ", "-")}`}
    >
      <div className="top-bar">
        <a
          href="https://open.spotify.com/user/ch0d.curry"
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-logo"
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span>Spotify</span>
        </a>
        <div className="status-line"></div>
        <div className="status">{status}</div>
      </div>
      <div className="main-content">
        {track && (
          <>
            <a
              href={track.albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="album-art"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={track.albumImageUrl}
                alt={`${track.album} by ${track.albumArtists}`}
              />
            </a>
            <div className="track-info">
              <div className="track-details">
                <h2 className="title">{track.title}</h2>
                <p className="artist">
                  {track.artists.map((artist, index) => (
                    <Fragment key={artist.name}>
                      {index > 0 && ", "}
                      <a
                        href={artist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {artist.name}
                      </a>
                    </Fragment>
                  ))}
                </p>
              </div>
              {progressText}
            </div>
          </>
        )}
      </div>
    </a>
  );
};

export default SpotifyStatus;
