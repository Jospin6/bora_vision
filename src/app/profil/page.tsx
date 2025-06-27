"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function Prfilpage () {
    const user = useCurrentUser()
    return <div>
        <h1>Profil</h1>
        <div>{user?.id}</div>
        <div>{user?.email}</div>
    </div>
}