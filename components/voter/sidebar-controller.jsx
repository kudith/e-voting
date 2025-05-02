"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export function SidebarController({ children }) {
  const { setOpen } = useSidebar()
  const [mounted, setMounted] = useState(false)

  // Initialize mounted state
  useEffect(() => {
    setMounted(true)
    
    // Get sidebar state from cookie if it exists
    const cookies = document.cookie.split(';')
    const sidebarCookie = cookies.find(cookie => cookie.trim().startsWith('sidebar_state='))
    
    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split('=')[1].trim()
      // Set the sidebar to the state from the cookie
      setOpen(sidebarState === 'true')
    }
  }, [setOpen])

  // Just render children, the sidebar state is managed by context
  return children
} 