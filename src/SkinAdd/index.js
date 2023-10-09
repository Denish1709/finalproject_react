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
  Tabs,
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
  const [name, setName] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");

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
      navigate("/");
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
        name: name,
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5,
      }),
      token: currentUser ? currentUser.token : "",
    });
  };

  const uploadMutation1 = useMutation({
    mutationFn: addSkinImage,
    onSuccess: (data) => {
      setImage1(data.image_url);

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

  const uploadMutation2 = useMutation({
    mutationFn: addSkinImage,
    onSuccess: (data) => {
      setImage2(data.image_url);

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

  const uploadMutation3 = useMutation({
    mutationFn: addSkinImage,
    onSuccess: (data) => {
      setImage3(data.image_url);

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

  const uploadMutation4 = useMutation({
    mutationFn: addSkinImage,
    onSuccess: (data) => {
      setImage1(data.image_url);

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

  const uploadMutation5 = useMutation({
    mutationFn: addSkinImage,
    onSuccess: (data) => {
      setImage5(data.image_url);

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

  const handleImageUpload1 = (files) => {
    uploadMutation1.mutate(files[0]);
    setUploading(true);
  };

  const handleImageUpload2 = (files) => {
    uploadMutation2.mutate(files[0]);
    setUploading(true);
  };

  const handleImageUpload3 = (files) => {
    uploadMutation3.mutate(files[0]);
    setUploading(true);
  };

  const handleImageUpload4 = (files) => {
    uploadMutation4.mutate(files[0]);
    setUploading(true);
  };

  const handleImageUpload5 = (files) => {
    uploadMutation5.mutate(files[0]);
    setUploading(true);
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Agent
      </Title>
      <Space h="50px" />
      <Tabs color="green" variant="outline" defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="mainImg">Main Image</Tabs.Tab>
          <Tabs.Tab value="secImg">Secondary Image</Tabs.Tab>
          <Tabs.Tab value="riffle">Riffle</Tabs.Tab>
          <Tabs.Tab value="shotgun">Shotgun</Tabs.Tab>
          <Tabs.Tab value="smg">SMG</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="mainImg" pt="xs">
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

          {image1 && image1 !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image1} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage1("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload1(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="secImg" pt="xs">
          {image2 && image2 !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image2} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage2("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload2(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}{" "}
        </Tabs.Panel>

        <Tabs.Panel value="riffle" pt="xs">
          {image3 && image3 !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image3} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage3("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload3(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="shotgun" pt="xs">
          {image4 && image4 !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image4} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage4("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload4(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="smg" pt="xs">
          {image5 && image5 !== "" ? (
            <>
              <Image src={"http://localhost:5000/" + image5} width="100%" />
              <Button color="dark" mt="15px" onClick={() => setImage5("")}>
                Remove Image
              </Button>
            </>
          ) : (
            <Dropzone
              mutiple={false}
              accept={IMAGE_MIME_TYPE}
              onDrop={(files) => {
                handleImageUpload5(files);
              }}
            >
              <Title order={4} align="center" py="20px">
                Click To Upload Or Drag Image To Upload
              </Title>
            </Dropzone>
          )}
        </Tabs.Panel>
      </Tabs>
      <Space h="20px" />
      <Button fullWidth onClick={handleAddNewSkin}>
        Add New Skin
      </Button>

      <Space h="50px" />
      <Group position="center">
        <Button
          component={Link}
          to="/skins"
          variant="subtle"
          size="xs"
          color="gray"
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
