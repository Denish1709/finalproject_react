import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Title,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Space,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAgents, deleteAgent } from "../api/agent";
import { useCookies } from "react-cookie";

export default function Agents() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const [role, setRole] = useState("");
  const [currentAgents, setCurrentAgents] = useState([]);
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState([]);
  const { isLoading, data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => fetchAgents(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = agents ? [...agents] : [];
    if (role !== "") {
      newList = newList.filter((a) => a.role === role);
    }

    const total = Math.ceil(newList.length / perPage);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);

    switch (sort) {
      case "name":
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
      default:
        newList = newList.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        break;
    }
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newList = newList.slice(start, end);

    setCurrentAgents(newList);
  }, [agents, role, sort, perPage, currentPage]);

  const roleOptions = useMemo(() => {
    let options = [];
    if (agents && agents.length > 0) {
      agents.forEach((agent) => {
        if (!options.includes(agent.role)) {
          options.push(agent.role);
        }
      });
    }
    return options;
  }, [agents]);

  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      notifications.show({
        title: "Agent Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Group position="center">
        <Title order={3} align="center" color="#778899">
          <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
            AGENTS
          </strong>
        </Title>
      </Group>
      <Group position="right">
        {isAdmin && (
          <Button
            component={Link}
            to="/add_agent"
            color="red"
            style={{ fontFamily: "Courier New" }}
          >
            ADD NEW AGENT
          </Button>
        )}
      </Group>
      <Space h="30px" />
      <Group>
        <select
          value={role}
          style={{
            backgroundColor: "#483D8B",
            color: "white",
            fontFamily: "Courier New",
          }}
          onChange={(event) => {
            setRole(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="" style={{ fontFamily: "Courier New" }}>
            All Role
          </option>
          {roleOptions.map((role) => {
            return (
              <option
                key={role}
                value={role}
                style={{ fontFamily: "Courier New" }}
              >
                {role}
              </option>
            );
          })}
        </select>
        <select
          value={perPage}
          style={{
            backgroundColor: "#483D8B",
            color: "white",
            fontFamily: "Courier New",
          }}
          onChange={(event) => {
            setPerPage(parseInt(event.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="6" style={{ fontFamily: "Courier New" }}>
            6 Per Page
          </option>
          <option value="10" style={{ fontFamily: "Courier New" }}>
            10 Per Page
          </option>
          <option value={9999999} style={{ fontFamily: "Courier New" }}>
            All
          </option>
        </select>
      </Group>
      <Space h="50px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentAgents
          ? currentAgents.map((agent) => {
              return (
                <Grid.Col key={agent._id} lg={4} md={6} sm={6} xs={6}>
                  <Card
                    shadow="sm"
                    padding="md"
                    radius="md"
                    style={{
                      backgroundColor: "#708090",
                      width: "300px",
                      height: "680px",
                    }}
                    withBorder
                  >
                    <Card.Section>
                      {agent.image && agent.image !== "" ? (
                        <>
                          <Image
                            src={"http://10.1.104.5/" + agent.image}
                            width="100%"
                            height="200px"
                          />
                        </>
                      ) : (
                        <Image
                          src={
                            "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                          }
                          width="100%"
                        />
                      )}
                    </Card.Section>
                    <Group
                      position="apart"
                      mt="md"
                      mb="xs"
                      style={{ height: "100px" }}
                    >
                      <Badge
                        color="yellow"
                        style={{ fontFamily: "Courier New" }}
                      >
                        {agent.role}
                      </Badge>
                      <Group position="left">
                        <Badge
                          color="violet"
                          style={{ fontFamily: "Courier New" }}
                        >
                          {agent.basicAbilities}
                        </Badge>
                      </Group>
                      <Group position="right">
                        <Badge
                          color="light"
                          style={{ fontFamily: "Courier New" }}
                        >
                          {agent.signatureAbilities}
                        </Badge>
                      </Group>
                      <Group position="left">
                        <Badge
                          color="red"
                          style={{ fontFamily: "Courier New" }}
                        >
                          {agent.ultimateAbilities}
                        </Badge>
                      </Group>
                    </Group>
                    <Space h="30px" />
                    <Group style={{ height: "200px" }}>
                      <Title
                        order={2}
                        style={{
                          color: "black",
                          fontFamily: "Courier New",
                        }}
                      >
                        {agent.name}
                      </Title>

                      <Text
                        size="sm"
                        color="dimmed"
                        style={{ color: "black", fontFamily: "Courier New" }}
                      >
                        {agent.description}
                      </Text>
                    </Group>
                    <Space h="20px" />
                    {isAdmin && (
                      <>
                        <Space h="30px" />

                        <Group position="apart">
                          <Button
                            component={Link}
                            to={"/agents/" + agent._id}
                            color="blue"
                            style={{ fontFamily: "Courier New" }}
                            size="xs"
                            radius="50px"
                          >
                            Edit
                          </Button>
                          <Button
                            color="red"
                            size="xs"
                            style={{ fontFamily: "Courier New" }}
                            radius="50px"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: agent._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Group>
                      </>
                    )}
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
      <Space h="40px" />
      <div align="center">
        <span style={{ marginRight: "10px", color: "white" }}>
          <strong>
            PAGE {currentPage} OF {totalPages.length}
          </strong>
        </span>
        <Space h="20px" />
        <Group position="center">
          {totalPages.map((page) => {
            return (
              <button
                key={page}
                style={{ fontFamily: "Courier New" }}
                onClick={() => {
                  setCurrentPage(page);
                }}
              >
                {page}
              </button>
            );
          })}
        </Group>
      </div>
      <Space h="40px" />
    </>
  );
}
