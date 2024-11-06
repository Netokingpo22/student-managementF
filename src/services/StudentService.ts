import type { Student } from '@/interfaces/Student'

export class StudentService {
  static async fetchStudentDetails(studentId: any): Promise<Student | null> {
    try {
      const response = await fetch(`http://localhost:8080/students/${studentId}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching student details:', error)
      return null
    }
  }
}
