export interface Phone {
  phoneId: number
  phoneNumber: string
  phoneType: string
  countryCode: string
  areaCode: string
  createdOn: string
  updatedOn: string
}

export interface PhonePost {
  phoneNumber: string
  phoneType: string
  studentId: number
  countryCode: string
  areaCode: string
}
