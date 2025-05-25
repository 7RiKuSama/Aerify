"use client";

import { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import MainContext from "../../Contexts/MainContext";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
  const {theme} = useContext(MainContext)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (value: string[]) => {
    setSelectedSubject(value);
    const subjectLabel = subject.items.find((item) => item.value === value[0])?.label || "";
    setForm({ ...form, subject: subjectLabel });
  };

  const sendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSelectedSubject([]);
    } catch {
      setStatus("error");
    }
  };

  const subject = createListCollection({
    items: [
      { label: "General Feedback", value: "feedback" },
      { label: "App Issues", value: "issue" },
      { label: "Weather Accuracy", value: "accuracy" },
    ],
  });

  return (
    <Flex h="100vh" justify="center" align="center" px={4}>
      <Box
        as="form"
        onSubmit={sendReport}
        bg={theme.boxBg}
        p={8}
        rounded="md"
        w="800px"
        boxShadow="md"
        color={theme.color}
      >
        {status === "success" && (
            <Text color="green.500" textAlign={"center"} mb={3} p={2} bg={"green.900"} borderRadius={10}>Message sent successfully!</Text>
          )}
          {status === "error" && (
            <Text color="red.500" textAlign={"center"} mb={3} p={2} bg={"green.900"} borderRadius={10}>Failed to send message. Please try again.</Text>
        )}
        <Heading size="lg" mb={4} textAlign="center">
          Contact Us
        </Heading>

        <Stack>
          <Input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            border={`1px solid ${theme.borderColor}`}
            bg={theme.boxBg}
            pl={2}
          />
          <Input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            border={`1px solid ${theme.borderColor}`}
            bg={theme.boxBg}
            pl={2}
            required
          />

          <Select.Root
            collection={subject}
            width="100%"
            value={selectedSubject}
            onValueChange={(e) => handleSubjectChange(e.value)}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger
                border={`1px solid ${theme.borderColor}`}
                bg={theme.boxBg}
                pl={2}
              >
                <Select.ValueText placeholder="Select Subject" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {subject.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            border={`1px solid ${theme.borderColor}`}
            bg={theme.boxBg}
            p={2}
            h={"200px"}
            required
          />

          <Button type="submit" bg={theme.secondColor}>
            Send Message
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default ContactForm;
