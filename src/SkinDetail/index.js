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
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSkin, deleteSkin } from "../api/skin";
import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";

export default function SkinDetail() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skinName, setSkinName] = useState("");
  const [gunPrice, setGunPrice] = useState("");
  const [meleePrice, setMeleePrice] = useState("");
  const [gunName2, setGunName2] = useState("");
  const [gunName3, setGunName3] = useState("");
  const [gunName4, setGunName4] = useState("");
  const [gunName5, setGunName5] = useState("");

  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");

  const [currentSkins, setCurrentSkins] = useState([]);
  const { isLoading, data: skins } = useQuery({
    queryKey: ["skins", id],
    queryFn: () => getSkin(id),
    onSuccess: (data) => {
      // console.log(data);
      setSkinName(data.skinName);
      setGunPrice(data.gunPrice);
      setMeleePrice(data.meleePrice);
      setGunName2(data.gunName2);
      setGunName3(data.gunName3);
      setGunName4(data.gunName4);
      setGunName5(data.gunName5);
      setImage2(data.image2);
      setImage3(data.image3);
      setImage4(data.image4);
      setImage5(data.image5);
    },
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

  //   useEffect(() => {
  //     let newList = skins ? [...skins] : [];
  //     if (skinName !== "") {
  //       newList = newList.filter((s) => s.skinName === skinName);
  //     }
  //     setCurrentSkins(newList);
  //   }, [skins, skinName]);

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

  const deleteMutation = useMutation({
    mutationFn: deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skins", id],
      });
      notifications.show({
        title: "Skin Deleted",
        color: "green",
      });
    },
  });

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

  return (
    <>
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
      <LoadingOverlay visible={isLoading} />
      <Grid>
        <Grid.Col lg={3} md={6} sm={6} xs={6}>
          <Card.Section>
            <>
              <Image
                src={"http://localhost:5000/" + image2}
                width="100%"
                //   height="550px"
              />
            </>
          </Card.Section>
          <Group position="apart" mt="md" mb="xs">
            <Badge color="green">
              <h5>{gunName2}</h5>
            </Badge>
            <Badge color="green">${skins.gunPrice}</Badge>
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

          <Space h="30px" />
        </Grid.Col>
        <Grid.Col lg={3} md={6} sm={6} xs={6}>
          <Card.Section>
            <>
              <Image
                src={"http://localhost:5000/" + image3}
                width="100%"
                //   height="550px"
              />
            </>
          </Card.Section>
          <Group position="apart" mt="md" mb="xs">
            {/* <Title order={5}>{agent.name}</Title> */}
            <Badge color="green">
              <h5>{gunName3}</h5>
            </Badge>
            <Badge color="green">${skins.gunPrice}</Badge>
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

          <Space h="30px" />
        </Grid.Col>
        <Grid.Col lg={3} md={6} sm={6} xs={6}>
          <Card.Section>
            <>
              <Image
                src={"http://localhost:5000/" + image4}
                width="100%"
                //   height="550px"
              />
            </>
          </Card.Section>
          <Group position="apart" mt="md" mb="xs">
            {/* <Title order={5}>{agent.name}</Title> */}
            <Badge color="green">
              <h5>{gunName4}</h5>
            </Badge>
            <Badge color="green">${skins.gunPrice}</Badge>
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

          <Space h="30px" />
        </Grid.Col>
        <Grid.Col lg={3} md={6} sm={6} xs={6}>
          <Card.Section>
            <>
              <Image
                src={"http://localhost:5000/" + image5}
                width="100%"
                //   height="550px"
              />
            </>
          </Card.Section>
          <Group position="apart" mt="md" mb="xs">
            {/* <Title order={5}>{agent.name}</Title> */}
            <Badge color="green">
              <h5>{gunName5}</h5>
            </Badge>
            <Badge color="green">${skins.meleePrice}</Badge>
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

          <Space h="30px" />
        </Grid.Col>
      </Grid>
    </>
  );
}
