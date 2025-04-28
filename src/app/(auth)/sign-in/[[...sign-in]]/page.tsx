'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { FaGoogle, FaApple } from 'react-icons/fa'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState("password")

  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "password" ? "code" : "password")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full filter blur-[128px] opacity-60 animate-blob"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-violet-100 rounded-full filter blur-[128px] opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-1/4 right-1/4 w-1/2 h-1/2 bg-pink-100 rounded-full filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/60">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-500">Welcome back! Enter your details</p>
          </div>
          
          <SignIn.Root>
            <SignIn.Step name="start" className='space-y-6'>
              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <Clerk.Connection
                  name="google"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 transition-all shadow-sm"
                >
                  <FaGoogle className="text-lg text-blue-500" />
                  <span className="font-medium">Google</span>
                </Clerk.Connection>
                
                <Clerk.Connection
                  name="facebook"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 transition-all shadow-sm"
                >
                  <FaApple className="text-lg" />
                  <span className="font-medium">Apple</span>
                </Clerk.Connection>
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>
              
              {/* Email Input */}
              <Clerk.Field name="identifier">
                <div className="space-y-2">
                  <Clerk.Label className="block text-sm font-medium text-gray-700">Email</Clerk.Label>
                  <Clerk.Input asChild>
                    <Input 
                      className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      placeholder="name@example.com"
                    />
                  </Clerk.Input>
                  <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                </div>
              </Clerk.Field>
              
              {/* Password or Code based on state */}
              {authMethod === "password" ? (
                <Clerk.Field name="password">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Password</Clerk.Label>
                      <Button
                        variant="link"
                        className="text-xs text-violet-600 hover:text-violet-700 p-0 h-auto"
                        onClick={() => {
                          const elem = document.querySelector('[data-clerk-navigate="forgot-password"]');
                          if (elem) {
                            (elem as HTMLElement).click();
                          }
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Clerk.Input asChild>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 pr-10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          placeholder="Enter your password"
                        />
                      </Clerk.Input>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                    <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                  </div>
                </Clerk.Field>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
                    We&apos;ll send a secure login code to your email address
                  </div>
                </div>
              )}
              
              {/* Auth method toggle */}
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={toggleAuthMethod}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                >
                  {authMethod === "password" ? "Use email code instead" : "Use password instead"}
                </button>
              </div>
              
              {/* Sign In Button */}
              <SignIn.Action submit asChild>
                <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg">
                  {authMethod === "password" ? "Login" : "Send code"}
                </Button>
              </SignIn.Action>
              
              {/* Sign Up Link */}
              <div className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-violet-600 hover:text-violet-700 font-medium"
                >
                  Create account
                </Link>
              </div>
            </SignIn.Step>

            {/* Verification Step */}
            <SignIn.Step name="verifications">
              <SignIn.Strategy name="email_code">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                    <p className="text-gray-500 mt-1">
                      We sent a 6-digit code to <SignIn.SafeIdentifier />
                    </p>
                  </div>

                  <Clerk.Field name="code">
                    <div className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Verification code</Clerk.Label>
                      <Clerk.Input asChild>
                        <Input 
                          className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 text-center font-mono text-xl tracking-widest focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          maxLength={6}
                          placeholder="••••••"
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                    </div>
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg">
                      Verify
                    </Button>
                  </SignIn.Action>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                    onClick={() => {
                      const elem = document.querySelector('[data-clerk-navigate="start"]');
                      if (elem) {
                        (elem as HTMLElement).click();
                      }
                    }}
                  >
                    Back to login
                  </Button>
                </div>
              </SignIn.Strategy>
            </SignIn.Step>

            {/* Forgot Password Step */}
            <SignIn.Step name="forgot-password">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
                  <p className="text-gray-500 mt-1">
                    We&apos;ll send password reset instructions to your email
                  </p>
                </div>

                <SignIn.SupportedStrategy name="reset_password_email_code">
                  <SignIn.Action submit asChild>
                    <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg">
                      Send instructions
                    </Button>
                  </SignIn.Action>
                </SignIn.SupportedStrategy>

                <SignIn.Action navigate="start" asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    Back to login
                  </Button>
                </SignIn.Action>
              </div>
            </SignIn.Step>

            {/* Reset Password Step */}
            <SignIn.Step name="reset-password">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create new password</h2>
                  <p className="text-gray-500 mt-1">
                    Make sure it&apos;s at least 8 characters
                  </p>
                </div>

                <div className="space-y-4">
                  <Clerk.Field name="password">
                    <div className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">New password</Clerk.Label>
                      <div className="relative">
                        <Clerk.Input asChild>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 pr-10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            placeholder="New password"
                          />
                        </Clerk.Input>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                    </div>
                  </Clerk.Field>

                  <Clerk.Field name="confirmPassword">
                    <div className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Confirm password</Clerk.Label>
                      <div className="relative">
                        <Clerk.Input asChild>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                            placeholder="Confirm password"
                          />
                        </Clerk.Input>
                      </div>
                      <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                    </div>
                  </Clerk.Field>

                  <SignIn.Action submit asChild>
                    <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg mt-2">
                      Reset password
                    </Button>
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Step>
            <div id="clerk-captcha" />
          </SignIn.Root>
        </div>
      </div>
    </div>
  )
}
