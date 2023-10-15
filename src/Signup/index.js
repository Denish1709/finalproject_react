import {
  Container,
  Space,
  TextInput,
  Card,
  Title,
  Button,
  Group,
  Grid,
  PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Signup() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [visible, { toggle }] = useDisclosure(false);

  const signMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      setCookie("currentUser", user, {
        maxAge: 60 * 60 * 24 * 14,
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

  const handleSubmit = () => {
    if (!name || !email || !password || !confirmPassword) {
      notifications.show({
        title: "Please fill in all fields",
        color: "red",
      });
    } else if (password !== confirmPassword) {
      notifications.show({
        title: "Password and Confirm Password not match",
        color: "red",
      });
    } else {
      signMutation.mutate(
        JSON.stringify({
          name: name,
          email: email,
          password: password,
        })
      );
    }
  };
  return (
    <Container>
      <Space h="20px" />
      <Group position="center">
        <Title order={3} align="center" color="#778899">
          <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
            Sign Up
          </strong>
        </Title>
      </Group>
      <Space h="50px" />
      <Header title="Sign Up A New Account" page="signup" />
      <Space h="50px" />
      <Card
        withBorder
        shadow="lg"
        p="20px"
        mx="auto"
        sx={{
          maxWidth: "700px",
        }}
      >
        <Group position="center">
          <img
            src="https://www.riotgames.com/darkroom/800/c27d8bd8fbaca635086a6b839ad202ee:03777eeb4b8eca2df704b5694c5ef770/002-rg-2021-full-lockup-offwhite-1.jpg"
            width="250px"
            height="150px"
          />
        </Group>
        <Space h="30px" />
        <Grid gutter={20}>
          <Grid.Col span={6}>
            <TextInput
              value={name}
              placeholder="Name"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
              label="Name"
              required
              onChange={(event) => setName(event.target.value)}
            />
            <Space h="20px" />
            <TextInput
              value={email}
              placeholder="Email"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
              label="Email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <PasswordInput
              value={password}
              placeholder="Password"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
              label="Password"
              visible={visible}
              onVisibilityChange={toggle}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <Space h="20px" />
            <PasswordInput
              value={confirmPassword}
              placeholder="Confirm Password"
              style={{ fontFamily: "Courier New", fontWeight: "bold" }}
              label="Confirm Password"
              visible={visible}
              onVisibilityChange={toggle}
              required
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Grid.Col>
        </Grid>
        <Space h="40px" />
        <Group position="center">
          <Button
            fullWidth
            style={{ fontFamily: "Courier New", fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Group>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button
          component={Link}
          to="/"
          variant="subtle"
          size="xs"
          color="gray"
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
