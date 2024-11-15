import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetListShared, useCreateList } from '../../hooks/useList';

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
  const [listsPerPage] = useState(10);
  const { data } = useGetListShared(user?.id || '', currentPage, listsPerPage);

  // Estados para criar uma nova lista
  const [newListName, setNewListName] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { createList } = useCreateList();

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

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      setCreateError('O nome da lista não pode estar vazio.');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await createList(newListName, false, Number(user?.id));
      setNewListName('');
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      setCreateError('Ocorreu um erro ao criar a lista.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='bg-white shadow-md rounded-lg p-8 w-full'>
        <h1 className='text-4xl font-bold text-center text-indigo-600 mb-6'>
          Suas Listas
        </h1>

        {/* Criar nova lista */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-indigo-600 mb-4'>
            Criar Nova Lista
          </h2>
          <div className='flex items-center gap-4'>
            <input
              type='text'
              placeholder='Nome da nova lista'
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className='flex-grow border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-indigo-500'
            />
            <button
              onClick={handleCreateList}
              disabled={isCreating}
              className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50'
            >
              {isCreating ? 'Criando...' : 'Criar'}
            </button>
          </div>
          {createError && <p className='text-red-500 mt-2'>{createError}</p>}
        </div>

        {/* Lista de listas */}
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

      {/* Modal de sucesso */}
      {showSuccessModal && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
          role='dialog'
          aria-labelledby='modal-title'
          aria-describedby='modal-description'
        >
          <div className='bg-white p-6 rounded-lg shadow-2xl transform transition-transform scale-100'>
            <h2
              id='modal-title'
              className='text-2xl font-bold mb-4 text-green-600 text-center'
            >
              Lista criada com sucesso!
            </h2>
            <p
              id='modal-description'
              className='text-gray-600 text-center mb-6'
            >
              Sua nova lista foi criada e está pronta para ser utilizada.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsContainer;
