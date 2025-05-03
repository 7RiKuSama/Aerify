import { 
    DrawerBackdrop,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerFooter,
    DrawerCloseTrigger,
    IconButton,
    Link,
    VStack,
    Button
  } from "@chakra-ui/react"
import { IoCloseSharp } from "react-icons/io5"
import { DrawerProps } from "../../types/componants"

const Drawer = ({ drawerOpen, setDrawerOpen}: DrawerProps) => {
    
    
    
    return (
        <DrawerRoot key="full" size="full" open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
          <DrawerBackdrop />
          <DrawerContent style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "50%",
            zIndex: 1002,
            backgroundColor: "var(--menus-color)",
            color: "white",
            padding: "10px",
            fontSize: "1.5rem"
          }}>
              <DrawerHeader>
              <DrawerTitle style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Link>
                    
                </Link>
                <IconButton 
                  variant="plain" 
                  rounded="full" 
                  onClick={() => setDrawerOpen(false)}
                  style={{float: "right"}}
                >
                  <IoCloseSharp color={"white"} />
                </IconButton>
              </DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <VStack>
                  <Link variant="plain" className="nav-link transitioned">Dashboard</Link>
                  <Link variant="plain" className="nav-link transitioned">Features</Link>
                  <Link variant="plain" className="nav-link transitioned">About</Link>
                  <Link variant="plain" className="nav-link transitioned">Contact</Link>
                </VStack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="plain" w={"100%"} p={4} className="button transitioned">Sign in</Button>
              </DrawerFooter>
              <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>
    )
}


export default Drawer;

