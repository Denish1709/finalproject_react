import { Container, Title, Space, Divider, Group, Button } from "@mantine/core";

import Header from "../Header";
import Footer from "../Footer";
// import Guns from "../Guns";
import Agents from "../Agents";

function Home() {
  return (
    <div className="App">
      <Container>
        <Group>
          {/* <Title>Valorant</Title> */}
          <Space h="50px" />
          <Header />
          {/* <Button to="/" variant="danger">
            Create Account
          </Button> */}
          <Space h="30px" />
          <Agents />
          <Space h="30px" />
          {/* <Guns /> */}
        </Group>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

export default Home;
