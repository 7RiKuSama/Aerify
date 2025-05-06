export interface UserSettingsProps {
    username: {
        state: boolean;
        value: string
    },
    email: {
        state: boolean;
        value: string;
    }
    password: {
        state: boolean;
    }
    notification: {
        state: boolean;
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