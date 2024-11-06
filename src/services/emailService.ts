import type { Email } from '@/interfaces/Email'

export class EmailService {
  static async addEmail(studentId: number, email: string, emailType: string): Promise<Email> {
    const response = await fetch('http://localhost:8080/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        emailType: emailType,
        student: {
          studentId: studentId,
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
}
