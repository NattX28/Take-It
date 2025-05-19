import { Icon } from "@iconify/react"
import TopConsole from "@/components/shared/TopConsole"

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="mx-auto h-screen lg:w-1/2 xl:w-1/4">
      <div className="flex flex-col justify-between h-full">
        <TopConsole />
        <div className="">{children}</div>
        <div className="flex items-center justify-center p-4">
          <div className="flex gap-4 cursor-pointer">
            <span>
              <Icon icon="line-md:chevron-down" width="24" height="24" />
            </span>
            <p>History</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default UserLayout
