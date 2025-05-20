import { Icon } from "@iconify/react"

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col justify-around h-full">
      <div>{children}</div>
      <div className="flex items-center justify-center p-4">
        <div className="flex gap-4 cursor-pointer">
          <span>
            <Icon icon="line-md:chevron-down" width="24" height="24" />
          </span>
          <p>History</p>
        </div>
      </div>
    </div>
  )
}
export default HomeLayout
