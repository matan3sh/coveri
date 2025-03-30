import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for protected routes (all routes except root and sign-in)
const isProtectedRoute = createRouteMatcher([
  '/((?!$|sign-in).*)', // Match everything except root path and sign-in
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that aren't the root path or sign-in
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
