import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
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
import { addMap, addMapImage } from "../api/map";

export default function MapAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: addMap,
    onSuccess: () => {
      notifications.show({
        title: "New Map Added",
        color: "green",
      });
      navigate("/maps");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewMap = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: addMapImage,
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
        Add New Map
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the map name here"
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          label="Name"
          description="The name of the map"
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
            mutiple={false}
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
              Click To Upload Or Drag Image To Upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <Button
          fullWidth
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          onClick={handleAddNewMap}
        >
          Add New Product
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/maps"
          variant="subtle"
          size="xs"
          color="gray"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          View Maps
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
