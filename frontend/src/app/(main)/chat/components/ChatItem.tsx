"use client"
import { ChatItemProps } from "@/types/interfaces"
import { useEffect, useState } from "react"

const ChatItem = ({
  name,
  lastMessage,
  unread,
  unreadCount = 0,
  time,
}: ChatItemProps) => {
  const [initials, setInitials] = useState<string>("")
  useEffect(() => {
    if (name) {
      const initial = name.substring(0, 2).toLowerCase()
      setInitials(initial)
    }
  }, [name])

  const getRandomColor = (str: string): string => {
    let hash: number = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const colors: string[] = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ]

    return colors[Math.abs(hash) % colors.length]
  }

  const avatarColor: string = getRandomColor(name)

  const truncateMessage = (message: string, maxLength: number = 35) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}`
      : message
  }

  return (
    <div className="glass w-full flex items-center justify-between p-3 rounded-full backdrop-blur-sm shadow-md cursor-pointer transition-transform ease-in-out duration-150 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-main-color font-medium ${avatarColor}`}>
          {initials}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-medium truncate ${
                unread ? "text-black" : "text-gray-900"
              }`}>
              {name}
            </span>
            {unread && (
              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
            )}
          </div>
          <span
            className={`text-sm truncate ${
              unread ? "text-gray-700 font-meduim" : "text-gray-600"
            }`}>
            {truncateMessage(lastMessage)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <div className="text-xs text-gray-500">{time}</div>
        {unread && unreadCount > 0 && (
          <div className="mt-1 min-w-[20px] h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-medium text-white px-1.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
    </div>
  )
}
export default ChatItem
