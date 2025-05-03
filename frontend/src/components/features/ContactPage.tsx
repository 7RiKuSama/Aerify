import { Field, Flex, Heading, Input, Textarea, Stack, Button, Text, Box, Select } from "@chakra-ui/react"
import { createListCollection, Portal } from "@ark-ui/react"
import { useContext } from "react"
import MainContext from "../../Contexts/MainContext"


const ContactPage = () => {
    const subjects = createListCollection({
        items: [
            { value: "general-feedback", label: "General Feedback" },
            { value: "weather-accuracy", label: "Weather Accuracy" },
            { value: "app-issues", label: "App Issues" },
        ]
    })

    const { theme } = useContext(MainContext)
    return (
        <Flex>
            <Flex h={"100vh"} alignItems={"center"} justifyContent={"center"}>
                        <Stack p={10} h={"fit-content"} w={{ base: "90%", md: "70%" }}  color={theme.color}>
                            <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
                                <Heading color={theme.secondColor}>Contact Us</Heading>
                                <Text color={"gray"}>We’d love to hear your feedback or help with any questions about the weather app!</Text>
                            </Box>
                            <Flex flexDirection={{base: "column", md: "row"}}>
                                <Field.Root required mr={2}>
                                    <Field.Label>Full Name</Field.Label>
                                    <Input  
                                        
                                        p={2}
                                        placeholder="Example85" 
                                        _placeholder={{color: theme.borderColor}}
                                        border={`1px solid ${theme.borderColor}`}
                                    />
                                    <Field.ErrorText>here's my error</Field.ErrorText>
                                </Field.Root>
                
                                <Field.Root required>
                                    <Field.Label>Email Address</Field.Label>
                                    <Input  
                                        p={2}
                                        placeholder="me@example.com" 
                                        _placeholder={{color: theme.borderColor}} 
                                        border={`1px solid ${theme.borderColor}`}
                                    />
                                    <Field.ErrorText>here's my error</Field.ErrorText>
                                </Field.Root>
                            </Flex>

                            <Field.Root required>
                                <Field.Label>Message</Field.Label>
                                <Textarea  
                                    p={2}
                                    placeholder="Example85" 
                                    _placeholder={{color: theme.borderColor}}
                                    border={`1px solid ${theme.borderColor}`}
                                />
                                <Field.ErrorText>here's my error</Field.ErrorText>
                            </Field.Root>
                            <Flex w={"100%"} flexDirection={"row"} alignItems={"start"} justifyContent={"space-between"}>
                                <Select.Root collection={subjects} size="sm" width="320px">
                                    <Select.HiddenSelect />
                                    <Select.Label color={theme.borderColor}>Select the subject</Select.Label>
                                    <Select.Control >
                                        <Select.Trigger border={`1px solid ${theme.borderColor}`}>
                                            <Select.ValueText placeholder="Select framework" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup bg={theme.boxBg}>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content bg={theme.bg} color={theme.color} border={`1px solid ${theme.borderColor}`}>
                                                {subjects.items.map((subject: { value: string; label: string }) => (
                                                <Select.Item item={subject} key={subject.value}>
                                                    {subject.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                                <Button w={"40%"} bg={theme.secondColor} alignSelf={"end"} ml={2}>Sign up</Button>
                            </Flex>
                        </Stack>

                    </Flex>
        </Flex>
    )
}

export default ContactPage