"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "@/lib/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"

const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuthStore()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    try {
      await login(values.username, values.password)
      router.push("/home")
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center sm:w-full xl:w-1/2 gap-2 sm:gap-4 lg:gap-6">
        {/* username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* remember me */}

        <Button
          variant={"secondary"}
          size={"lg"}
          className="glass mt-8 md:mt-6 lg:mt-4 xl:mt-2 w-1/2 hover:cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out hover:glass"
          type="submit">
          Login
        </Button>
      </form>
    </Form>
  )
}
export default LoginForm
