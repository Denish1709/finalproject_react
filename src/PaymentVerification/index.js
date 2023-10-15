import {
  Container,
  Title,
  Group,
  Space,
  Loader,
  Text,
  Card,
} from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { verifyPayment } from "../api/payment";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");

  useEffect(() => {
    verifyPaymentMutation.mutate(
      JSON.stringify({
        billplz_id: billplz_id,
        billplz_paid: billplz_paid,
        billplz_paid_at: billplz_paid_at,
        billplz_x_signature: billplz_x_signature,
      })
    );
  }, []);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (order) => {
      if (order.status === "Paid") {
        notifications.show({
          title: "Payment verified",
          color: "green",
        });
      } else if (order.status === "Failed") {
        notifications.show({
          title: "Payment failed",
          color: "red",
        });
      }
      navigate("/orders");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  return (
    <Container>
      <Space h="100px" />
      <Card withBorder shadow="md" px="30px" py="60px">
        <Group position="center">
          <Loader size="60px" />
        </Group>
        <Space h="20px" />
        <Title order={1} align="center">
          Verifying Your Payment...
        </Title>
        <Title order={2} align="center">
          Please <Text color="red">DO NOT CLOSE</Text> your browser or press the
          back button.
        </Title>
      </Card>
    </Container>
  );
}
