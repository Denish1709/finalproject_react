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
          options.push(gun.role);
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
      <Header title="Guns" page="guns" text="" />
      <Group position="apart">
        <Title order={3} align="center">
          Guns
        </Title>
        {isAdmin && (
          <Button component={Link} to="/add_gun" color="green">
            Add New Gun
          </Button>
        )}
        {/* <Button component={Link} to="/skin" color="green">
          Skin
        </Button> */}
      </Group>
      <Space h="40px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentGuns
          ? currentGuns.map((gun) => {
              return (
                <Grid.Col key={gun.id} lg={4} md={6} sm={6} xs={6}>
                  <Card.Section>
                    {gun.image && gun.image !== "" ? (
                      <>
                        <Image
                          src={"http://localhost:5000/" + gun.image}
                          width="250px"
                          height="100px"
                        />
                      </>
                    ) : (
                      <Image
                        src={
                          "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                        }
                        width="250px"
                        height="100px"
                      />
                    )}
                  </Card.Section>
                  <Group position="apart" mt="md" mb="xs">
                    {/* <Title order={5}>{agent.name}</Title> */}
                    <Badge color="green" align="center">
                      {gun.name}
                    </Badge>
                    {/* <Badge color="yellow">{gun.role}</Badge> */}
                  </Group>
                  <Text size="sm" color="dimmed">
                    {gun.description}
                  </Text>
                  <Space h="20px" />
                  {isAdmin && (
                    <>
                      <Space h="20px" />
                      <Group position="apart">
                        <Button
                          component={Link}
                          to={"/guns/" + gun._id}
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
                  {/* </Card> */}
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}
