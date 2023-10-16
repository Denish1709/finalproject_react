import { useState, useMemo } from "react";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Textarea,
  NumberInput,
  Divider,
  Button,
  Group,
  Image,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getAgent, updateAgent, uploadAgentImage } from "../api/agent";

function AgentsEdit() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basicAbilities, setBasicAbilities] = useState("");
  const [signatureAbilities, setSignatureAbilities] = useState("");
  const [ultimateAbilities, setUltimateAbilities] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => getAgent(id),
    onSuccess: (data) => {
      setName(data.name);
      setDescription(data.description);
      setBasicAbilities(data.basicAbilities);
      setSignatureAbilities(data.signatureAbilities);
      setUltimateAbilities(data.ultimateAbilities);
      setRole(data.role);
      setImage(data.image);
    },
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const updateMutation = useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      notifications.show({
        title: "Agent Edited",
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

  const handleUpdateAgent = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
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
    mutationFn: uploadAgentImage,
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
      <Title order={2} align="center">
        Edit Agent
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
        {image && image !== "" ? (
          <>
            <Image src={"http://10.1.104.5:5000/" + image} width="100%" />
            <Button color="dark" mt="15px" onClick={() => setImage("")}>
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
            <Title order={4} align="center" py="20px">
              Click to upload or Drag image to upload
            </Title>
          </Dropzone>
        )}
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <Textarea
          value={description}
          placeholder="Enter the product description here"
          label="description"
          description="The description of the product"
          withAsterisk
          minRows={5}
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
        <Divider />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={role}
          placeholder="Enter the category at here"
          label="Category"
          description="What is the category for this"
          withAsterisk
          onChange={(event) => setRole(event.target.value)}
        />
        <Space h="20px" />
        {isAdmin ? (
          <Button fullWidth onClick={handleUpdateAgent}>
            Edit Agent
          </Button>
        ) : null}
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}

export default AgentsEdit;
