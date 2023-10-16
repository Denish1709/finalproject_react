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
import { addSkin, addSkinImage } from "../api/skin";

export default function AgentAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [skinName, setSkinName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const createMutation = useMutation({
    mutationFn: addSkin,
    onSuccess: () => {
      notifications.show({
        title: "New Skin Added",
        color: "green",
      });
      navigate("/skins");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewSkin = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        skinName: skinName,
        image: image,
        price: price,
        category: category,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: addSkinImage,
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
        Add New Skin
      </Title>
      <Space h="30px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={skinName}
          placeholder="Enter the bundle name here"
          style={{ fontFamily: "Courier New" }}
          label="Name"
          description="The name of the bundle"
          withAsterisk
          onChange={(event) => setSkinName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={price}
          placeholder="Enter the skin price here"
          style={{ fontFamily: "Courier New" }}
          label="Skin Price"
          precision={2}
          description="The skin price"
          withAsterisk
          onChange={setPrice}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={category}
          placeholder="Enter the category here"
          style={{ fontFamily: "Courier New" }}
          label="Category"
          description="The category for the skin"
          withAsterisk
          onChange={(event) => setCategory(event.target.value)}
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
              style={{ fontFamily: "Courier New" }}
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
              style={{ fontFamily: "Courier New" }}
            >
              Click To Upload Or Drag Image To Upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />

        <Group position="center">
          {isAdmin ? (
            <Button
              fullWidth
              style={{ fontFamily: "Courier New" }}
              onClick={handleAddNewSkin}
            >
              Add New Skin
            </Button>
          ) : null}
        </Group>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button
          component={Link}
          to="/skins"
          variant="subtle"
          size="xs"
          color="gray"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          View Skins
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
