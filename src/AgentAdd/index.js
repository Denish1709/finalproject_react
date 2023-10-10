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
import { addAgent, addAgentImage } from "../api/agent";

export default function AgentAdd() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basicAbilities, setBasicAbilities] = useState("");
  const [signatureAbilities, setSignatureAbilities] = useState("");
  const [ultimateAbilities, setUltimateAbilities] = useState("");
  const [role, setRole] = useState("");
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
    mutationFn: addAgent,
    onSuccess: () => {
      notifications.show({
        title: "New Agent Added",
        color: "green",
      });
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewAgent = async (event) => {
    event.preventDefault();
    createMutation.mutate({
      data: JSON.stringify({
        name: name,
        description: description,
        basicAbilities: basicAbilities,
        signatureAbilities: signatureAbilities,
        ultimateAbilities: ultimateAbilities,
        role: role,
        image: image,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation = useMutation({
    mutationFn: addAgentImage,
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
          placeholder="Enter the agent name here"
          label="Name"
          description="The name of the agent"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={description}
          placeholder="Enter the description here"
          label="Description"
          description="The description for the product"
          withAsterisk
          onChange={(event) => setDescription(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={basicAbilities}
          placeholder="Enter the basic abilities here"
          label="Basic Abilities"
          description="The description for the product"
          withAsterisk
          onChange={(event) => setBasicAbilities(event.target.value)}
        />

        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={signatureAbilities}
          placeholder="Enter the signature abilities here"
          label="Signature Abilities"
          description="The description for the product"
          withAsterisk
          onChange={(event) => setSignatureAbilities(event.target.value)}
        />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={ultimateAbilities}
          placeholder="Enter the ultimate abilities here"
          label="Ultimate Abilities"
          description="The description for the product"
          withAsterisk
          onChange={(event) => setUltimateAbilities(event.target.value)}
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
        <Divider />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={role}
          placeholder="Enter the role at here"
          label="Role"
          description="What is the role for this"
          withAsterisk
          onChange={(event) => setRole(event.target.value)}
        />

        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewAgent}>
          Add New
        </Button>
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
