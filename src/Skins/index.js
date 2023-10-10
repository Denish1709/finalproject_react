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
  Table,
  Space,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import Header from "../Header";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSkins, deleteSkin } from "../api/skin";
import { addToCart, getCartItems } from "../api/cart";

import { useCookies } from "react-cookie";

export default function Skins() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skinName, setSkinName] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [image1, setImage1] = useState("");
  const [currentSkins, setCurrentSkins] = useState([]);
  const { isLoading, data: skins } = useQuery({
    queryKey: ["skins"],
    queryFn: () => fetchSkins(),
  });
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = skins ? [...skins] : [];
    if (skinName !== "") {
      newList = newList.filter((s) => s.skinName === skinName);
    }
    setCurrentSkins(newList);
  }, [skins, skinName]);

  const skinNameOptions = useMemo(() => {
    let options = [];
    if (skins && skins.length > 0) {
      skins.forEach((skin) => {
        if (!options.includes(skin.skinName)) {
          options.push(skin.skinName);
        }
      });
    }
    return options;
  }, [skins]);

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Skin Added to Cart",
        color: "green",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skins"],
      });
      notifications.show({
        title: "Skin Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Container>
        <Header title="Skin" page="skins" text="" />

        <Group position="apart">
          <Title order={3} align="center">
            SKINS
          </Title>
          {isAdmin && (
            <Button component={Link} to="/add_skin" color="green">
              ADD NEW SKIN
            </Button>
          )}
        </Group>
        <Space h="20px" />

        <Grid>
          {currentSkins
            ? currentSkins.map((skin) => {
                return (
                  <Grid.Col key={skin._id} lg={3} md={6} sm={6} xs={6}>
                    <Card shadow="sm" padding="md" radius="md" withBorder>
                      <Card.Section>
                        {skin.image1 && skin.image1 !== "" ? (
                          <>
                            <Image
                              src={"http://localhost:5000/" + skin.image1}
                              width="100%"
                              // height="550px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                            }
                            width="300px"
                            // height="200px"
                          />
                        )}
                      </Card.Section>
                      <Group position="apart" mt="md" mb="xs">
                        <Group position="center">
                          <h5>{skin.skinName}</h5>
                          <Badge color="green">{skin.bundlePrice}</Badge>

                          {isAdmin && (
                            <>
                              <Space h="20px" />
                              <Button
                                color="red"
                                // size="xs"
                                // radius="50px"
                                fullWidth
                                onClick={() => {
                                  deleteMutation.mutate({
                                    id: skin._id,
                                    token: currentUser ? currentUser.token : "",
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                          <Button
                            component={Link}
                            to={"/skins/" + skin._id}
                            color="green"
                            fullWidth
                          >
                            Detail
                          </Button>
                        </Group>

                        <Button
                          fullWidth
                          onClick={() => {
                            // pop a messsage if user is not logged in
                            if (cookies && cookies.currentUser) {
                              addToCartMutation.mutate(skins);
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
                                color: "red",
                              });
                            }
                          }}
                        >
                          Add To Cart
                        </Button>
                      </Group>
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
