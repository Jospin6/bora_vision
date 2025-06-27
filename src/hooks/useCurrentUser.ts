"use client"
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    id: string
    email: string
}

export const useCurrentUser = () => {
    const [user, setUser] = useState<User>()
    useEffect(() => {
        axios.get("/api/me").then(res => {
            setUser(res.data)
        })
    }, [])
    return user;
}