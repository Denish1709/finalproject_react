import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Title,
  Image,
  Text,
  Container,
  Badge,
  Button,
  Group,
  Space,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import Header from "../Header";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGuns, deleteGun } from "../api/gun";
import { useCookies } from "react-cookie";

export default function Guns() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [currentGuns, setCurrentGuns] = useState([]);
  const { isLoading, data: guns } = useQuery({
    queryKey: ["guns"],
    queryFn: () => fetchGuns(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = guns ? [...guns] : [];
    if (category !== "") {
      newList = newList.filter((g) => g.category === category);
    }
    setCurrentGuns(newList);
  }, [guns, category]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (guns && guns.length > 0) {
      guns.forEach((gun) => {
        if (!options.includes(gun.category)) {
          options.push(gun.category);
        }
      });
    }
    return options;
  }, [guns]);

  const deleteMutation = useMutation({
    mutationFn: deleteGun,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guns"],
      });
      notifications.show({
        title: "Gun Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Container>
        <Header title="Guns" page="guns" text="" />
        <Space h="20px" />

        <Group position="apart">
          <Title order={3} align="center">
            <strong>GUNS</strong>
          </Title>
          {isAdmin && (
            <Button component={Link} to="/add_gun" color="green">
              <strong>ADD NEW GUN</strong>
            </Button>
          )}
        </Group>
        <Space h="20px" />
        <Group>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              // setCurrentPage(1);
            }}
          >
            <option value="">All Category</option>
            {categoryOptions.map((category) => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </Group>
        <Space h="20px" />
        <LoadingOverlay visible={isLoading} />
        <Grid>
          {currentGuns
            ? currentGuns.map((gun) => {
                return (
                  <Grid.Col key={gun.id} lg={4} md={6} sm={6} xs={6}>
                    <Card shadow="sm" padding="md" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src={"http://localhost:5000/" + gun.image}
                          width="100%"
                        />
                      </Card.Section>
                      <Group position="center" mt="md" mb="xs">
                        <strong>
                          <h3>
                            <strong>{gun.name}</strong>
                          </h3>
                        </strong>
                      </Group>
                      <Space h="20px" />
                      {isAdmin && (
                        <>
                          <Space h="20px" />
                          <Group position="apart">
                            <Group>
                              <Badge color="yellow">{gun.category}</Badge>
                            </Group>
                            <Button
                              color="red"
                              size="xs"
                              radius="50px"
                              onClick={() => {
                                deleteMutation.mutate({
                                  id: gun._id,
                                  token: currentUser ? currentUser.token : "",
                                });
                              }}
                            >
                              Delete
                            </Button>
                          </Group>
                        </>
                      )}
                    </Card>
                  </Grid.Col>
                );
              })
            : null}
        </Grid>
      </Container>
    </>
  );
}
