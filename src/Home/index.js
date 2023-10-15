import { Container, Space, Group } from "@mantine/core";

import Header from "../Header";
import Agents from "../Agents";

function Home() {
  return (
    <div className="App">
      <Container>
        <Space h="100px" />
        <Group position="center">
          <h1 style={{ color: "#B0C4DE" }}>
            <strong>WELCOME TO VALORANT</strong>
          </h1>
        </Group>
        <Space h="30px" />
        <Header page="home" />
        <Space h="50px" />
        <Agents />
        <Space h="100px" />
      </Container>
    </div>
  );
}

export default Home;
