import type { Student } from '@/interfaces/Student'
import type { StudentPost } from '@/interfaces/StudentPost'

export class StudentService {
  static async createStudent(studentData: StudentPost): Promise<Student> {
    try {
      const response = await fetch('http://localhost:8080/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      })

      if (!response.ok) {
        throw new Error('Failed to create student')
      }

      const createdStudent: Student = await response.json()
      return createdStudent
    } catch (error) {
      console.error('Error creating student:', error)
      throw error
    }
  }

  static async fetchStudentDetails(studentId: number): Promise<Student | null> {
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

  static async updateStudent(studentId: number, studentData: Student): Promise<Student | null> {
    console.log(
      JSON.stringify({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        middleName: studentData.middleName,
        gender: studentData.gender,
      }),
    )
    try {
      const response = await fetch(`http://localhost:8080/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          middleName: studentData.middleName,
          gender: studentData.gender,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update student details')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating student:', error)
      return null
    }
  }

  static async deleteStudent(studentId: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:8080/students/${studentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete student')
      }
      return true
    } catch (error) {
      console.error('Error deleting student:', error)
      return false
    }
  }
}
