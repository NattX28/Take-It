"use client"
import { Icon } from "@iconify/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

// mock data
const users = [
  { id: "1", name: "User 1" },
  { id: "2", name: "User 2" },
  { id: "3", name: "User 3" },
]

// mock friend requests
const friendRequests = [
  { id: "101", name: "Friend Request 1", avatar: "👤" },
  { id: "102", name: "Friend Request 2", avatar: "👤" },
]

const TopConsole = () => {
  const pathName = usePathname()
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<string>("everyone")
  const [pendingRequests, setPendingRequests] = useState(friendRequests)

  // when web load, check URL for set selectedUser correctly
  useEffect(() => {
    if (pathName === "/" || pathName === "/home") {
      setSelectedUser("everyone")
    } else if (pathName.startsWith("/gallery/")) {
      const userId = pathName.split("/gallery/")[1]
      const user = users.find((u) => u.id === userId)
      if (user) {
        setSelectedUser(user.name)
      }
    }
  }, [pathName])

  const handleUsesrSelect = (userName: string, userId?: string) => {
    setSelectedUser(userName)

    if (userName === "everyone") {
      router.push("/home")
    } else {
      router.push(`/gallery/${userId}`)
    }
  }

  // function for accepting friend request
  const handleAcceptFriendRequest = (
    requestId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault() // prevent redirect
    e.stopPropagation() // prevent closing dropdown

    // simulator
    setPendingRequests((prev) =>
      prev.filter((request) => request.id !== requestId)
    )

    console.log(`Accepted friend request from ID: ${requestId}`)
  }

  return (
    <nav className="w-full transition-all duration-100">
      <div className="flex justify-between items-center mt-4 ">
        <div className="hover:opacity-80 transition-opacity cursor-pointer">
          <Icon icon="cil:face" width="36" height="36" />
        </div>
        {/* Dropdown */}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-1 glass px-3 py-2 rounded-full gap-2">
            <Icon icon="mdi:chevron-down" width="24" height="24" />

            <span>{selectedUser}</span>
            {pendingRequests.length > 0 && (
              <Badge
                className="rounded-full bg-amber-400"
                variant={"destructive"}>
                {pendingRequests.length}
              </Badge>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 rounded-2xl">
            {/* Users section */}
            <DropdownMenuItem
              onClick={() => handleUsesrSelect("everyone")}
              className={`flex items-center space-x-1 rounded-xl cursor-pointer ${
                selectedUser === "everyone" ? "glass-dark" : "hover:glass"
              }`}>
              <Icon icon="mdi:account-group" className="mr-2" />
              <span>everyone</span>
            </DropdownMenuItem>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => handleUsesrSelect(user.name, user.id)}
                className={`flex items-center space-x-1 rounded-xl cursor-pointer ${
                  selectedUser === user.name ? "glass-dark" : "hover:glass"
                }`}>
                <Icon icon="mdi:account" width="24" height="24" />
                <span>{user.name}</span>
              </DropdownMenuItem>
            ))}

            {/* Friend request section - only show if there are pending requests */}
            {pendingRequests.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-sm font-semibold">
                  Friend Requests
                  {pendingRequests.map((request) => (
                    <DropdownMenuItem
                      key={request.id}
                      className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="mr-2">{request.avatar}</span>
                        <span>{request.name}</span>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-500 hover:bg-green-600 cursor-pointer transition-colors"
                        onClick={(e) =>
                          handleAcceptFriendRequest(request.id, e)
                        }>
                        Accept
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hover:opacity-80 transition-opacity cursor-pointer">
          <Icon icon="fluent:chat-20-filled" width="36" height="36" />
        </div>
      </div>
    </nav>
  )
}
export default TopConsole
