import LoginForm from "./components/LoginForm"
import Link from "next/link"

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-8">
      <h1 className="text-4xl font-bold">Login</h1>
      <LoginForm />
      <p className="text-sm">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-campfire-orange hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
export default LoginPage
