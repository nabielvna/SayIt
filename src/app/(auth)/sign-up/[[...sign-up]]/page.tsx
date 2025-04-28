'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi'
import { FaGoogle, FaApple } from 'react-icons/fa'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign up</h1>
            <p className="text-gray-500">Create your account to get started</p>
          </div>
          
          <SignUp.Root>
            <SignUp.Step name="start" className='space-y-6'>
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
              
              {/* Form fields */}
              <div className="space-y-4">
                <Clerk.Field name="emailAddress">
                  <div className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Email address</Clerk.Label>
                    <Clerk.Input asChild>
                      <Input 
                        className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        placeholder="name@example.com"
                      />
                    </Clerk.Input>
                    <Clerk.FieldError className="text-rose-500 text-xs mt-1" />
                  </div>
                </Clerk.Field>

                <Clerk.Field name="password">
                  <div className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Password</Clerk.Label>
                    <div className="relative">
                      <Clerk.Input asChild>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full h-12 bg-gray-50 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 pr-10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                          placeholder="Create a password"
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

                <SignUp.Action submit asChild>
                  <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg mt-2">
                    Create account
                  </Button>
                </SignUp.Action>
                
                {/* Sign In Link */}
                <div className="text-center text-sm text-gray-500 pt-2">
                  Already have an account?{' '}
                  <Link
                    href="/sign-in"
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </SignUp.Step>

            {/* Email Verification Step */}
            <SignUp.Step name="verifications">
              <SignUp.Strategy name="email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                      <FiMail className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                    <p className="text-gray-500 mt-1">
                      We&apos;ve sent a verification code to your email
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

                  <SignUp.Action submit asChild>
                    <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg">
                      Verify email
                    </Button>
                  </SignUp.Action>
                </div>
              </SignUp.Strategy>

              {/* Phone Verification Step */}
              <SignUp.Strategy name="phone_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                      <FiPhone className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Check your phone</h2>
                    <p className="text-gray-500 mt-1">
                      We&apos;ve sent a verification code via SMS
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

                  <SignUp.Action submit asChild>
                    <Button className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg">
                      Verify phone
                    </Button>
                  </SignUp.Action>
                </div>
              </SignUp.Strategy>
            </SignUp.Step>
            <div id="clerk-captcha" />
          </SignUp.Root>
        </div>
      </div>
    </div>
  )
}