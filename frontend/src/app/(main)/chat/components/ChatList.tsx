import { ScrollArea } from "@/components/ui/scroll-area"
import ChatItem from "./ChatItem"

// mock data
const messages = [
  { name: "tencha14", lastMessage: "สวัสดีครับ!", unread: true, time: "12:45" },
  {
    name: "mookzii",
    lastMessage: "ถึงบ้านยังงง",
    unread: false,
    time: "12:50",
  },
  {
    name: "johnnyx",
    lastMessage: "ไว้คุยกันพรุ่งนี้",
    unread: true,
    time: "13:10",
  },
  {
    name: "fah_sky",
    lastMessage: "นัดบ่ายสองนะ",
    unread: false,
    time: "13:15",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
  {
    name: "kawinha",
    lastMessage: "ส่งไฟล์ให้แล้วนะ",
    unread: true,
    time: "13:30",
  },
]

const ChatList = () => {
  return (
    <ScrollArea className="h-full mt-6">
      <div className="flex flex-col gap-3 p-1">
        {messages.map((msg, i) => (
          <ChatItem
            key={i}
            name={msg.name}
            lastMessage={msg.lastMessage}
            unread={msg.unread}
            time={msg.time}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
export default ChatList
