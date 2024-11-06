// src/services/addressService.ts
import type { Address } from '@/interfaces/Address'

export class AddressService {
  static async addAddress(
    studentId: number,
    street: string,
    city: string,
    state: string,
    zipCode: string,
  ): Promise<Address> {
    const response = await fetch('http://localhost:8080/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        street: street,
        city: city,
        state: state,
        zipCode: zipCode,
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

  static async deleteAddress(addressId: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/addresses/${addressId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  }
}
