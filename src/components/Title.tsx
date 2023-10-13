import { Heading } from "@chakra-ui/react";

interface TitleProps {
  title: string;
}

export default function Title({ title }: TitleProps) {
  return (
    <Heading fontSize={"5xl"} as="h1">
      {title}
    </Heading>
  );
}
