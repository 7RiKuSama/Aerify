import { Field, Flex, Heading, Input, Stack, Button, Text, Box, Link } from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input"
import { useContext, useState} from "react"
import { useNavigate } from "react-router-dom"
import MainContext from "../../Contexts/MainContext"
import { LoginUserProps } from "../../types/user"
import { LoginErrorsProps } from "../../types/error"


const SignIn = () => {

    const {theme, refetchUserInfo} = useContext(MainContext)
    const navigate = useNavigate()
    const [error, setError] = useState<LoginErrorsProps>({
        status: "",
        code: null,
        details: {
            password: null,
            username: null,
            other: null
        }
    })

    const [user, setUser] = useState<LoginUserProps>({
        username: "",
        password: "",
    })
    
    const handVerifyUser = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // Add this line
                body: JSON.stringify(user)
            })

            if (!res.ok) {
                const data = await res.json()
                setError({
                    status: data.status || "fail",
                    code: data.code ?? null,
                    details: {
                        password: data.details?.password ?? null,
                        username: data.details?.username ?? null,
                        other: data.details?.other ?? null
                    }
                })
                return
            } 

            if (res.status === 200) {
                await refetchUserInfo();
                navigate("/dashboard")
            }

        } catch(error) {
            setError({
                code: null, 
                details:{
                    password: "",
                    username: "", 
                    other: "Unable to connect. Please check your internet connection.", 
                },
                status: "fail"})
        } 
    }



    return (
        <Flex h={"100vh"} alignItems={"center"} justifyContent={"center"}>
            <Stack as={"form"} onSubmit={handVerifyUser} p={10} bg={theme.boxBg} h={"fit-content"} w={"400px"} borderRadius={"5px"} color={theme.color} border={`1px solid ${theme.borderColor}`}>
                <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
                    <Heading color={theme.secondColor}>Sign in</Heading>
                    <Text color={"gray"}>Sign in using your registered account</Text>
                    {<Text>{error.details && error.details.other}</Text>}
                </Box>
                <Field.Root required>
                    <Field.Label>Username</Field.Label>
                    <Input  
                        p={2}
                        placeholder="Example85"
                        onChange={(e) => {setUser({...user, username: e.target.value})}}
                        _placeholder={{color: theme.borderColor}}
                        border={`1px solid ${theme.borderColor}`}
                    />
                </Field.Root>
                <Field.Root required>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput 
                        p={2} 
                        placeholder="Password"
                        onChange={(e) => {setUser({...user, password: e.target.value})}}
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                    />
                </Field.Root>
                <Box>Don't have an account? <Link href="/signup" color={theme.secondColor}>Sign up</Link></Box>
                <Button type={"submit"} bg={theme.secondColor}>Sign up</Button>
            </Stack>
        </Flex>
    )
}

export default SignIn