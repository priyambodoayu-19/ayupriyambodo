"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize2, Film } from "lucide-react";
import { VideoData } from "@/data/projects";

interface VideoPlayerProps {
  video: VideoData;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getEmbedUrl = (url: string): { type: "vimeo" | "youtube" | "direct"; embedUrl?: string } => {
    if (!url) return { type: "direct" };

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return {
        type: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=0&color=FAF9F5&title=0&byline=0&portrait=0`,
      };
    }

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      };
    }

    return { type: "direct" };
  };

  const { type, embedUrl } = getEmbedUrl(video.url);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Viewport */}
      <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden bg-[#0D0C0B] border border-[#2D2B27] shadow-xl group">
        {type === "vimeo" || type === "youtube" ? (
          <iframe
            src={embedUrl}
            title={video.caption || "Commercial Launch Video"}
            allow="autoplay; fullscreen; picture-in-picture"
            className="w-full h-full border-0"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={video.url}
              poster={video.poster}
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handlePlayToggle}
            />

            {/* Ambient Play Overlay (before start or when paused) */}
            {!isPlaying && (
              <div
                onClick={handlePlayToggle}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
              >
                <div className="w-20 h-20 rounded-full bg-[#FAF9F5]/90 text-[#141413] flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
                  <Play className="w-8 h-8 ml-1 fill-[#141413]" />
                </div>
                <span className="mt-4 text-xs font-mono uppercase tracking-widest text-[#FAF9F5] drop-shadow-md">
                  Watch Commercial Launch Film
                </span>
              </div>
            )}

            {/* Custom On-Screen Player Controls Bar */}
            {hasStarted && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayToggle}
                    className="p-2 text-[#FAF9F5] hover:text-amber-400 transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={handleMuteToggle}
                    className="p-2 text-[#FAF9F5] hover:text-amber-400 transition-colors cursor-pointer"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#D6D3D1] uppercase tracking-wider hidden sm:inline">
                    Director&apos;s Cut · 1080p
                  </span>
                  <button
                    onClick={handleFullscreen}
                    className="p-2 text-[#FAF9F5] hover:text-amber-400 transition-colors cursor-pointer"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Caption & Metadata */}
      {video.caption && (
        <div className="flex items-center justify-between text-xs font-mono text-[#8A8881] pt-1 px-1">
          <div className="flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-[#141413]" />
            <span className="text-[#5A5852]">{video.caption}</span>
          </div>
          <span className="uppercase tracking-wider hidden sm:inline">2.39:1 Cinema Master</span>
        </div>
      )}
    </div>
  );
}
