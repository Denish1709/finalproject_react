import {
  Group,
  Space,
  Divider,
  Text,
  Button,
  Avatar,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearCartItems } from "../api/cart";
import { useNavigate } from "react-router-dom";

export default function Header({ page = "" }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();
  return (
    <div className="header">
      <Group position="center">
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/"
          variant={page === "home" ? "filled" : "light"}
        >
          Home
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/guns"
          variant={page === "guns" ? "filled" : "light"}
        >
          Guns
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/maps"
          variant={page === "maps" ? "filled" : "light"}
        >
          Maps
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/ranks"
          variant={page === "ranks" ? "filled" : "light"}
        >
          Rank
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/skins"
          variant={page === "skins" ? "filled" : "light"}
        >
          Skins
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/carts"
          variant={page === "carts" ? "filled" : "light"}
        >
          Cart
        </Button>
        <Button
          component={Link}
          style={{ fontFamily: "Courier New", fontSize: "15px" }}
          to="/orders"
          variant={page === "orders" ? "filled" : "light"}
        >
          Orders
        </Button>

        <Group position="right">
          {cookies && cookies.currentUser ? (
            <>
              <Group>
                <div style={{ flex: 1 }}>
                  <Modal
                    opened={opened}
                    style={{ fontFamily: "Courier New" }}
                    onClose={close}
                    title="Are you sure to logout?"
                    centered
                  >
                    <Button
                      color="red"
                      style={{
                        fontFamily: "Courier New",
                      }}
                      onClick={() => {
                        removeCookies("currentUser");

                        clearCartItems();
                        window.location = "/";
                      }}
                    >
                      Logout
                    </Button>
                  </Modal>

                  <Button onClick={open} color="light">
                    <Avatar
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      radius="xl"
                      w="30px"
                      h="30px"
                    />
                    <Space w="10px" />
                    <Text size="sm" fw={500} color="dark">
                      <strong
                        style={{ fontFamily: "Courier New", fontSize: "15px" }}
                      >
                        {cookies.currentUser.name}
                      </strong>
                    </Text>
                  </Button>
                </div>
              </Group>
            </>
          ) : (
            <>
              <Button
                component={Link}
                style={{ fontFamily: "Courier New" }}
                to="/login"
                variant={page === "login" ? "filled" : "light"}
              >
                Login
              </Button>
            </>
          )}
        </Group>
      </Group>
      <Space h="50px" />
      <Divider />
    </div>
  );
}
