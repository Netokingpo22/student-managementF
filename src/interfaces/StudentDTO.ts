export interface StudentDTO {
  studentId: number
  firstName: string
  middleName: string
  lastName: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  hasEmails: boolean
  hasAddresses: boolean
  hasPhones: boolean
  createdOn: string
  updatedOn: string
}
