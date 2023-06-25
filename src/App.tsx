import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'
import axios from 'axios';

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [ascending, setAscending] = useState(true);

  // useRef se usa para guardar un valor que se comparte entre renderizados pero que al cambiar, no vuelva a renderizar todo el componente
  const originalUsers = useRef<User[]>([])

  // Esto lo que hace es recuperar los contactos eliminados, no altera el orden ni la búsqueda por país
  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email)
    setUsers(filteredUsers)
  }

  const handleChangeSort = (sort: SortBy) => {
    setAscending(prevAscending => {
      console.log(prevAscending)
      if (prevAscending && sorting === sort) {
        return false;
      } else {
        return true;
      }
    });
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(async res => await res.json())
      .then(res => {
        setUsers(res.results)
        originalUsers.current = res.results
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const filteredUsers = useMemo(() => {
    return filterCountry != null && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry, ascending])

  const sortedUsers = useMemo(() => {
  if (sorting === SortBy.NONE) return filteredUsers;

  const compareProperties: Record<string, (user: User) => any> = {
    [SortBy.COUNTRY]: user => user.location.country,
    [SortBy.NAME]: user => user.name.first,
    [SortBy.LAST]: user => user.name.last
  };

  const extractProperty = compareProperties[sorting];
  let sortedArray = filteredUsers.sort((a, b) => {
    return extractProperty(a).localeCompare(extractProperty(b));
  });

  return ascending? sortedArray : sortedArray.reverse();
}, [filteredUsers, sorting, ascending]);


  return (
    <div className="App">
      <header>
        <button onClick={handleReset}>
          Reiniciar listado
        </button>

        <input placeholder='Filtra por país' onChange={(e) => {
          setFilterCountry(e.target.value)
        }} />

      </header>
      <main>
        <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App
