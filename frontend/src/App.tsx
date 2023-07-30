import { Button, Form, Input, Modal } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
        <Button type="primary" onClick={showModal}>
          Add video
        </Button>
      </main>
      <VideoFormModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
      />
      <footer>Footer</footer>
    </>
  );
}

function VideoFormModal({
  isModalOpen,
  handleOk,
  handleCancel,
}: {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}) {
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          form="video-form"
          // onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      <div className="p-4">
        <Form
          id="video-form"
          name="basic"
          labelCol={{ span: 3 }}
          style={{ maxWidth: "100%" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <fieldset>
            <legend>
              <Title level={2}>Add YouTube video</Title>
            </legend>
          </fieldset>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: "URL is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default App;
