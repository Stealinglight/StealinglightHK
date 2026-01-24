import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useRef, useState } from 'react';

interface ReelProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  subtitle?: string;
}

export function Reel({
  videoSrc,
  posterSrc,
  title = 'Showreel',
  subtitle = 'A selection of recent work',
}: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Placeholder for when no video is provided
  const placeholderPoster =
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80';

  return (
    <section
      id="reel"
      className="relative py-24 md:py-32 bg-cinematic-black"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-white mb-4">{title}</h2>
          <p className="text-white/60 text-lg">{subtitle}</p>
        </motion.div>

        {/* Video player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-video bg-cinematic-dark rounded-lg overflow-hidden group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              poster={posterSrc || placeholderPoster}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Placeholder state when no video
            <div className="relative w-full h-full">
              <img
                src={posterSrc || placeholderPoster}
                alt="Video placeholder"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-cinematic-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-white/50 ml-1" />
                  </div>
                  <p className="text-white/50">Video coming soon</p>
                </div>
              </div>
            </div>
          )}

          {/* Play button overlay (when paused) */}
          {videoSrc && !isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-cinematic-black/40 transition-colors hover:bg-cinematic-black/50"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full bg-cinematic-amber flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-cinematic-black ml-1" />
              </motion.div>
            </motion.button>
          )}

          {/* Controls */}
          {videoSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showControls ? 1 : 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cinematic-black/80 to-transparent p-4 pt-12"
            >
              {/* Progress bar */}
              <div
                onClick={handleProgressClick}
                className="h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress"
              >
                <div
                  className="h-full bg-cinematic-amber rounded-full relative transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cinematic-amber rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleFullscreen}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
