import { useState, useMemo, useEffect } from "react";
import {
  Title,
  Image,
  Container,
  Button,
  Group,
  Space,
  Table,
  LoadingOverlay,
} from "@mantine/core";
import Header from "../Header";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRanks, deleteRank } from "../api/rank";
import { useCookies } from "react-cookie";

export default function Ranks() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rank, setRank] = useState("");
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
      <Container>
        <Space h="50px" />
        <Group position="center">
          <Title order={3} align="center" color="#778899">
            <strong style={{ fontFamily: "Courier New", fontSize: "40px" }}>
              RANKS
            </strong>
          </Title>
        </Group>
        <Space h="30px" />
        <Header title="Ranks" page="ranks" />
        <Space h="30px" />
        <LoadingOverlay visible={isLoading} />
        <Group position="right">
          {isAdmin && (
            <Button
              component={Link}
              to="/add_rank"
              color="orange"
              style={{ fontFamily: "Courier New" }}
            >
              Add New Rank
            </Button>
          )}
        </Group>
        <Space h="30px" />
        <LoadingOverlay visible={isLoading} />
        <Table sm={12}>
          <thead>
            <tr>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                }}
              >
                Rank
              </th>
              <th
                style={{
                  fontFamily: "Courier New",
                  color: "white",
                  fontSize: "20px",
                  paddingLeft: "70px",
                }}
              >
                Emblem
              </th>
              {isAdmin && (
                <th
                  style={{
                    fontFamily: "Courier New",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  Button
                </th>
              )}
            </tr>
          </thead>
          <Space h="30px" />
          <tbody>
            {ranks
              ? ranks.map((r) => {
                  return (
                    <tr key={r._id}>
                      <td
                        style={{
                          fontFamily: "Courier New",
                          color: "white",
                          fontSize: "20px",
                        }}
                      >
                        {r.name}
                      </td>
                      <td>
                        {r.image && r.image !== "" ? (
                          <>
                            <Image
                              src={"http://10.1.104.5:5000/" + r.image}
                              width="200px"
                              height="200px"
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
                                size="md"
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
        <Space h="100px" />
      </Container>
    </>
  );
}
