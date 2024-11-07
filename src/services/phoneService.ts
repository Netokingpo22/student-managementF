import type { Phone, PhonePost } from '@/interfaces/PhoneInterfaces'

export class PhoneService {
  static async addPhone(newPhonePost: PhonePost): Promise<Phone> {
    const response = await fetch('http://localhost:8080/phones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: newPhonePost.phoneNumber,
        phoneType: newPhonePost.phoneType,
        countryCode: newPhonePost.countryCode,
        areaCode: newPhonePost.areaCode,
        student: {
          studentId: newPhonePost.studentId,
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

  static async updatePhone(newPhonePost: PhonePost, phoneId: number): Promise<Phone> {
    const response = await fetch(`http://localhost:8080/phones/${phoneId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: newPhonePost.phoneNumber,
        phoneType: newPhonePost.phoneType,
        countryCode: newPhonePost.countryCode,
        areaCode: newPhonePost.areaCode,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return await response.json()
  }
}
