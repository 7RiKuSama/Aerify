import { Field, Flex, Heading, Input, Stack, Button, Text, Box, Link } from "@chakra-ui/react"
import { PasswordInput } from "../ui/password-input"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainContext from "../../Contexts/MainContext"
import { SignupErrorsProps } from "../../types/error"
import { SignupUserProps } from "../../types/user"




const SignUp = () => {

    const {theme, refetchUserInfo} = useContext(MainContext)
    const Navigate = useNavigate()
    const [error, setError] = useState<SignupErrorsProps>({
        status: "",
        code: null,
        details: {
            email: null,
            password: null,
            username: null,
            other: null
        }
    })

    const [user, setUser] = useState<SignupUserProps>({
        username: "",
        password: "",
        email: "",
    })

    
    
    
    const handleCreateUser = async (e:React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/user", {
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
                        email: data.details?.email ?? null,
                        password: data.details?.password ?? null,
                        username: data.details?.username ?? null,
                        other: data.details?.other ?? null
                    }
                })
                return
            }

            if (res.status === 201) {
                await refetchUserInfo()
                Navigate("/dashboard")
            }


        } catch(error) {
            setError({
                code: null, 
                details:{
                    email: "",
                    password: "",
                    username: "", 
                    other: "Unable to connect. Please check your internet connection.", 
                },
                status: "fail"})
        } 
    }


    return (
        <Flex h={"100vh"} alignItems={"center"} justifyContent={"center"}>
            <Stack as={"form"} onSubmit={handleCreateUser} p={10} bg={theme.boxBg} h={"fit-content"} w={"400px"} borderRadius={"5px"} color={theme.color} border={`1px solid ${theme.borderColor}`}>
                <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
                    <Heading color={theme.secondColor}>Welcome to arerify.com</Heading>
                    <Text color={"gray"}>Create a free account</Text>
                </Box>
                <Text color={"red"} textAlign={"center"} >{error.details && error.details.other}</Text>
                <Field.Root invalid={Boolean(error.details.username)}>
                    <Field.Label>Username</Field.Label>
                    <Input
                        onChange={(e) => {setUser({...user, username: e.target.value})}}  
                        p={2}
                        placeholder="Example85" 
                        _placeholder={{color: theme.borderColor}}
                        border={`1px solid ${theme.borderColor}`}
                    />
                    {error.details.username && <Field.ErrorText>{error.details.username}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={Boolean(error.details.email)}>
                    <Field.Label>Email</Field.Label>
                    <Input 
                        onChange={(e) => {setUser({...user, email: e.target.value})}}  
                        p={2}
                        placeholder="me@example.com" 
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                    />
                    {error.details.email && <Field.ErrorText>{error.details.email}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={Boolean(error.details.password)}>
                    <Field.Label>Password</Field.Label>
                    <PasswordInput 
                        onChange={(e) => {setUser({...user, password: e.target.value})}} 
                        p={2} 
                        placeholder="Password"
                        _placeholder={{color: theme.borderColor}} 
                        border={`1px solid ${theme.borderColor}`}
                    />
                    {/* <PasswordStrengthMeter value={2} w={"100%"}/> */}
                    {error.details.password && <Field.ErrorText>{error.details.password}</Field.ErrorText>}
                </Field.Root>
                <Box>Already have an account? <Link href="/signin" color={theme.secondColor}>Sign in</Link></Box>
                {error.details && <p>{error.details.password}</p>}
                <Button type={"submit"} bg={theme.secondColor}>Sign up</Button>
                {error.status && <p>{error.details.email}</p>}
            </Stack>
        </Flex>
    )
}

export default SignUp