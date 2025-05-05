import { useQuery } from '@tanstack/react-query'
import { Api } from '../../Api'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface QueryParams {}

type QueryKey = [string, QueryParams]

export const getUser = async () => {
  const api = new Api()

  const user = await api.user.userList()

  return await user.data
}

export const useUserQuery = () => {
  return useQuery({
    queryKey: getUserQueryKey(),
    queryFn: getUser
  })
}

export const getUserQueryKey = (): QueryKey => ['user', {}]
