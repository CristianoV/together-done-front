import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetListShared } from '../../hooks/useList';
import { AiOutlineCheck, AiOutlineDelete } from 'react-icons/ai';

interface Item {
  item_id: number;
  item_name: string;
  is_completed: boolean;
}

interface List {
  list_id: number;
  list_name: string;
  items: Item[];
  user: {
    firstName: string;
    lastName: string;
  };
  updated_at: string;
  created_at: string;
}

export interface RootInterface {
  shared_list_id: number;
  list_id: number;
  user_id: number;
  shared_at: string;
  list: List;
}

const ListsContainer: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Estados para controle de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [listsPerPage] = useState(5); // Número de listas por página
  const { data } = useGetListShared(user?.id || '', currentPage, listsPerPage);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');

    if (!accessToken || !refreshToken) {
      navigate('/login');
    }

    if (user) {
      setUser(JSON.parse(user));
    }
  }, [navigate]);

  const lists = (data?.data as RootInterface[])?.map((item) => item.list) || [];
  const meta = data?.meta as {
    page: number;
    take: number;
    total: number;
    lastPage: number;
    isLastPage: boolean;
  };

  const handleNextPage = () => {
    if (!meta.isLastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='bg-white shadow-md rounded-lg p-8 w-full'>
        <h1 className='text-4xl font-bold text-center text-indigo-600 mb-6'>
          Suas Listas
        </h1>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-300'>
            <thead>
              <tr className='bg-indigo-600 text-white'>
                <th className='py-2 px-4 text-left'>Nome da Lista</th>
                <th className='py-2 px-4 text-left'>Total de Itens</th>
                <th className='py-2 px-4 text-left'>Itens Concluídos</th>
                <th className='py-2 px-4 text-left'>Criado por</th>
                <th className='py-2 px-4 text-left'>Atualizado em</th>
                <th className='py-2 px-4 text-left'>Criado em</th>
                {/* <th className='py-2 px-4 text-left'>Ações</th> */}
              </tr>
            </thead>
            <tbody>
              {lists.length > 0 ? (
                lists.map((list) => (
                  <tr
                    key={list.list_id}
                    className='hover:bg-indigo-50 transition duration-200 cursor-pointer'
                    onClick={() => navigate(`/list/${list.list_id}`)}
                  >
                    <td className='py-4 px-4'>{list.list_name}</td>
                    <td className='py-4 px-4'>
                      {list.items.length} item{list.items.length > 1 ? 's' : ''}
                    </td>
                    <td className='py-4 px-4'>
                      {list.items.filter((item) => item.is_completed).length}{' '}
                      item
                      {list.items.filter((item) => item.is_completed).length > 1
                        ? 's'
                        : ''}{' '}
                      concluído
                      {list.items.filter((item) => item.is_completed).length > 1
                        ? 's'
                        : ''}
                    </td>
                    <td className='py-4 px-4'>{list.user.firstName}</td>
                    <td className='py-4 px-4'>
                      {new Date(list.updated_at).toLocaleDateString()}
                    </td>
                    <td className='py-4 px-4'>
                      {new Date(list.created_at).toLocaleDateString()}
                    </td>
                    {/* <td className='py-4 px-4'>
                      <button className='text-indigo-600 hover:text-indigo-800'>
                        <AiOutlineCheck />
                      </button>
                      <button className='text-red-600 hover:text-red-800 ml-4'>
                        <AiOutlineDelete />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className='py-4 px-4 text-gray-500 text-center'
                  >
                    Nenhuma lista disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botões de paginação */}
        <div className='flex justify-between mt-4'>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50'
          >
            Anterior
          </button>
          <span className='self-center'>
            Página {currentPage} de {meta?.lastPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={meta?.isLastPage}
            className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50'
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListsContainer;
