'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ComponentType, JSX } from 'react'
import { Spinner } from '@/app/components/ui/shadcn-io/spinner'

export function withAuth<T extends JSX.IntrinsicAttributes> (Component: ComponentType<T>) {
  return function AuthenticatedComponent (props: T) {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') {
      return (
        <div className='flex flex-col items-center pt-24 text-center mt-60'>
          <Spinner height={70} width={70} />
        </div>
      )
    }
    if (session == null) router.push('/')
    console.warn(session)

    return (session != null) ? <Component {...props} /> : null
  }
}
