import TopConsole from "@/components/shared/TopConsole"

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <main className="mx-auto h-screen lg:w-1/2 xl:w-1/4">{children}</main>
}

export default UserLayout
