import type { Email } from '@/interfaces/Email'
import type { EmailPost } from '@/interfaces/EmailPost'

export class EmailService {
  static async addEmail(newEmailPost: EmailPost): Promise<Email> {
    const response = await fetch('http://localhost:8080/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newEmailPost.email,
        emailType: newEmailPost.emailType,
        student: {
          studentId: newEmailPost.studentId,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return await response.json()
  }

  static async deleteEmail(emailId: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/emails/${emailId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  }

  static async updateEmail(newEmailPost: EmailPost, emailId: number): Promise<Email> {
    const response = await fetch(`http://localhost:8080/emails/${emailId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newEmailPost.email,
        emailType: newEmailPost.emailType,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return await response.json()
  }
}
