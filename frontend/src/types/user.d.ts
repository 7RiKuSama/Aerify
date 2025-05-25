import { weatherSettings } from "./weather";

export interface UserSettingsProps {
    username: {
        state: boolean;
        value: string
    },
    email: {
        state: boolean;
        value: string;
    },
    location: {
        state: boolean, 
        option: "gps"|"manual", 
        default: undefined|LocationProps
    }
    settings: {
        state: boolean;
        data: weatherSettings[]
    }
}


export interface SignupUserProps {
    username: string;
    password: string;
    email: string
}


export interface LoginUserProps {
    username: string;
    password: string
}


export interface UserInformation {
    isConnected: boolean;
    username: string|null;
    email: string|null;
}
