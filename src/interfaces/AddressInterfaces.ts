export interface Address {
  addressId: number
  street: string
  city: string
  state: string
  zipCode: string
}

export interface AddressPost {
  street: string
  studentId: number
  city?: string
  state?: string
  zipCode?: string
}
