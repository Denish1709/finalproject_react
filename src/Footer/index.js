import {
  Group,
  Card,
  Space,
  Container,
  Title,
  Divider,
  Button,
} from "@mantine/core";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <Container>
        <div className="row">
          <div className="col-6">
            <>More Information</>
          </div>
          <div className="col-6">
            <>More Information</>
          </div>
        </div>
      </Container>
    </div>
  );
}
