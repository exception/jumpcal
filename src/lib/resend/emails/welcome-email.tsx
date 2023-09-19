import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "../footer";

interface Props {
  name: string;
  email: string;
}

const WelcomeEmail = ({ name, email }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Jumpcal.io</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 rounded-md border border-solid border-neutral-200 p-10">
            <Section className="mt-4">
              <Img
                src="https://res.cloudinary.com/dcdsmlpvg/image/upload/f_auto,q_auto/lukofxbsstyojptnu34n"
                alt="Jumpcal"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="my-5 text-center text-xl font-semibold text-neutral-950">
              Welcome to Jumpcal!
            </Heading>
            <Text className="text-sm text-black mx-auto">
              Thank you for choosing Jumpcal, {name}.
            </Text>
            <Footer intendedFor={email} showUnsubscribe />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
