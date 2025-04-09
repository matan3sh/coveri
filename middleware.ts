import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for protected routes (all routes except root, sign-in, and webhooks)
const isProtectedRoute = createRouteMatcher([
  '/((?!$|sign-in|api/webhooks).*)', // Match everything except root path, sign-in, and webhook routes
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that aren't the root path, sign-in, or webhooks
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api(?!/webhooks).*)', // Match all api routes except /api/webhooks
  ],
}
