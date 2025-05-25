import { Field, Flex, Heading, Stack, Button, Text, Box } from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input"
import { useContext, useState} from "react"
import { useNavigate } from "react-router-dom"
import MainContext from "../../Contexts/MainContext"



const SignIn = () => {

    
    
    
    const {theme} = useContext(MainContext)
    const navigate = useNavigate()
    const [passwords, setPasswords] = useState({
        "current": "",
        "new": "",
        "confirmNew": ""
    })
    const [errors, setErrors] = useState("")


    const HandleChangePassword = async (e:React.FormEvent) => {
        e.preventDefault()
        try {
            if (passwords.new !== passwords.confirmNew) {
                setErrors("Password doesn't match.")
                return
            }
            const res = await fetch("http://localhost:4000/api/password", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    "current": passwords.current,
                    "new": passwords.new
                })
            })

            if (!res.ok) {
                const data = await res.json()
                setErrors(data.error || "Something Happened, Try later.")
                return
            }

            if (res.status === 200) {
                navigate("/dashboard")
            }

        } catch (error) {

        }
    }
   
    return (
        <Flex h={"100vh"} alignItems={"center"} justifyContent={"center"}>
            <Stack as={"form"} onSubmit={HandleChangePassword} p={10} bg={theme.boxBg} h={"fit-content"} w={"400px"} borderRadius={"5px"} color={theme.color} border={`1px solid ${theme.borderColor}`}>
                <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
                    <Heading color={theme.secondColor}>Password Change</Heading>
                    {errors && <Text>{errors}</Text>}
                </Box>
                <Field.Root required>
                    <Field.Label>Current Password</Field.Label>
                    <PasswordInput 
                        p={2} 
                        placeholder="Current Password"
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                </Field.Root>
                <Field.Root required>
                    <Field.Label>New Password</Field.Label>
                    <PasswordInput 
                        p={2} 
                        placeholder="New Password"
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                </Field.Root>
                <Field.Root required>
                    <Field.Label>Confirm New Password</Field.Label>
                    <PasswordInput 
                        p={2} 
                        placeholder="Confirm New Password"
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                        value={passwords.confirmNew}
                        onChange={(e) => setPasswords({...passwords, confirmNew: e.target.value})}
                    />
                </Field.Root>
                <Button type={"submit"} bg={theme.secondColor}>Submit</Button>
            </Stack>
        </Flex>
    )
}

export default SignIn