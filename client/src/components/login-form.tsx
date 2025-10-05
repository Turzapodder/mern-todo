import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import apiService from "../services/api"
import type { LoginRequest } from "../types" 

interface LoginResponseData {
  token: string;
  user: any;
}

type LoginAPIResponse = {
  success: boolean;
  message?: string;
  data?: LoginResponseData;
} | {
  success: false;
  message: string;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  className?: string;
  onSuccess?: (token: string, user: any) => void
  onError?: (error: string) => void
}

export function LoginForm({ className, onSuccess, onError, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const credentials: LoginRequest = {
        email: data.email,
        password: data.password,
      }

      const response = await apiService.login(credentials) as LoginAPIResponse
      if (response.success) {
        
        const token = response.data?.token;
        const user = response.data?.user;  
        
        if (token && user) {
            // Success: Token and user data are present
            apiService.setToken(token);
            toast.success(response.message || "Logged in successfully"); 
            onSuccess?.(token, user);
        } else {
            const structuralErrorMessage = "API Error: Login successful, but response is missing 'token' or 'user' under the 'data' field.";
            throw new Error(structuralErrorMessage);
        }

      } else {
        // Server-side logical failure (e.g., Invalid credentials, user not found)
        const errorMessage = response.message || "Invalid credentials or login failed.";
        toast.error(errorMessage);
        onError?.(errorMessage);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected network error occurred."
      toast.error(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" {...register("password")} disabled={isLoading} />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
