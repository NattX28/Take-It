import TopConsole from "@/components/shared/TopConsole"

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="mx-auto h-screen lg:w-1/2 xl:w-1/4 flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <TopConsole />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </main>
  )
}

export default UserLayout
