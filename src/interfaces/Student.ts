import type { Email } from './Email'
import type { Address } from './Address'
import type { Phone } from './Phone'

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
