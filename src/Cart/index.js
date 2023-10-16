import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getCartItems, removeItemsFromCart } from "../api/cart";
import { Link } from "react-router-dom";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Image,
  Space,
} from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Header from "../Header";

export default function Cart() {
  const queryClient = useQueryClient();
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
  });

  const cartTotal = useMemo(() => {
    let total = 0;
    cart.map((item) => (total = total + item.quantity * item.price));
    return total;
  }, [cart]);

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      const newCheckedList = [];
      cart.forEach((cart) => {
        newCheckedList.push(cart._id);
      });
      setCheckedList(newCheckedList);
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    if (event.target.checked) {
      const newCheckedList = [...checkedList];
      newCheckedList.push(id);
      setCheckedList(newCheckedList);
    } else {
      const newCheckedList = checkedList.filter((cart) => cart !== id);
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    deleteSkinsMutation.mutate(checkedList);
  };

  const deleteMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Skin Deleted",
        color: "green",
      });
    },
  });

  const deleteSkinsMutation = useMutation({
    mutationFn: removeItemsFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
      notifications.show({
        title: "Selected Skins Deleted",
        color: "green",
      });
      setCheckAll(false);
      setCheckedList([]);
    },
  });
  return (
    <Container>
      <Space h="50px" />
      <Group position="center">
        <Title order={3} align="center" color="#778899">
          <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
            CART
          </strong>
        </Title>
      </Group>
      <Space h="30px" />
      <Header title="Cart" page="carts" text="" />
      <Space h="30px" />
      <Table>
        <Space h="30px" />
        <thead>
          <tr>
            <th>
              <Checkbox
                type="checkbox"
                checked={checkAll}
                disabled={cart && cart.length > 0 ? false : true}
                onChange={(event) => {
                  checkBoxAll(event);
                }}
              />
            </th>
            <th
              style={{
                fontFamily: "Courier New",
                color: "white",
                fontSize: "20px",
                paddingLeft: "150px",
              }}
            >
              Skin
            </th>
            <th></th>
            <th
              style={{
                fontFamily: "Courier New",
                color: "white",
                fontSize: "20px",
              }}
            >
              Price
            </th>
            <th
              style={{
                fontFamily: "Courier New",
                color: "white",
                fontSize: "20px",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                fontFamily: "Courier New",
                color: "white",
                fontSize: "20px",
                paddingLeft: "50px",
              }}
            >
              Total
            </th>
            <th
              style={{
                fontFamily: "Courier New",
                color: "white",
                fontSize: "20px",
              }}
            >
              <Group position="right">Action</Group>
            </th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((c) => {
              return (
                <tr key={c._id}>
                  <td>
                    <Checkbox
                      checked={
                        checkedList && checkedList.includes(c._id)
                          ? true
                          : false
                      }
                      type="checkbox"
                      onChange={(event) => {
                        checkboxOne(event, c._id);
                      }}
                    />
                  </td>

                  <td>
                    {c.image && c.image !== "" ? (
                      <>
                        <Image
                          src={"http://10.1.104.5:5000/" + c.image}
                          width="150px"
                        />
                      </>
                    ) : (
                      <Image
                        src={
                          "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                        }
                        width="150px"
                      />
                    )}
                  </td>
                  <td
                    style={{
                      fontFamily: "Courier New",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {c.skinName}
                  </td>
                  <td
                    style={{
                      fontFamily: "Courier New",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    RM{c.price}
                  </td>
                  <td
                    style={{
                      fontFamily: "Courier New",
                      color: "white",
                      fontSize: "20px",
                      paddingLeft: "50px",
                    }}
                  >
                    {c.quantity}
                  </td>
                  <td
                    style={{
                      fontFamily: "Courier New",
                      color: "white",
                      fontSize: "20px",
                      paddingLeft: "50px",
                    }}
                  >
                    RM{c.price * c.quantity}
                  </td>
                  <td>
                    <Group position="right">
                      <Button
                        color="red"
                        size="sm"
                        style={{
                          fontFamily: "Courier New",
                          color: "white",
                          fontSize: "20px",
                        }}
                        onClick={(event) => {
                          deleteMutation.mutate(c._id);
                        }}
                      >
                        Remove
                      </Button>
                    </Group>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                <h5 align="center">No Skins Added Yet!</h5>
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={5} className="text-end me-5"></td>
            <td>
              <strong
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                RM{cartTotal.toFixed(2)}
              </strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
      <Space h="25px" />
      <Group position="apart">
        <Button
          color="red"
          size="sm"
          className="ms-2"
          style={{
            fontFamily: "Courier New",
            fontSize: "20px",
          }}
          disabled={checkedList && checkedList.length > 0 ? false : true}
          onClick={(event) => {
            event.preventDefault();
            deleteCheckedItems();
          }}
        >
          Delete Selected
        </Button>
        <Button
          component={Link}
          to="/checkout"
          style={{
            fontFamily: "Courier New",
            fontSize: "20px",
          }}
          disabled={cart.length > 0 ? false : true}
        >
          Checkout
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}
