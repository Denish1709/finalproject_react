import {
  PasswordInput,
  TextInput,
  Group,
  Container,
  Space,
  Title,
  Button,
  Card,
} from "@mantine/core";
import Header from "../Header";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { Link } from "react-router-dom";

import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useCookies } from "react-cookie";

export default function Login() {
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const loginMutation = useMutation({
    mutationFn: loginUser,
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
    if (!email || !password) {
      notifications.show({
        title: "Please fill in both email and password.",
        color: "red",
      });
    } else {
      loginMutation.mutate(
        JSON.stringify({
          email: email,
          password: password,
        })
      );
    }
  };

  return (
    <Container>
      <Space h="50px" />
      <Group position="center">
        <Title order={3} align="center" color="#778899">
          <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
            LOGIN
          </strong>
        </Title>
      </Group>
      <Space h="50px" />
      <Header title="Login" page="login" text="" />
      <Space h="60px" />
      <Card
        withBorder
        shadow="lg"
        mx="auto"
        sx={{
          maxWidth: "500px",
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
        <TextInput
          value={email}
          placeholder="Email"
          color="red"
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          label="Email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Space h="20px" />
        <PasswordInput
          value={password}
          placeholder="Password"
          style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          label="Password"
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <Space h="20px" />
        <Group position="center">
          <Button
            fullWidth
            style={{ fontFamily: "Courier New", fontWeight: "bold" }}
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Link
            to="/signup"
            style={{ fontFamily: "Courier New", fontWeight: "bold" }}
          >
            CREATE ACCOUNT?
          </Link>
        </Group>
      </Card>
      <Space h="100px" />
    </Container>
  );
}
