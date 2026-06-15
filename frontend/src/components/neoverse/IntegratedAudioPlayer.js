
import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { PLAYER } from "@/constants/testIds";

const fmt = (sec) => {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * IntegratedAudioPlayer — styled as a radio faceplate / tape label, not a generic widget.
 * Accepts tracks: [{ title, audio_url, duration? }]
 * If no playable audio_urls present, shows an in-world idle state with streaming links nearby (handled by parent).
 */
export const IntegratedAudioPlayer = ({ tracks = [], albumTitle }) => {
  const playable = (tracks || []).filter((t) => t.audio_url);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  const current = playable[idx];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    setPosition(0);
    setPlaying(false);
  }, [idx]);

  const onLoaded = () => setDuration(audioRef.current?.duration || 0);
  const onTime = () => setPosition(audioRef.current?.currentTime || 0);
  const onEnded = () => {
    if (idx < playable.length - 1) setIdx(idx + 1);
    else setPlaying(false);
  };

  const toggle = async () => {
    if (!audioRef.current || !current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch (e) {
        setPlaying(false);
      }
    }
  };

  return (
    <div
      data-testid={PLAYER.root}
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-[rgba(20,22,27,0.85)] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="rounded-md bg-[rgba(231,224,214,0.05)] px-2.5 py-1 font-mono tracking-archival text-[10px] text-[rgba(231,224,214,0.7)]">
          tape label — {albumTitle || "untitled session"}
        </span>
        <span className="font-mono text-[10px] text-[rgba(199,194,184,0.5)]">
          {playable.length > 0 ? `${idx + 1} / ${playable.length}` : "00 / 00"}
        </span>
      </div>

      {!current ? (
        <div className="py-6">
          <p className="font-serif text-xl text-[rgba(231,224,214,0.85)] leading-snug">
            No transmission loaded for this room yet.
          </p>
          <p className="mt-2 text-[rgba(231,224,214,0.6)] text-sm leading-relaxed">
            Streaming links below carry the songs to other rooms. The tape will arrive when the road is ready.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => idx > 0 && setIdx(idx - 1)}
              data-testid={PLAYER.prev}
              aria-label="Previous track"
              className="text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)] disabled:opacity-30"
              disabled={idx === 0}
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={toggle}
              data-testid={playing ? PLAYER.pause : PLAYER.play}
              aria-label={playing ? "Pause" : "Play"}
              className="h-11 w-11 rounded-full border border-[rgba(199,168,106,0.55)] bg-[rgba(199,168,106,0.08)] hover:bg-[rgba(199,168,106,0.18)] flex items-center justify-center text-[rgba(199,168,106,0.95)] transition-colors"
            >
              {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
            </button>
            <button
              type="button"
              onClick={() => idx < playable.length - 1 && setIdx(idx + 1)}
              data-testid={PLAYER.next}
              aria-label="Next track"
              className="text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)] disabled:opacity-30"
              disabled={idx >= playable.length - 1}
            >
              <SkipForward size={18} />
            </button>

            <div className="flex-1 min-w-0 ml-2">
              <p
                data-testid={PLAYER.track_title}
                className="font-serif text-lg sm:text-xl text-[rgba(231,224,214,0.95)] truncate"
              >
                {current.title}
              </p>
              <p className="font-mono text-[10px] text-[rgba(199,194,184,0.55)] tracking-archival">
                {fmt(position)} / {fmt(duration)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Slider
              data-testid={PLAYER.seek}
              value={[duration ? (position / duration) * 100 : 0]}
              onValueChange={([v]) => {
                if (audioRef.current && duration) {
                  audioRef.current.currentTime = (v / 100) * duration;
                  setPosition(audioRef.current.currentTime);
                }
              }}
              max={100}
              step={0.5}
              className="[&_[role=slider]]:bg-[rgba(199,168,106,0.95)] [&_[role=slider]]:border-[rgba(199,168,106,0.95)]"
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[rgba(199,194,184,0.55)]">
            <Volume2 size={14} />
            <Slider
              value={[volume * 100]}
              onValueChange={([v]) => setVolume(v / 100)}
              max={100}
              step={1}
              className="w-32"
            />
            <span className="ml-auto font-mono text-[10px] text-[rgba(199,194,184,0.45)] tracking-archival">
              frequency — {(98 + idx * 0.7).toFixed(1)} fm
            </span>
          </div>

          <audio
            ref={audioRef}
            src={current.audio_url}
            onLoadedMetadata={onLoaded}
            onTimeUpdate={onTime}
            onEnded={onEnded}
            preload="metadata"
          />
        </>
      )}
    </div>
  );
};

export default IntegratedAudioPlayer;
