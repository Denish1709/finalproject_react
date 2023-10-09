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
  Table,
  Space,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import Header from "../Header";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSkins, deleteSkin } from "../api/skin";
import { useCookies } from "react-cookie";

export default function Skins() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState("");
  const [currentSkins, setCurrentSkins] = useState([]);
  const { isLoading, data: skins } = useQuery({
    queryKey: ["skins"],
    queryFn: () => fetchSkins(),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  useEffect(() => {
    let newList = skins ? [...skins] : [];
    if (rank !== "") {
      newList = newList.filter((s) => s.rank === rank);
    }
    setCurrentSkins(newList);
  }, [skins, rank]);

  const rankOptions = useMemo(() => {
    let options = [];
    if (skins && skins.length > 0) {
      skins.forEach((skin) => {
        if (!options.includes(skin.rank)) {
          options.push(skin.rank);
        }
      });
    }
    return options;
  }, [skins]);

  const deleteMutation = useMutation({
    mutationFn: deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skins"],
      });
      notifications.show({
        title: "Skin Deleted",
        color: "green",
      });
    },
  });

  return (
    <>
      <Header title="Skin" page="skins" text="" />

      <Group position="apart">
        <Title order={3} align="center">
          SKINS
        </Title>
        {isAdmin && (
          <Button component={Link} to="/add_skin" color="green">
            ADD NEW SKIN
          </Button>
        )}
      </Group>
      <Space h="20px" />
      <Table>
        <thead>
          <tr>
            <th>
              <h1>Bundle Name</h1>
            </th>
            <th>
              <h1>Bundle Image</h1>
            </th>
            <th>
              <h1>Button </h1>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentSkins
            ? currentSkins.map((skin) => {
                return (
                  <tr key={skin._id} lg={3} md={6} sm={6} xs={6}>
                    <td>
                      <h3>{skin.name}</h3>
                    </td>
                    <td>
                      {skin.image1 && skin.image1 !== "" ? (
                        <>
                          <Image
                            src={"http://localhost:5000/" + skin.image1}
                            width="950px"
                            height="550px"
                          />
                        </>
                      ) : (
                        <Image
                          src={
                            "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                          }
                          width="300px"
                          // height="200px"
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
                                  id: skin._id,
                                  token: currentUser ? currentUser.token : "",
                                });
                              }}
                            >
                              Delete
                            </Button>
                          </Group>
                        </>
                      )}
                      <Space h="30px" />
                      <Button color="blue" size="xs" radius="50px">
                        Detail
                      </Button>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </Table>
    </>
  );
}
