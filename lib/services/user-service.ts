export interface DatabaseUser {
  id: string
  clerkUserId: string
  email: string
  credits: number
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  static async syncUser(): Promise<DatabaseUser> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to sync user')
    }

    return response.json()
  }

  static async getUserByClerkId(): Promise<DatabaseUser | null> {
    const response = await fetch('/api/users')

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }
}
