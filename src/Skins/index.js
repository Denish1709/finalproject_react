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
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSkins, deleteSkin } from "../api/skin";
import { addToCart, getCartItems } from "../api/cart";
import { fetchOrders } from "../api/order";

import { useCookies } from "react-cookie";

export default function Skins() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentSkins, setCurrentSkins] = useState([]);
  const { isLoading, data: skins } = useQuery({
    queryKey: ["skins"],
    queryFn: () => fetchSkins(),
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
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

    if (search) {
      newList = newList.filter(
        (g) => g.skinName.toLowerCase().indexOf(search.toLowerCase()) >= 0
      );
    }

    if (category !== "") {
      newList = newList.filter((s) => s.category === category);
    }
    setCurrentSkins(newList);
  }, [skins, category, search]);

  const categoryOptions = useMemo(() => {
    let options = [];
    if (skins && skins.length > 0) {
      skins.forEach((skin) => {
        if (!options.includes(skin.category)) {
          options.push(skin.category);
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
        <Space h="50px" />
        <Group position="center">
          <Title order={3} align="center" color="#778899">
            <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
              SKINS
            </strong>
          </Title>
        </Group>
        <Space h="30px" />
        <Header title="Skin" page="skins" text="" />
        <Space h="30px" />
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/add_skin"
              color="cyan"
              style={{
                fontFamily: "Courier New",
              }}
            >
              ADD NEW SKIN
            </Button>
          )}
        </Group>
        <Space h="30px" />
        <Group position="apart">
          <Group>
            <div className="col-6">
              <input
                type="text"
                style={{
                  fontFamily: "Courier New",
                  padding: "5px",
                }}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </Group>
          <Group>
            <select
              value={category}
              style={{
                backgroundColor: "#483D8B",
                padding: "5px",
                color: "white",
                fontFamily: "Courier New",
              }}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              <option value="" style={{ fontFamily: "Courier New" }}>
                All Skins
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
        </Group>
        <Space h="50px" />
        <LoadingOverlay visible={isLoading} />
        <Grid>
          {currentSkins
            ? currentSkins.map((skin) => {
                return (
                  <Grid.Col key={skin._id} lg={4} md={3} sm={6} xs={6}>
                    <Card
                      shadow="sm"
                      padding="md"
                      radius="md"
                      style={{
                        backgroundColor: "#708090",
                      }}
                      withBorder
                    >
                      <Card.Section>
                        {skin.image && skin.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.5:5000/" + skin.image}
                              width="100%"
                              height="200px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                            }
                            width="300px"
                          />
                        )}
                      </Card.Section>
                      <Group position="center" mt="md" mb="xs">
                        <strong
                          style={{
                            fontFamily: "Courier New",
                            fontSize: "20px",
                          }}
                        >
                          {skin.skinName}
                        </strong>
                        <Group position="center">
                          <Group>
                            <Badge color="green">RM{skin.price}</Badge>
                          </Group>
                          <Space h="20px" />
                          {isAdmin && (
                            <>
                              <Button
                                color="red"
                                size="md"
                                radius="50px"
                                style={{
                                  fontFamily: "Courier New",
                                  fontSize: "15px",
                                }}
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
                        </Group>

                        <Button
                          style={{
                            fontFamily: "Courier New",
                            fontSize: "15px",
                          }}
                          fullWidth
                          onClick={() => {
                            if (cookies && cookies.currentUser) {
                              addToCartMutation.mutate(skin);
                            } else {
                              notifications.show({
                                title: "Please login to proceed",
                                message: (
                                  <>
                                    <Button
                                      color="blue"
                                      style={{
                                        fontFamily: "Courier New",
                                        fontSize: "15px",
                                      }}
                                      onClick={() => {
                                        navigate("/login");
                                        notifications.clean();
                                      }}
                                    >
                                      Click here to login
                                    </Button>
                                  </>
                                ),
                                color: "blue",
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
        <Space h="100px" />
      </Container>
    </>
  );
}
