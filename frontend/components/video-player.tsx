export const VideoPlayer = ({ youtubeId, title }: { youtubeId: string; title: string }) => (
  <div className="glass-panel overflow-hidden rounded-4xl">
    <div className="aspect-video w-full">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

