export interface StudentDTO {
  studentId: number
  fullName: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  hasEmails: boolean
  hasAddresses: boolean
  hasPhones: boolean
}
