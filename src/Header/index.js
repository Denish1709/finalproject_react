import {
  Group,
  Space,
  Title,
  Divider,
  Text,
  Button,
  Avatar,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
// import { clearCartItems } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Header({ page = "" }) {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);
  return (
    <div className="header">
      <Group position="center">
        <Button
          component={Link}
          to="/"
          variant={page === "home" ? "filled" : "light"}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/guns"
          variant={page === "guns" ? "filled" : "light"}
        >
          Guns
        </Button>
        <Button
          component={Link}
          to="/maps"
          variant={page === "maps" ? "filled" : "light"}
        >
          Maps
        </Button>
        <Button
          component={Link}
          to="/ranks"
          variant={page === "ranks" ? "filled" : "light"}
        >
          Rank
        </Button>
        <Button
          component={Link}
          to="/skins"
          variant={page === "skins" ? "filled" : "light"}
        >
          Skins
        </Button>
        <Button
          component={Link}
          to="/orders"
          variant={page === "orders" ? "filled" : "light"}
        >
          My Orders
        </Button>
        <Button
          component={Link}
          to="/carts"
          variant={page === "carts" ? "filled" : "light"}
        >
          My Cart
        </Button>

        <Group position="right">
          {cookies && cookies.currentUser ? (
            <>
              <Group>
                <Avatar
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                  radius="xl"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {cookies.currentUser.name}
                  </Text>

                  {/* <Text c="dimmed" size="xs">
                    {cookies.currentUser.email}
                  </Text> */}
                </div>
              </Group>
              <Button
                variant={"light"}
                onClick={() => {
                  // clear the currentUser cookie to logout
                  removeCookies("currentUser");

                  // clear the chat
                  // clearCartItems();

                  // redirect to home page
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant={page === "login" ? "filled" : "light"}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={page === "signup" ? "filled" : "light"}
              >
                Sign Up
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
