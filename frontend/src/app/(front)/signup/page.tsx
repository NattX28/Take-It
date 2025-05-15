import Link from "next/link"
import SignupForm from "./components/SignupForm"

const SingupPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-8">
      <h1 className="text-4xl font-bold">Sign Up</h1>
      <SignupForm />
      <p className="text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-campfire-orange hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
export default SingupPage
