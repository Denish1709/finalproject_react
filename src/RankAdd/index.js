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
import { addRank, addRankImage } from "../api/rank";

export default function RankAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const createMutation = useMutation({
    mutationFn: addRank,
    onSuccess: () => {
      notifications.show({
        title: "New Rank Added",
        color: "green",
      });
      navigate("/ranks");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewRank = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        rank: rank,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: addRankImage,
    onSuccess: (data) => {
      setImage(data.image_url);
      // setUploading(false);
    },
    onError: (error) => {
      // setUploading(false);
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
      <Title order={2} align="center">
        Add New Agent
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the rank here"
          label="Rank"
          description="The rank"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={rank}
          placeholder="Enter the rank category here"
          label="Category"
          description="The category of the rank"
          withAsterisk
          onChange={(event) => setRank(event.target.value)}
        />
        <Space h="20px" />
        {image && image !== "" ? (
          <>
            <Image src={"http://localhost:5000/" + image} width="100%" />
            <Button color="dark" mt="15px" onClick={() => setImage("")}>
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
            <Title order={4} align="center" py="20px">
              Click To Upload Or Drag Image To Upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        {isAdmin ? (
          <Button fullWidth onClick={handleAddNewRank}>
            Add New
          </Button>
        ) : null}
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
