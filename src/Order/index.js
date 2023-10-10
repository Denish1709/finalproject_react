import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
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
      <Container size="100%">
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        {/* <LoadingOverlay visible={isLoading} /> */}
        <Table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td>
                        {o.customerName}
                        {/* <br />({o.customerEmail}) */}
                      </td>
                      <td>
                        {o.skins.map((skin, index) => (
                          <div key={index}>
                            <Group>
                              {skin.image && skin.image !== "" ? (
                                <>
                                  <Image
                                    src={"http://localhost:5000/" + skin.image}
                                    width="50px"
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
                              <p>{skin.name}</p>
                            </Group>
                          </div>
                        ))}
                      </td>
                      <td>${o.totalPrice}</td>
                      <td>
                        <Select
                          value={o.status}
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
                      <td>{o.paid_at}</td>
                      <td>
                        {o.status === "Pending" && isAdmin && (
                          <Button
                            variant="outline"
                            color="red"
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
        <Space h="20px" />
        <Group position="center">
          <Button component={Link} to="/skins">
            Continue Shopping
          </Button>
        </Group>
        <Space h="20px" />

        <Group position="center">
          <Button component={Link} to="/">
            Back to Home
          </Button>
        </Group>
        <Space h="100px" />
      </Container>
    </>
  );
}
