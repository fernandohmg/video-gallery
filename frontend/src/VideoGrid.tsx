import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

type Video = {
  id: string;
  name: string;
  url: string;
  youtubeVideoId: string | null;
};

interface VideoGridProps {
  videos: Video[] | undefined;
  handleEdit: (video: Video) => void;
  handleDelete: (id: string) => void;
  setOpenVideo: (video: Video) => void;
}

export const VideoGrid = ({
  videos,
  setOpenVideo,
  handleDelete,
  handleEdit,
}: VideoGridProps) => {
  if (videos?.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>
          Your list is empty.
          <br />
          Click on the add blue button below.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
        {videos?.map((video) => (
          <div key={video.id} className="max-w-[480px] flex flex-col">
            <button type="button" onClick={() => setOpenVideo(video)}>
              <img
                src={`https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`}
                alt={video.name}
              />
            </button>
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
    </>
  );
};
