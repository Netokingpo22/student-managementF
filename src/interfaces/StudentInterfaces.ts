import type { Email } from './EmailInterfaces'
import type { Address } from './AddressInterfaces'
import type { Phone } from './PhoneInterfaces'

export interface Student {
  studentId: number
  firstName: string
  middleName: string
  lastName: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  emails: Email[]
  addresses: Address[]
  phones: Phone[]
  createdOn: string
  updatedOn: string
}

export interface StudentDTO {
  studentId: number
  fullName: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  hasEmails: boolean
  hasAddresses: boolean
  hasPhones: boolean
}

export interface StudentPost {
  firstName: string
  middleName: string
  lastName: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
}
