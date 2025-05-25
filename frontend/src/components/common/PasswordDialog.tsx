import { Button, Dialog, Field, Portal, Stack } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import { UserSettingsProps } from "../../types/user";
import MainContext from "../../Contexts/MainContext";
import { PasswordInput } from "../ui/password-input";
import { useNavigate } from "react-router-dom";





const PasswordDialog = ({userSetting, setSetting}: {userSetting:UserSettingsProps, setSetting: React.Dispatch<React.SetStateAction<UserSettingsProps>>}) => {



  const { userInfo, setUserInfo, theme } = useContext(MainContext);  
  const ref = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState("")
  const Navigate = useNavigate()
  const handleUpdateUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: userSetting.username.value,
          email: userSetting.email.value,
          stateEmail: userSetting.email.state,
          stateUsername: userSetting.username.state,
          location: {
            option: userSetting.location.option,
            default: userSetting.location.option === "gps"? undefined : userSetting?.location?.default,
          },
          password: password,
          settings: [
            { key: "temperature_unit", value: userSetting.settings.data[0].value },
            { key: "wind_speed", value: userSetting.settings.data[1].value },
            { key: "pressure", value: userSetting.settings.data[2].value },
            { key: "precipitation", value: userSetting.settings.data[3].value },
            { key: "theme", value: userSetting.settings.data[4].value },
          ]
            
        }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        console.error("Update failed:", data);
        return;
      }
  
      const updated = await res.json();
  
      // Optionally update global context with new info
      setUserInfo({
        ...userInfo,
        username: updated.username,
        email: updated.email,
      });
  
      // Reset edit states
      setSetting({
        username: { state: updated.user.stateUsername, value: updated.user.username },
        email: { state: updated.user.stateEmail, value: updated.user.email },
        location: {state: updated?.location?.state, option: updated.location?.option, default: updated?.location?.option === "gps" ? undefined : updated?.location?.default},
        settings: { state: false, data: updated.settings }
      });
      Navigate("/dashboard")
  
    } catch (error) {
      console.error("An error occurred while updating user info:", error);
    }
  };
  return (
    <Dialog.Root initialFocusEl={() => ref.current}>
      <Dialog.Trigger asChild>
        
        <Button variant="outline" w={"49.5%"} bg={theme.secondColor} color={"white"} 
            disabled={
              userSetting?.email?.value === userInfo?.email && 
              userSetting?.username?.value === userInfo?.username &&
              !userSetting?.settings?.state &&
              !userSetting?.location?.state
            }
        >
            Save
        </Button>
        
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={5}>
            <Dialog.Header w={"100%"}>
              <Dialog.Title textAlign={"center"} w={"100%"}>Enter your password to submit the changes</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body paddingBlock={5} w={"100%"}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Password</Field.Label>
                  <PasswordInput pl={5} placeholder="Password" w={"100%"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer display={"flex"} justifyContent={"space-between"}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" w={"44%"}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={handleUpdateUserInfo} w={"44%"}>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}


export default PasswordDialog