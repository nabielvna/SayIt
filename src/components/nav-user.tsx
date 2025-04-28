"use client"

import { useEffect, useState } from "react"
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

// Define type for API user data
interface ApiUserData {
  id: string;
  clerk_id: string;
  username: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export function NavUser() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()
  const { isMobile } = useSidebar()
  const [apiUser, setApiUser] = useState<ApiUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data from your backend API
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          // Get the auth token from Clerk using the useClerk hook
          const token = await getToken()
          
          // Fetch user data from your API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/user/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const userData = await response.json()
            setApiUser(userData)
          } else {
            console.error('Failed to fetch user data:', await response.text())
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user, getToken])

  // Handle logout
  const handleSignOut = () => {
    signOut(() => {
      router.push("/")
    })
  }

  // Handle fallback for when user data is loading
  if (!user || isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="h-4 w-24 rounded bg-gray-200"></span>
              <span className="h-3 w-20 rounded bg-gray-100 mt-1"></span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Get user information from Clerk
  const userInfo = {
    name: user.fullName || user.username || "User",
    email: user.primaryEmailAddress?.emailAddress || "",
    avatar: user.imageUrl || "",
    // Use the username from your API if available
    username: apiUser?.username || user.username || "User"
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user.fullName) {
      return user.fullName.split(" ")
        .slice(0, 2)
        .map(name => name[0])
        .join("")
        .toUpperCase()
    }
    return user.username?.substring(0, 2).toUpperCase() || "U"
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={userInfo.avatar} alt={userInfo.username} />
                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userInfo.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userInfo.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.username} />
                  <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userInfo.username}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userInfo.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/account")}>
                <IconUserCircle className="mr-2 size-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/billing")}>
                <IconCreditCard className="mr-2 size-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/notifications")}>
                <IconNotification className="mr-2 size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}