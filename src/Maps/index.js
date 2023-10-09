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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
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
      <Header title="Map" page="maps" text="" />

      <Group position="apart">
        <Title order={3} align="center">
          Maps
        </Title>
        {isAdmin && (
          <Button component={Link} to="/add_map" color="green">
            Add New
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentMaps
          ? currentMaps.map((map) => {
              return (
                <Grid.Col key={map._id} lg={3} md={6} sm={6} xs={6}>
                  <Card.Section>
                    {map.image && map.image !== "" ? (
                      <>
                        <Image
                          src={"http://localhost:5000/" + map.image}
                          width="250px"
                          height="200px"
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
                  <Group position="apart" mt="md" mb="xs">
                    {/* <Title order={5}>{agent.name}</Title> */}
                    <Badge color="green">{map.name}</Badge>
                    {/* <Badge color="yellow">{map.role}</Badge> */}
                  </Group>
                  {/* <Text size="sm" color="dimmed">
                    {map.description}
                  </Text> */}
                  {/* <Button
                      fullWidth
                      onClick={() => {
                        if (cookies && cookies.currentUser) {
                          addToCartMutation.mutate(agent);
                        } else {
                          notifications.show({
                            title: "Please login to proceed",
                            message: (
                              <>
                                <Button
                                  color="red"
                                  onClick={() => {
                                    navigate("/login");
                                    notifications.clean();
                                  }}
                                >
                                  Click here to login
                                </Button>
                              </>
                            ),
                          });
                        }
                      }}
                    >
                      {" "}
                      Add To Cart
                    </Button> */}
                  {isAdmin && (
                    <>
                      <Space h="20px" />
                      <Group position="apart">
                        <Button
                          component={Link}
                          to={"/maps/" + map._id}
                          color="blue"
                          size="xs"
                          radius="50px"
                        >
                          Edit
                        </Button>
                        <Button
                          color="red"
                          size="xs"
                          radius="50px"
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
                  {/* </Card> */}
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}
