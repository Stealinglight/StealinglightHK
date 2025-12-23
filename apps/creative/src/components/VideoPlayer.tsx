interface VideoPlayerProps {
    videoUrl: string;
    posterUrl: string;
    title: string;
}

/**
 * HTML5 Video Player component with poster image and controls
 */
export function VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps) {
    return (
        <div className="video-player">
            <video
                className="video-player-element"
                controls
                preload="none"
                poster={posterUrl}
                title={title}
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
