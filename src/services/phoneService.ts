import type { Phone } from '@/interfaces/Phone'

export class PhoneService {
  static async addPhone(
    studentId: number,
    phoneNumber: string,
    phoneType: string,
    countryCode: string,
    areaCode: string,
  ): Promise<Phone> {
    const response = await fetch('http://localhost:8080/phones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        phoneType: phoneType,
        countryCode: countryCode,
        areaCode: areaCode,
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

  static async deletePhone(phoneId: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/phones/${phoneId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  }
}
