'use client'
import React, { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import Link from 'next/link'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

import GoogleIcon from "../components/icons/GoogleIcon"

import { signIn } from 'next-auth/react'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleCredentialsLogin = async () => {
    try {
      await signIn('credentials', { email, password, redirect: true, callbackUrl: '/chat'})
    } catch(e) {
      console.warn(e)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { redirect: true, callbackUrl: '/chat'})
    } catch(e) {
      console.warn(e)
    }
  }

  return (
    <div className="flex flex-col items-center pt-24 text-center mt-60">
        <Card className="w-[40vw] glass-surface rounded-xl">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link href='/register'>Sign Up</Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value) } required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={handleCredentialsLogin}>
              Login
            </Button>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <GoogleIcon /> Login with Google
            </Button>
          </CardFooter>
        </Card>
    </div>
  )
}
