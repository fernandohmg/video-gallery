import { Button } from "antd";

type Video = {
  id: string;
  name: string;
  url: string;
  youtubeVideoId: string | null;
};

interface VideoPageProps {
  video: Video;
  handleGoBack: () => void;
}

export const VideoPage = ({ video, handleGoBack }: VideoPageProps) => {
  const { name, youtubeVideoId } = video;
  return (
    <section className="w-full h-full">
      <Button type="primary" size="large" onClick={handleGoBack}>
        Go back
      </Button>
      <iframe
        className="mt-4 aspect-video w-full"
        title={name}
        id="ytplayer"
        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
      />
      <h2 className="text-xl mt-2">{name}</h2>
    </section>
  );
};
