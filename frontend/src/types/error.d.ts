export interface SignupErrorsProps {
    status: string;
    code: number|null;
    details: {
        email: string|null;
        password: string|null;
        username: string|null;
        other: string|null;
    }
}


export interface LoginErrorsProps {
    status: string;
    code: number|null;
    details: {
        password: string|null;
        username: string|null;
        other: string|null;
    }
}

