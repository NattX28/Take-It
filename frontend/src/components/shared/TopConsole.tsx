"use client"
import { Icon } from "@iconify/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

import Link from "next/link"
import { redirect, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  ApiResponse,
  Friendship,
  PendingRequest,
  User,
} from "@/types/interfaces"
import {
  acceptFriendRequest,
  getFriends,
  getPendingfriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/services/user"
import { logout } from "@/services/auth"
import { useAuthStore } from "@/stores/authStore"

// mock friend requests

const TopConsole = () => {
  const pathName = usePathname()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("everyone")
  const [pendingRequests, setPendingRequests] = useState<PendingRequest | null>(
    null
  )
  const [friendUsername, setFriendUsername] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const fetchFriends = async () => {
    try {
      const response: ApiResponse<User[]> = await getFriends()
      if (response.data) {
        setUsers(response.data)
      } else {
        setError(response.error || "failed to get friends")
      }
    } catch (error) {
      const err = error as Error
      console.error("Error get friend:", err)
      setError("Something went wrong while get friends :(")
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const response: ApiResponse<PendingRequest> =
        await getPendingfriendRequest()
      if (response.data) {
        setPendingRequests(response.data)
      }
    } catch (error) {
      const err = error as Error
      console.error("Error get pending friend requests", err)
      setError("Something went wrong while get pending friend requests :(")
    }
  }

  const addFriend = async (username: string) => {
    try {
      const response: ApiResponse<Friendship> = await sendFriendRequest(
        username
      )
      if (response.data) {
        //
      } else {
        //
      }
    } catch (error) {
      const err = error as Error
      console.error("Error add friend: ", err)
      setError("Something went wrong while add friend")
    }
  }

  // function for accepting friend request
  const handleAcceptFriendRequest = async (
    requesterId: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault() // prevent redirect
    e.stopPropagation() // prevent closing dropdown

    try {
      const response: ApiResponse<Friendship> = await acceptFriendRequest(
        requesterId
      )

      if (response.data) {
        setPendingRequests((prev) =>
          prev
            ? {
                ...prev,
                incoming: prev.incoming.filter(
                  (request) => request.user.id !== requesterId
                ),
              }
            : null
        )
        await fetchFriends()
      } else {
        setError(response.error || "failed to accept friend")
      }
    } catch (error) {
      const err = error as Error
      console.error("Error accept friend: ", err)
      setError("Something went wrong while accept friend")
    }
  }

  // function for rejecting friend request
  const handleRejectFriendRequest = async (
    requesterId: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const response: ApiResponse<Friendship> = await rejectFriendRequest(
        requesterId
      )
      if (response.data) {
        setPendingRequests((prev) =>
          prev
            ? {
                ...prev,
                incoming: prev.incoming.filter(
                  (request) => request.user.id !== requesterId
                ),
              }
            : null
        )
      } else {
        setError(response.error || "failed to reject friend")
      }
    } catch (error) {}
  }

  // when web load, check URL for set selectedUser correctly
  useEffect(() => {
    if (pathName === "/" || pathName === "/home") {
      setSelectedUser("everyone")
    } else if (pathName.startsWith("/gallery/")) {
      const userId = parseInt(pathName.split("/gallery/")[1])
      const user = users.find((u) => u.id === userId)
      if (user) {
        setSelectedUser(user.username)
      }
    }
  }, [pathName, users])

  useEffect(() => {
    fetchFriends()
    fetchPendingRequests()
  }, [])

  const handleUsesrSelect = (userName: string, userId?: number) => {
    setSelectedUser(userName)

    if (userName === "everyone") {
      router.push("/home")
    } else {
      router.push(`/gallery/${userId}`)
    }
  }

  const handleLogout = async () => {
    await logout()
    useAuthStore.getState().logout()
    redirect("/")
  }

  return (
    <nav className="w-full transition-all duration-300">
      <div className="flex justify-between items-center mt-4">
        <div className="hover:opacity-80 transition-opacity">
          <Link href={`/gallery`}>
            <button className="flex flex-col items-center cursor-pointer">
              <Icon icon="solar:gallery-wide-bold" width="36" height="36" />
            </button>
          </Link>
        </div>
        {/* Dropdown */}

        <Popover>
          <PopoverTrigger asChild>
            <Button className="space-x-1 glass rounded-full gap-1" size={"lg"}>
              <Icon icon="mdi:chevron-down" width="24" height="24" />
              <span>{selectedUser}</span>
              {pendingRequests?.incoming &&
                pendingRequests.incoming.length > 0 && (
                  <Badge
                    className="rounded-full bg-amber-400"
                    variant="destructive">
                    {pendingRequests.incoming.length}
                  </Badge>
                )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="min-w-64 max-w-64 md:max-w-72 rounded-2xl glass"
            align="center">
            {/* รายชื่อ users */}
            <div className="space-y-1">
              <button
                onClick={() => handleUsesrSelect("everyone")}
                className={`w-full text-left px-3 py-2 rounded-xl cursor-pointer ${
                  selectedUser === "everyone" ? "glass-dark" : "hover:glass"
                }`}>
                <Icon icon="mdi:account-group" className="mr-2 inline" />
                everyone
              </button>

              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center rounded-xl px-2 group ${
                    selectedUser === user.username
                      ? "glass-dark"
                      : "hover:glass"
                  }`}>
                  <button
                    onClick={() => handleUsesrSelect(user.username, user.id)}
                    className={`w-full text-left py-2 cursor-pointer`}>
                    <Icon
                      icon="mdi:account"
                      width="20"
                      className="mr-2 inline"
                    />
                    {user.username}
                  </button>

                  {/* direct message */}
                  <Link
                    href={`/chat/${user.id}`}
                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="ri:chat-ai-fill" width="24" height="24" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Friend Requests */}
            {pendingRequests?.incoming &&
              pendingRequests.incoming.length > 0 && (
                <>
                  <hr className="my-2 border-gray-300" />
                  <div className="text-sm font-semibold mb-1">
                    Friend Requests
                  </div>
                  {pendingRequests.incoming.map((request) => (
                    <div
                      key={request.friendshipId}
                      className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{request.user?.username}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-6 px-2 text-xs bg-green-500 hover:bg-green-600"
                          onClick={(e) =>
                            handleAcceptFriendRequest(request.user.id, e)
                          }>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          className="h-6 px-2 text-xs bg-red-500 hover:bg-red-600"
                          onClick={(e) =>
                            handleRejectFriendRequest(request.user.id, e)
                          }>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}

            {/* Add Friend */}
            <hr className="my-3 border-gray-300" />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add someone special"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl glass-dark text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <Button
                size="icon"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  if (friendUsername.trim()) {
                    addFriend(friendUsername.trim())
                    setFriendUsername("")
                  }
                }}>
                <Icon
                  icon="ic:baseline-person-add"
                  className="text-white"
                  width={20}
                  height={20}
                />
              </Button>
            </div>
            <hr className="my-3 border-gray-300" />
            {/* logout button */}
            <Button
              size="lg"
              className="w-full glass-campfire hover:glass-campfire cursor-pointer"
              onClick={handleLogout}>
              <Icon icon="mdi:logout" className="mr-2" width={20} height={20} />
              Logout
            </Button>
          </PopoverContent>
        </Popover>

        {/* Chat */}
        <Link href={`/chat`}>
          <div className="hover:opacity-80 transition-opacity cursor-pointer">
            <Icon icon="fluent:chat-20-filled" width="36" height="36" />
          </div>
        </Link>
      </div>
    </nav>
  )
}
export default TopConsole
