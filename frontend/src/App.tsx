import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Popconfirm, notification } from "antd";
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
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);

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

  return (
    <>
      <header className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl my-5 text-center">
          Youtube Video Gallery
        </h1>
      </header>
      <main className="relative px-2 max-w-6xl mx-auto h-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
          {videos?.map((video) => (
            <div key={video.id}>
              <img
                src={`https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`}
                alt={video.name}
              />
              <div className="flex items-start p-2">
                <p className="flex-1">{video.name}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    className="w-6 h-6 flex justify-center items-center text-lg hover:scale-125 duration-300"
                    onClick={() => handleEdit(video)}
                  >
                    <EditOutlined aria-hidden />
                    <span className="sr-only">Edit</span>
                  </button>
                  <Popconfirm
                    title="Delete the video"
                    description="Are you sure to delete this video?"
                    onConfirm={() => handleDelete(video.id)}
                    okText="Delete"
                    cancelText="Cancel"
                  >
                    <button className="w-6 h-6 flex justify-center items-center text-lg hover:text-red-500 hover:scale-125 duration-300">
                      <DeleteOutlined aria-hidden />
                      <span className="sr-only">Delete</span>
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      </main>
      <VideoFormModal
        key={selectedVideo?.id}
        isModalOpen={isModalOpen}
        handleClose={handleClose}
        formData={selectedVideo}
      />
    </>
  );
}

type FormData = {
  name: string;
  url: string;
};

function VideoFormModal({
  isModalOpen,
  handleClose,
  formData,
}: {
  isModalOpen: boolean;
  handleClose: () => void;
  formData?: Video | null;
}) {
  const [notificationApi, contextHolder] = notification.useNotification();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: formData?.name || "",
      url: formData?.url || "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (formData?.id) {
        await api.patch(`/video/${formData.id}`, data);
        notificationApi.success({
          message: "Video updated",
          description: "Video has been updated successfully",
        });
        handleClose();
        return;
      }
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
    handleClose();
    reset();
  };

  return (
    <Modal
      centered
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
          Save
        </Button>,
      ]}
    >
      <div className="p-4">
        {contextHolder}
        <form id="video-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>
              <h2 className="text-lg mb-3">Add YouTube video</h2>
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
