import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (sort: SortBy) => void
  deleteUser: (email: string) => void
  users: User[]
}

export function UsersList ({ changeSorting, deleteUser, users }: Props) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Nombre ⇅</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>Apellido ⇅</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>País ⇅</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {
          users.map((user) => {
            return (
              <tr key={user.email}>
                <td>
                  <img src={user.picture.thumbnail} />
                </td>
                <td>
                  {user.name.first}
                </td>
                <td>
                {user.name.last}
                </td>
                <td>
                  {user.location.country}
                </td>
                <td>
                  <button onClick={() => {
                    deleteUser(user.email)
                  }}>Eliminar contato</button>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}
