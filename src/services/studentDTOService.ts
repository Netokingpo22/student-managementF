import type { StudentDTO } from '@/interfaces/StudentInterfaces'

export class StudentDTOService {
  static async fetchStudents(): Promise<StudentDTO[]> {
    try {
      const response = await fetch('http://localhost:8080/students')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  }
}
