import { Container, Title, Space, Divider, Group, Button } from "@mantine/core";

import Header from "../Header";
import Agents from "../Agents";

function Home() {
  return (
    <div className="App">
      {/* <Container>
        <Group>
          <Space h="50px" />
          <Header />
          <Space h="30px" />
          <Agents />
          <Space h="30px" />
        </Group>
      </Container> */}

      <Container>
        <Space h="50px" />
        <Group position="center">
          <h1>
            <strong>WELCOME TO VALORANT</strong>
          </h1>{" "}
        </Group>
        <Space h="30px" />
        <Header page="home" />
        <Space h="50px" />
        <Agents />
        <Space h="50px" />
      </Container>
    </div>
  );
}

export default Home;
