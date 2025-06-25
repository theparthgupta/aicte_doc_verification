import { useAuthStore } from '@/hooks/useAuth'
import React from 'react'

export default function Settings() {
    const {clearAuth } = useAuthStore()
    return (
        <div onClick={clearAuth}>Logout</div>
    )
}
