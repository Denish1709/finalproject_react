import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getCartItems, clearCartItems } from "../api/cart";
import { useCookies } from "react-cookie";
import {
  Container,
  Title,
  Table,
  Button,
  Image,
  Space,
  Group,
  TextInput,
  Grid,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { createOrder } from "../api/order";

export default function Checkout() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const [loading, setLoading] = useState(false);
  const [riotid, setRiotId] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const calculateTotal = () => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  };

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      clearCartItems();
      window.location = data.url;
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
      setLoading(false);
    },
  });
  const doCheckout = () => {
    let error = false;
    if (!(name && email)) {
      error = "Please fill out all the required fields.";
    }

    if (error) {
      notifications.show({
        title: error,
        color: "red",
      });
    } else {
      createOrderMutation.mutate(
        JSON.stringify({
          customerName: name,
          customerEmail: email,
          skins: cart.map((i) => i._id),
          description: cart.map((i) => i.skinName).join(", "),
          totalPrice: calculateTotal(),
        })
      );
      setLoading(true);
    }
  };

  return (
    <Container>
      <Space h="50px" />
      <Group position="center">
        <Title order={3} align="center" color="#778899">
          <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
            CHECKOUT
          </strong>
        </Title>
      </Group>
      <Space h="30px" />
      <Header title="Checkout" page="checkout" />
      <Space h="35px" />
      <Grid>
        <Grid.Col span={6}>
          <Title order={3} align="center" color="white">
            Valorant Account Information
          </Title>
          <Space h="20px" />
          <TextInput
            value={riotid}
            placeholder="Enter Your Riot Id Here"
            label="Riot ID"
            required
            onChange={(event) => setRiotId(event.target.value)}
          />
          <Space h="20px" />
          <TextInput
            value={tagLine}
            placeholder="Enter Your Tagline Here"
            label="Tagline"
            required
            onChange={(event) => setTagLine(event.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={3} align="center" color="white">
            Contact Information
          </Title>
          <Space h="20px" />
          <TextInput
            value={name}
            placeholder="Name"
            label="Name"
            required
            onChange={(event) => setName(event.target.value)}
          />
          <Space h="20px" />

          <TextInput
            value={email}
            placeholder="email address"
            label="Email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Space h="20px" />
        </Grid.Col>

        <Grid.Col>
          <h5 style={{ color: "white" }}>Your order summary</h5>
          <Space h="30px" />
          <Table style={{ color: "white", fontSize: "20px" }}>
            <thead>
              <th>Image</th>
              <th>Skin Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </thead>
            <tbody>
              {cart ? (
                cart.map((c) => {
                  return (
                    <tr key={c._id}>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.image && c.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.5:5000/" + c.image}
                              width="100px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                            }
                            width="100px"
                          />
                        )}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                          color: "white",
                          fontSize: "20px",
                        }}
                      >
                        {c.category} {c.skinName}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                          color: "white",
                          fontSize: "20px",
                        }}
                      >
                        {c.quantity}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                          color: "white",
                          fontSize: "20px",
                        }}
                      >
                        RM{c.price}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No Skins Added Yet!</td>
                </tr>
              )}
              <tr>
                <td
                  style={{
                    borderTop: "none",
                    color: "white",
                  }}
                >
                  <strong style={{ fontSize: "20px" }}>Total</strong>
                </td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "none",
                    color: "white",
                  }}
                >
                  <strong style={{ fontSize: "20px" }}>
                    RM{calculateTotal()}
                  </strong>{" "}
                </td>
              </tr>
            </tbody>
          </Table>
          <Space h="30px" />
          <Button
            loading={loading}
            fullWidth
            onClick={() => {
              doCheckout();
            }}
          >
            Pay
            <Text weight="bolder" px="5px">
              RM{calculateTotal()}
            </Text>
            Now
          </Button>
        </Grid.Col>
      </Grid>
      <Space h="100px" />
    </Container>
  );
}
