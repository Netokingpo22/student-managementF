import type { Address } from '@/interfaces/Address'
import type { AddressPost } from '@/interfaces/AddressPost'

export class AddressService {
  static async addAddress(newAddress: AddressPost): Promise<Address> {
    const response = await fetch('http://localhost:8080/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        street: newAddress.street,
        city: newAddress.city,
        zipCode: newAddress.zipCode,
        state: newAddress.state,
        student: {
          studentId: newAddress.studentId,
        },
      }),
    })
    if (!response.ok) throw new Error('Failed to add address')
    return await response.json()
  }

  static async updateAddress(updatedAddress: AddressPost): Promise<Address> {
    const response = await fetch(`http://localhost:8080/addresses/${updatedAddress.studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        street: updatedAddress.street,
        city: updatedAddress.city,
        zipCode: updatedAddress.zipCode,
        state: updatedAddress.state,
      }),
    })
    if (!response.ok) throw new Error('Failed to update address')
    return await response.json()
  }

  static async deleteAddress(addressId: number): Promise<void> {
    const response = await fetch(`http://localhost:8080/addresses/${addressId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete address')
  }
}
