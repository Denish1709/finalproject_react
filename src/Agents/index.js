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
  Space,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAgents, deleteAgent } from "../api/agent";
// import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";

export default function Agents() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basicAbilities, setBasicAbilities] = useState("");
  const [passiveAbilities, setPassiveAbilities] = useState("");
  const [signatureAbilities, setSignatureAbilities] = useState("");
  const [ultimateAbilities, setUltimateAbilities] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [currentAgents, setCurrentAgents] = useState([]);
  // const [category, setCategory] = useState("");
  // const [sort, setSort] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [perPage, setPerPage] = useState(6);
  // const [totalPages, setTotalPages] = useState([]);
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
    setCurrentAgents(newList);
  }, [agents, role]);

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
      <Group position="apart">
        <Title order={3} align="center">
          AGENTS
        </Title>
        {isAdmin && (
          <Button component={Link} to="/add_agent" color="green">
            ADD NEW AGENT
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Group>
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            // setCurrentPage(1);
          }}
        >
          <option value="">All Role</option>
          {roleOptions.map((role) => {
            return (
              <option key={role} value={role}>
                {role}
              </option>
            );
          })}
        </select>
      </Group>
      <Space h="20px" />
      <LoadingOverlay visible={isLoading} />
      <Grid>
        {currentAgents
          ? currentAgents.map((agent) => {
              return (
                <Grid.Col key={agent._id} lg={4} md={6} sm={6} xs={6}>
                  {/* <Card shadow="sm" padding="lg" radius="md" withBorder> */}
                  <Card.Section>
                    {agent.image && agent.image !== "" ? (
                      <>
                        <Image
                          src={"http://localhost:5000/" + agent.image}
                          width="100%"
                          height="200px"
                        />
                      </>
                    ) : (
                      <Image
                        src={
                          "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                        }
                        width="250px"
                        // height="200px"
                      />
                    )}
                  </Card.Section>
                  <Group position="apart" mt="md" mb="xs">
                    {/* <Title order={5}>{agent.name}</Title> */}
                    <Badge color="green">{agent.name}</Badge>
                    <Badge color="yellow">{agent.role}</Badge>
                  </Group>
                  <Text size="sm" color="dimmed">
                    {agent.description}
                  </Text>
                  {/* <p>{agent.name}</p> */}
                  {/* <Space h="20px" /> */}
                  {/* <Group position="apart" spacing="5px">
                      <Title order={5}>{agent.name}</Title>
                      <Badge color="green">{agent.description}</Badge>
                      <Badge color="yellow">{agent.role}</Badge>
                    </Group> */}
                  {/* <Space h="20px" /> */}
                  {isAdmin && (
                    <>
                      <Space h="20px" />
                      <Group position="apart">
                        <Button
                          component={Link}
                          to={"/agents/" + agent._id}
                          color="blue"
                          size="xs"
                          radius="50px"
                        >
                          Edit
                        </Button>
                        <Button
                          color="red"
                          size="xs"
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
                  {/* </Card> */}
                </Grid.Col>
              );
            })
          : null}
      </Grid>
      <Space h="40px" />
    </>
  );
}

// return (
//   <Card shadow="sm" padding="lg" radius="md" withBorder>
//     <Card.Section>
//       {agent.image && agent.image !== "" ? (
//         <>
//           <Image src={"http://localhost:5000/" + agent.image} width="50px" />
//         </>
//       ) : (
//         <Image
//           src={
//             "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
//           }
//           width="50px"
//         />
//       )}
//     </Card.Section>

//     <Group position="apart" mt="md" mb="xs">
//       <Title order={5}>{agent.name}</Title>
//       <Badge color="green">{agent.description}</Badge>
//       <Badge color="yellow">{agent.role}</Badge>
//     </Group>

//     <Text size="sm" color="dimmed">
//       {agent.description}
//     </Text>

//     <Button variant="light" color="blue" fullWidth mt="md" radius="md">
//       Book classic tour now
//     </Button>
//   </Card>
// );
