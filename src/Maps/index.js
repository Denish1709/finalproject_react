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
import { fetchMaps, deleteMap } from "../api/map";
import { useCookies } from "react-cookie";

export default function Maps() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [currentMaps, setCurrentMaps] = useState([]);

  const { isLoading, data: maps } = useQuery({
    queryKey: ["maps"],
    queryFn: () => fetchMaps(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = maps ? [...maps] : [];
    if (name !== "") {
      newList = newList.filter((m) => m.name === name);
    }
    setCurrentMaps(newList);
  }, [maps, name]);

  const nameOptions = useMemo(() => {
    let options = [];
    if (maps && maps.length > 0) {
      maps.forEach((map) => {
        if (!options.includes(map.role)) {
          options.push(map.role);
        }
      });
    }
    return options;
  }, [maps]);

  const deleteMutation = useMutation({
    mutationFn: deleteMap,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maps"],
      });
      notifications.show({
        title: "Map Deleted",
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
              MAPS
            </strong>
          </Title>
        </Group>
        <Space h="30px" />
        <Header title="Map" page="maps" text="" />
        <Space h="30px" />
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/add_map"
              color="green"
              style={{ fontFamily: "Courier New" }}
            >
              Add New Map
            </Button>
          )}
        </Group>
        <Space h="50px" />
        <LoadingOverlay visible={isLoading} />
        <Grid>
          {currentMaps
            ? currentMaps.map((map) => {
                return (
                  <Grid.Col key={map._id} lg={4} md={4} sm={6} xs={6}>
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
                        {map.image && map.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.5:5000/" + map.image}
                              width="100%"
                              height="160px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                            }
                            width="250px"
                            height="200px"
                          />
                        )}
                      </Card.Section>
                      <Space h="20px" />

                      <Group position="center" mt="md" mb="xs">
                        <Badge
                          color="green"
                          fullWidth
                          style={{
                            fontFamily: "Courier New",
                            fontSize: "15px",
                            padding: "15px",
                          }}
                        >
                          {map.name}
                        </Badge>
                      </Group>

                      {isAdmin && (
                        <>
                          <Space h="20px" />
                          <Group position="center">
                            <Button
                              color="red"
                              size="xs"
                              radius="50px"
                              style={{
                                fontFamily: "Courier New",
                                fontSize: "10px",
                              }}
                              fullWidth
                              onClick={() => {
                                deleteMutation.mutate({
                                  id: map._id,
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
