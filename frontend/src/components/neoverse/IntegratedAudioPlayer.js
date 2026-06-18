/* IntegratedAudioPlayer — radio-faceplate / tape-label aesthetic.
 *
 * Refactored into small focused components:
 *   PlayerHeader        — tape label + track index
 *   PlayerIdle          — friendly in-world idle state
 *   PlayerTransport     — prev / play-pause / next + title row
 *   PlayerSeekBar       — seek slider
 *   PlayerVolumeRow     — volume slider + decorative frequency readout
 *
 * The main component owns audio state and wires the parts together.
 */
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

function PlayerHeader({ albumTitle, current, total }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <span className="rounded-md bg-[rgba(231,224,214,0.05)] px-2.5 py-1 font-mono tracking-archival text-[10px] text-[rgba(231,224,214,0.7)]">
        tape label — {albumTitle || "untitled session"}
      </span>
      <span className="font-mono text-[10px] text-[rgba(199,194,184,0.5)]">
        {total > 0 ? `${current} / ${total}` : "00 / 00"}
      </span>
    </div>
  );
}

function PlayerIdle() {
  return (
    <div className="py-6">
      <p className="font-serif text-xl text-[rgba(231,224,214,0.85)] leading-snug">
        No transmission loaded for this room yet.
      </p>
      <p className="mt-2 text-[rgba(231,224,214,0.6)] text-sm leading-relaxed">
        Streaming links below carry the songs to other rooms. The tape will arrive when the road is ready.
      </p>
    </div>
  );
}

function PlayerTransport({ current, playing, position, duration, onPrev, onNext, onToggle, canPrev, canNext }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onPrev}
        data-testid={PLAYER.prev}
        aria-label="Previous track"
        className="text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)] disabled:opacity-30"
        disabled={!canPrev}
      >
        <SkipBack size={18} />
      </button>
      <button
        type="button"
        onClick={onToggle}
        data-testid={playing ? PLAYER.pause : PLAYER.play}
        aria-label={playing ? "Pause" : "Play"}
        className="h-11 w-11 rounded-full border border-[rgba(199,168,106,0.55)] bg-[rgba(199,168,106,0.08)] hover:bg-[rgba(199,168,106,0.18)] flex items-center justify-center text-[rgba(199,168,106,0.95)] transition-colors"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
      </button>
      <button
        type="button"
        onClick={onNext}
        data-testid={PLAYER.next}
        aria-label="Next track"
        className="text-[rgba(199,194,184,0.7)] hover:text-[rgba(231,224,214,0.95)] disabled:opacity-30"
        disabled={!canNext}
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
  );
}

function PlayerSeekBar({ position, duration, onSeek }) {
  return (
    <div className="mt-4">
      <Slider
        data-testid={PLAYER.seek}
        value={[duration ? (position / duration) * 100 : 0]}
        onValueChange={([v]) => onSeek(v)}
        max={100}
        step={0.5}
        className="[&_[role=slider]]:bg-[rgba(199,168,106,0.95)] [&_[role=slider]]:border-[rgba(199,168,106,0.95)]"
      />
    </div>
  );
}

function PlayerVolumeRow({ volume, setVolume, frequency }) {
  return (
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
        frequency — {frequency.toFixed(1)} fm
      </span>
    </div>
  );
}

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
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    setPosition(0);
    setPlaying(false);
  }, [idx]);

  const toggle = async () => {
    if (!audioRef.current || !current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const onSeek = (pct) => {
    if (audioRef.current && duration) {
      const next = (pct / 100) * duration;
      audioRef.current.currentTime = next;
      setPosition(next);
    }
  };

  return (
    <div
      data-testid={PLAYER.root}
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-[rgba(20,22,27,0.85)] p-5 sm:p-6"
    >
      <PlayerHeader
        albumTitle={albumTitle}
        current={idx + 1}
        total={playable.length}
      />
      {!current ? (
        <PlayerIdle />
      ) : (
        <>
          <PlayerTransport
            current={current}
            playing={playing}
            position={position}
            duration={duration}
            onPrev={() => idx > 0 && setIdx(idx - 1)}
            onNext={() => idx < playable.length - 1 && setIdx(idx + 1)}
            onToggle={toggle}
            canPrev={idx > 0}
            canNext={idx < playable.length - 1}
          />
          <PlayerSeekBar position={position} duration={duration} onSeek={onSeek} />
          <PlayerVolumeRow volume={volume} setVolume={setVolume} frequency={98 + idx * 0.7} />
          <audio
            ref={audioRef}
            src={current.audio_url}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onTimeUpdate={() => setPosition(audioRef.current?.currentTime || 0)}
            onEnded={() => {
              if (idx < playable.length - 1) setIdx(idx + 1);
              else setPlaying(false);
            }}
            preload="metadata"
          />
        </>
      )}
    </div>
  );
};

export default IntegratedAudioPlayer;
