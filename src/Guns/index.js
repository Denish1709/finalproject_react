import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Title,
  Image,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGuns, deleteGun } from "../api/gun";
import { useCookies } from "react-cookie";

export default function Guns() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
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
        <Space h="50px" />
        <Group position="center">
          <Title order={3} align="center" color="#778899">
            <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
              GUNS
            </strong>
          </Title>
        </Group>
        <Space h="30px" />
        <Header title="Guns" page="guns" text="" />
        <Space h="30px" />
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/add_gun"
              color="blue"
              style={{ fontFamily: "Courier New" }}
            >
              ADD NEW GUN
            </Button>
          )}
        </Group>
        <Space h="30px" />
        <Group>
          <select
            value={category}
            style={{
              backgroundColor: "#483D8B",
              color: "white",
              fontFamily: "Courier New",
            }}
            onChange={(event) => {
              setCategory(event.target.value);
            }}
          >
            <option value="" style={{ fontFamily: "Courier New" }}>
              All Category
            </option>
            {categoryOptions.map((category) => {
              return (
                <option
                  key={category}
                  value={category}
                  style={{ fontFamily: "Courier New" }}
                >
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
                    <Card
                      shadow="sm"
                      padding="md"
                      radius="md"
                      style={{
                        backgroundColor: "#708090",
                        width: "300px",
                        height: "300px",
                      }}
                      withBorder
                    >
                      <Card.Section>
                        <Image
                          src={"http://10.1.104.5:5000/" + gun.image}
                          width="100%"
                          height="150px"
                        />
                      </Card.Section>
                      <Space h="30px" />

                      <Group position="center" mt="md" mb="xs">
                        <Badge
                          color="blue"
                          fullWidth
                          style={{
                            fontFamily: "Courier New",
                            fontSize: "20px",
                            padding: "15px",
                          }}
                        >
                          {gun.name}
                        </Badge>
                      </Group>
                      <Space h="20px" />
                      {isAdmin && (
                        <>
                          <Group position="apart">
                            <Group>
                              <Badge
                                color="yellow"
                                style={{
                                  fontFamily: "Courier New",
                                  fontSize: "15px",
                                }}
                              >
                                {gun.category}
                              </Badge>
                            </Group>
                            <Button
                              color="red"
                              size="xs"
                              radius="50px"
                              style={{
                                fontFamily: "Courier New",
                                fontSize: "10px",
                              }}
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
        <Space h="100px" />
      </Container>
    </>
  );
}
