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
import { addRank, addRankImage } from "../api/rank";

export default function RankAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

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
      <Title order={2} align="center" style={{ fontFamily: "Courier New" }}>
        Add New Rank
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the rank here"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
          }}
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
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          label="Category"
          description="The category of the rank"
          withAsterisk
          onChange={(event) => setRank(event.target.value)}
        />
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
          onClick={handleAddNewRank}
        >
          Add New Rank
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/ranks"
          variant="subtle"
          size="xs"
          color="gray"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          View Rank
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
