import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getCartItems, clearCartItems } from "../api/cart";
import { useCookies } from "react-cookie";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
  TextInput,
  Divider,
  Grid,
  Text,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { createOrder } from "../api/order";

export default function Checkout() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const calculateTotal = () => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.bundlePrice));
    return total;
  };

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // clear the cart
      clearCartItems();
      // 3. redirect the customer to payment gateway
      window.location = data.url;
    },
    onError: (error) => {
      // when this is an error in API call
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
      setLoading(false);
    },
  });
  const doCheckout = () => {
    let error = false;
    // 1. make sure name & email is available
    if (!(name && email)) {
      error = "Please fill out all the required fields.";
    }

    // if error is available, show notification
    if (error) {
      notifications.show({
        title: error,
        color: "red",
      });
    } else {
      // if no error, trigger the order API to create a new order
      createOrderMutation.mutate(
        JSON.stringify({
          customerName: name,
          customerEmail: email,
          skins: cart.map((i) => i._id),
          description: cart.map((i) => i.name).join(", "),
          totalPrice: calculateTotal(),
        })
      );
      setLoading(true);
    }
  };

  return (
    <Container>
      <Header title="Checkout" page="checkout" />
      <Space h="35px" />
      <Grid>
        <Grid.Col span={7}>
          <Title order={3} align="center">
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

          <Button
            loading={loading}
            fullWidth
            onClick={() => {
              doCheckout();
            }}
          >
            Pay
            <Text weight="bolder" px="5px">
              ${calculateTotal()}
            </Text>
            Now
          </Button>
        </Grid.Col>
        <Grid.Col span={5}>
          <p>Your order summary</p>
          <Table>
            <thead>
              <th>Image</th>
              <th>Bundle Name</th>
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
                        {c.image1 && c.image1 !== "" ? (
                          <>
                            <Image
                              src={"http://localhost:5000/" + c.image1}
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
                        }}
                      >
                        {c.skinName}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        {c.quantity}
                      </td>
                      <td
                        style={{
                          borderTop: "none",
                        }}
                      >
                        ${c.bundlePrice}
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
                  }}
                >
                  <strong>Total</strong>
                </td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                ></td>
                <td
                  style={{
                    borderTop: "none",
                  }}
                >
                  <strong> ${calculateTotal()}</strong>{" "}
                </td>
              </tr>
            </tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
