import { PlusOutlined } from "@ant-design/icons";
import { notification } from "antd";
import React from "react";
import { VideoFormModal } from "./VideoFormModal";
import { VideoGrid } from "./VideoGrid";
import { VideoPage } from "./VideoPage";
import { api } from "./api";

type Video = {
  id: string;
  name: string;
  url: string;
  youtubeVideoId: string | null;
};

const getYouTubeVideoId = (url: string) => {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get("v");
};

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [videos, setVideos] = React.useState<Video[]>();
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [openVideo, setOpenVideo] = React.useState<Video | null>(null);

  React.useEffect(() => {
    const fetchVideos = async () => {
      const response = await api.get("/video");
      const videosWithId = response.data.map((video: Video) => {
        video.youtubeVideoId = getYouTubeVideoId(video.url);
        return video;
      });
      setVideos(videosWithId);
    };
    try {
      fetchVideos();
    } catch (error) {
      console.log(error);
    }
  }, [isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    showModal();
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await api.delete(`/video/${id}`);
      notification.success({
        message: "Video deleted",
        description: "Video has been deleted successfully",
      });
      setVideos((prevVideos) => prevVideos?.filter((video) => video.id !== id));
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleGoBack = () => {
    setOpenVideo(null);
  };

  return (
    <>
      <header className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl my-5 text-center">
          Youtube Video Gallery
        </h1>
      </header>
      <main className="relative px-2 w-full max-w-6xl mx-auto h-full">
        {openVideo ? (
          <VideoPage video={openVideo} handleGoBack={handleGoBack} />
        ) : (
          <VideoGrid
            videos={videos}
            setOpenVideo={setOpenVideo}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        )}
        <div className="fixed bottom-3 right-3">
          <button
            type="button"
            className="p-3 rounded-full w-14 h-14 bg-blue-500 flex justify-center items-center text-white text-2xl"
            onClick={showModal}
          >
            <PlusOutlined aria-hidden />
            <span className="sr-only">Add video</span>
          </button>
        </div>
        <VideoFormModal
          key={selectedVideo?.id}
          isModalOpen={isModalOpen}
          handleClose={handleClose}
          formData={selectedVideo}
        />
      </main>
    </>
  );
}

export default App;
