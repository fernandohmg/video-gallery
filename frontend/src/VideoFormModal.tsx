import { Button, Input, Modal, notification } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { api } from "./api";

type FormData = {
  name: string;
  url: string;
};

type Video = {
  id: string;
  name: string;
  url: string;
  youtubeVideoId: string | null;
};

interface VideoFormModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  formData?: Video | null;
}

export const VideoFormModal = ({
  isModalOpen,
  handleClose,
  formData,
}: VideoFormModalProps) => {
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
        handleCloseClick();
        return;
      }
      await api.post("/video", data);
      notificationApi.success({
        message: "Video added",
        description: "Video has been added successfully",
      });
      handleCloseClick();
    } catch (error) {
      notificationApi.error({
        message: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleCloseClick = () => {
    handleClose();
    reset();
  };

  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={handleCloseClick}
      footer={[
        <Button key="back" onClick={handleCloseClick}>
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
};
