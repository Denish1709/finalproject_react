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
  Table,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import Header from "../Header";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRanks, deleteRank } from "../api/rank";
// import { addToCart, getCartItems } from "../api/cart";
import { useCookies } from "react-cookie";

export default function Ranks() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState("");
  const [currentRanks, setCurrentRanks] = useState([]);

  const { isLoading, data: ranks } = useQuery({
    queryKey: ["ranks"],
    queryFn: () => fetchRanks(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = ranks ? [...ranks] : [];
    if (rank !== "") {
      newList = newList.filter((r) => r.rank === rank);
    }
    setCurrentRanks(newList);
  }, [ranks, rank]);

  const rankOptions = useMemo(() => {
    let options = [];
    if (ranks && ranks.length > 0) {
      ranks.forEach((rank) => {
        if (!options.includes(rank.rank)) {
          options.push(rank.role);
        }
      });
    }
    return options;
  }, [ranks]);

  const deleteMutation = useMutation({
    mutationFn: deleteRank,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ranks"],
      });
      notifications.show({
        title: "Rank Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Container size="100%">
        <Header title="Ranks" page="ranks" />
        <Group position="apart">
          <Title order={3} align="center">
            Ranks
          </Title>
          {isAdmin && (
            <Button component={Link} to="/add_rank" color="green">
              Add New Rank
            </Button>
          )}
          {/* <Button component={Link} to="/skin" color="green">
          Skin
        </Button> */}
        </Group>
        <Space h="35px" />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Emblem</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            {ranks
              ? ranks.map((r) => {
                  return (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.rank}</td>
                      <td>
                        {r.image && r.image !== "" ? (
                          <>
                            <Image
                              src={"http://localhost:5000/" + r.image}
                              width="250px"
                              height="300px"
                            />
                          </>
                        ) : (
                          <Image
                            src={
                              "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                            }
                            width="250px"
                            height="300px"
                          />
                        )}
                      </td>
                      <td>
                        {isAdmin && (
                          <>
                            <Space h="20px" />
                            <Group position="apart">
                              <Button
                                color="red"
                                size="xs"
                                radius="50px"
                                onClick={() => {
                                  deleteMutation.mutate({
                                    id: r._id,
                                    token: currentUser ? currentUser.token : "",
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </Group>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
      </Container>
    </>
  );
}
