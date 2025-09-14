'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ComponentType, PropsWithChildren } from 'react'
import { Spinner } from '@/app/components/ui/shadcn-io/spinner'

export function withAuth<P extends object> (
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') {
      return (
        <div className='flex flex-col items-center pt-24 text-center mt-60'>
          <Spinner height={70} width={70} />
        </div>
      )
    }

    if (session == null) {
      router.push('/')
      return null
    }

    return <WrappedComponent {...props} />
  }

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return AuthenticatedComponent
}
