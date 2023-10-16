import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Container,
  Table,
  Group,
  Button,
  Image,
  Title,
  Space,
  Select,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Header from "../Header";
import { useCookies } from "react-cookie";
import { fetchOrders, deleteOrder, updateOrder } from "../api/order";

export default function Orders() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { isLoading, data: orders = [] } = useQuery({
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

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order Deleted",
        color: "green",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
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
              ORDERS
            </strong>
          </Title>
        </Group>
        <Space h="50px" />
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <Table>
          <thead>
            <tr>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Customer
              </th>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                  paddingLeft: "40px",
                }}
              >
                Skin Name
              </th>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Total Amount
              </th>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                  paddingLeft: "100px",
                }}
              >
                Status
              </th>
              {isAdmin && (
                <th
                  style={{
                    fontFamily: "Courier New",
                    color: "white",
                    fontSize: "20px",
                    paddingLeft: "40px",
                  }}
                >
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td
                        style={{
                          fontFamily: "Courier New",
                          color: "white",
                          fontSize: "25px",
                        }}
                      >
                        {o.customerName}
                      </td>
                      <td>
                        {o.skins.map((skin, index) => (
                          <div key={index}>
                            <Group>
                              {skin.image && skin.image !== "" ? (
                                <>
                                  <Image
                                    src={"http://10.1.104.5:5000/" + skin.image}
                                    width="200px"
                                  />
                                </>
                              ) : (
                                <Image
                                  src={
                                    "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                  }
                                  width="50px"
                                />
                              )}
                              <Space h="10px" />
                            </Group>
                          </div>
                        ))}
                      </td>
                      <td
                        style={{
                          fontFamily: "Courier New",
                          color: "white",
                          fontSize: "25px",
                        }}
                      >
                        ${o.totalPrice}
                      </td>
                      <td>
                        <Select
                          value={o.status}
                          style={{
                            fontFamily: "Courier New",
                            color: "white",
                            fontSize: "25px",
                          }}
                          disabled={
                            o.status === "Pending" || !isAdmin ? true : false
                          }
                          data={[
                            {
                              value: "Pending",
                              label: "Pending",
                              disabled: true,
                            },
                            {
                              value: "Paid",
                              label: "Owned",
                            },
                            {
                              value: "Failed",
                              label: "Failed",
                            },
                          ]}
                          onChange={(newValue) => {
                            updateMutation.mutate({
                              id: o._id,
                              data: JSON.stringify({
                                status: newValue,
                              }),
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        />
                      </td>
                      <td>
                        {o.status === "Pending" && isAdmin && (
                          <Button
                            variant="outline"
                            style={{
                              fontFamily: "Courier New",
                              color: "white",
                              fontSize: "25px",
                            }}
                            onClick={() => {
                              deleteMutation.mutate({
                                id: o._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
        <Space h="50px" />
        <Group position="center">
          <Button component={Link} fullWidth to="/skins">
            Continue Shopping
          </Button>
        </Group>
        <Space h="100px" />
      </Container>
    </>
  );
}
