"use client"

import FeedComponent from "./components/FeedComponent"

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* 📸 กล้อง */}
      <div className="h-screen snap-start">{children}</div>

      {/* 🖼️ Feed */}
      <div className="h-screen snap-start">
        <FeedComponent />
      </div>
    </div>
  )
}

export default HomeLayout
