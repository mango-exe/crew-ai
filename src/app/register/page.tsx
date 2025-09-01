'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

import { SERVER } from '@/lib/global/config'
import { signUpSchema } from '@/lib/validation/signup-schema'

export default function SignUp () {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValid, setIsValid] = useState(false)

  // 🔹 validate fields on every change
  useEffect(() => {
    const result = signUpSchema.safeParse({ email, password, confirmPassword })
    if (!result.success) {
      const formatted: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formatted[err.path[0].toString()] = err.message
        }
      })
      setErrors(formatted)
      setIsValid(false)
    } else {
      setErrors({})
      setIsValid(true)
    }
  }, [email, password, confirmPassword])

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${SERVER}/api/auth/credentials/register`, {
        email,
        password
      })

      if (response.status === 201) {
        router.push('/login')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <div className='flex flex-col items-center pt-24 text-center mt-60'>
      <Card className='w-[40vw] glass-surface rounded-xl'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-3'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className='text-red-400 text-sm'>{errors.email}</span>}
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className='text-red-400 text-sm'>{errors.password}</span>}
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <span className='text-red-400 text-sm'>{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex-col gap-2'>
          <Button className='w-full' onClick={handleSignUp} disabled={!isValid}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
