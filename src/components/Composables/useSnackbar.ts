import { ref } from 'vue'

export function useSnackbar() {
  const snackbarVisible = ref(false)
  const snackbarMessage = ref('')
  const snackbarColor = ref('green')

  const showSnackbar = (message: string, color: string = 'green') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbarVisible.value = true
  }

  const hideSnackbar = () => {
    snackbarVisible.value = false
  }

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarColor,
    showSnackbar,
    hideSnackbar,
  }
}
