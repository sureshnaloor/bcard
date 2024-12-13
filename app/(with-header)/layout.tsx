import { Suspense } from 'react'
import Header from '@/components/layout/Header'

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <main className="min-h-screen">
        {children}
      </main>
    </>
  )
} 