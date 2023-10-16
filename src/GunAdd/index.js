import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { addGun, addGunImage } from "../api/gun";

function GunAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addGun,
    onSuccess: () => {
      notifications.show({
        title: "New Gun Added",
        color: "green",
      });
      navigate("/guns");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewGun = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        category: category,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: addGunImage,
    onSuccess: (data) => {
      setImage(data.image_url);
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleImageUpload = (files) => {
    uploadMutation.mutate(files[0]);
    setUploading(true);
  };

  return (
    <Container>
      <Space h="50px" />
      <Title
        order={2}
        align="center"
        style={{ fontFamily: "Courier New", fontSize: "30px" }}
      >
        Add New Gun
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the Gun name here"
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          label="Name"
          description="The name of the gun"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        {image && image !== "" ? (
          <>
            <Image src={"http://10.1.104.5:5000/" + image} width="100%" />
            <Button
              color="dark"
              mt="15px"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
              onClick={() => setImage("")}
            >
              Remove Image
            </Button>
          </>
        ) : (
          <Dropzone
            multiple={false}
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              handleImageUpload(files);
            }}
          >
            <Title
              order={4}
              align="center"
              py="20px"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
            >
              Click to upload or Drag image to upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the category at here"
          style={{ fontFamily: "Courier New" }}
          label="Category"
          description="What is the category for this gun"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
        />
        <Space h="20px" />
        <Button
          fullWidth
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          onClick={handleAddNewGun}
        >
          Add New Gun
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/guns"
          variant="subtle"
          size="xs"
          color="gray"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          View Guns
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}

export default GunAdd;
