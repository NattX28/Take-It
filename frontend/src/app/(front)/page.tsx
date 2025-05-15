import { AuroraText } from "@/components/magicui/aurora-text"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"

import { Icon } from "@iconify/react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Take It",
  description: "take photo and share with friends",
}

const Home = () => {
  return (
    <>
      <main className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div>
            <h1 className="text-8xl text-center font-bold">
              {" "}
              <AuroraText>Take It!</AuroraText>{" "}
            </h1>
            <p className="text-2xl mt-4 text-main-mid">
              {" "}
              Share moment with your friends{" "}
            </p>
          </div>
          <div className="mt-12">
            <Link href="/login">
              <Button
                variant={`outline`}
                size={`lg`}
                className="group cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out hover:glass">
                Let's Take It!
                <span className="animate-wiggle group-hover:animate-wiggle">
                  <Icon
                    icon="mynaui:arrow-right-solid"
                    width="24"
                    height="24"
                  />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
export default Home
