import { useUserQuery } from '../../api/userQuery'

export const User = () => {
  const { data, isLoading } = useUserQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='card w-96 bg-accent-content'>
      <div className='card-body'>
        <ul className='list'>
          <li className='list-item'>
            <div className='flex justify-between'>
              <span>ID</span>
              <span>{data?.id}</span>
            </div>
            <div className='flex justify-between'>
              <span>Email</span>
              <span>{data?.email}</span>
            </div>
            <div className='flex justify-between'>
              <span>Username</span>
              <span>{data?.username}</span>
            </div>
            <div className='flex justify-between'>
              <span>Nickname</span>
              <span>{data?.nickname}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
