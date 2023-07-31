import { Button, Input, Modal, notification } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header>
        <Title>Youtube Video Gallery</Title>
      </header>
      <main>
        <div className="grid grid-cols-3 gap-4">
          {videos?.map((video) => (
            <div key={video.id}>
              <img
                src={`https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`}
                alt=""
              />
              <p>{video.name}</p>
            </div>
          ))}
        </div>
        <Button type="primary" onClick={showModal}>
          Add video
        </Button>
      </main>
      <VideoFormModal isModalOpen={isModalOpen} handleCancel={handleCancel} />
      <footer>Footer</footer>
    </>
  );
}

type FormData = {
  name: string;
  url: string;
};

function VideoFormModal({
  isModalOpen,
  handleCancel,
}: {
  isModalOpen: boolean;
  handleCancel: () => void;
}) {
  const [notificationApi, contextHolder] = notification.useNotification();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await api.post("/video", data);
      notificationApi.success({
        message: "Video added",
        description: "Video has been added successfully",
      });
      reset();
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleCancelClick = () => {
    handleCancel();
    reset();
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancelClick}
      footer={[
        <Button key="back" onClick={handleCancelClick}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          form="video-form"
          loading={isSubmitting}
        >
          Submit
        </Button>,
      ]}
    >
      <div className="p-4">
        {contextHolder}
        <form id="video-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>
              <Title level={2}>Add YouTube video</Title>
            </legend>
          </fieldset>
          <div className="space-y-2">
            <div>
              <label htmlFor="name">Video name:</label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Video name is required", maxLength: 255 }}
                render={({ field }) => (
                  <Input id="name" maxLength={255} {...field} />
                )}
              />
              {errors.name?.message && (
                <p className="text-red-600">{errors.name?.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="url">URL:</label>
              <Controller
                name="url"
                control={control}
                rules={{
                  required: "URL is required",
                  pattern: {
                    value: /youtube\.com\/watch\?v=/,
                    message: "URL must be a valid YouTube video URL",
                  },
                  maxLength: 255,
                }}
                render={({ field }) => (
                  <Input id="url" maxLength={255} {...field} />
                )}
              />
              {errors.url?.message && (
                <p className="text-red-600">{errors.url?.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default App;
