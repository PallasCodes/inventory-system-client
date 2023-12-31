import { AxiosError, AxiosResponse } from 'axios'
import { Message, MessageComponent, MessageType } from 'src/utils/Message'
import { useLogoutUser } from 'src/modules/auth/composables/login.composable'

export interface AxiosCustomResponse extends AxiosResponse {
  data: {
    responseData: any
    message: {
      message: string
      component: MessageComponent
      type: MessageType
    }
    error: boolean
  }
}

interface HttpResponse {
  data: any
  error: boolean
  message?: Message
  requestTime?: number | string
  status: number | string
  statusText: string
}

export async function handleRequest(
  fn: (...fnArgs: any) => Promise<AxiosCustomResponse>,
  ...args: any
): Promise<HttpResponse> {
  if (!fn) throw new Error('No function was given')

  const responseObj: HttpResponse = {
    data: {},
    error: false,
    requestTime: 0,
    status: 0,
    statusText: '',
  }

  const startTime = new Date()

  try {
    const response = await fn(...args)

    console.log(response)

    const endTime = new Date()

    responseObj.data = response.data.responseData
    responseObj.requestTime = msToHours(+endTime - +startTime)
    responseObj.error = response.data.error
    responseObj.message = new Message(response.data.message)
    responseObj.status = response.status
    responseObj.statusText = response.statusText

    return responseObj
  } catch (error: AxiosError | any) {
    console.log(error)

    if (error.request.status) {
      console.log('logout')
    }

    useLogoutUser()

    return {
      data: null,
      error: true,
      message: handleRequestError(error),
      status: 400,
      statusText: 'Error',
    }
  }
}

function msToHours(millisencods: number): string {
  const hours = Math.floor(millisencods / 3600000)
  const minutes = Math.floor(millisencods / 60000)
  const seconds = ((millisencods % 60000) / 1000).toFixed(0)
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
    +seconds < 10 ? '0' : ''
  }${seconds}`
}

function handleRequestError(error: any) {
  const message = new Message({
    component: MessageComponent.DIALOG,
    message: 'Ocurrió un error, inténtalo más tarde',
    type: MessageType.ERROR,
  })

  return message
}
