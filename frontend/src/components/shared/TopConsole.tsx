import { Icon } from "@iconify/react"

const TopConsole = () => {
  return (
    <nav className="w-full">
      <div className="flex justify-between items-center mt-4">
        <div>
          <Icon icon="cil:face" width="36" height="36" />
        </div>
        <div>dropdown</div>
        <div>
          <Icon icon="fluent:chat-20-filled" width="36" height="36" />
        </div>
      </div>
    </nav>
  )
}
export default TopConsole
