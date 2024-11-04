import { useParams } from 'react-router-dom';
import {
  useAddList,
  useDeleteItem,
  useGetListUnique,
  useUpdateItem,
  useUpdateItemStatus,
} from '../../hooks/useList';
import { useEffect, useState } from 'react';

const ListContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, mutate } = useGetListUnique(id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [itemToEdit, setItemToEdit] = useState<number | null>(null);
  const [responsibleUser, setResponsibleUser] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { addList } = useAddList(id || '');
  const { deleteItem } = useDeleteItem(id || '');
  const { updateItem } = useUpdateItem(id || '');
  const { updateItemStatus } = useUpdateItemStatus(id || '');

  useEffect(() => {
    if (data) {
      mutate();
    }
  }, [id, mutate, data]);

  if (error)
    return <div className='text-red-600'>Erro ao carregar a lista.</div>;
  if (!data) return <div>Carregando...</div>;

  const list = data;

  if (!list) return <div>Lista não encontrada.</div>;

  const handleCreateItem = async () => {
    try {
      await addList({
        item_name: newItemName,
        is_completed: false,
        responsible_id: 4,
      });

      setNewItemName('');
      setResponsibleUser('');
      setIsModalOpen(false);

      mutate();

      setSuccessMessage('Item criado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao criar item:', error);
      setSuccessMessage('Erro ao criar item. Tente novamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteItem(itemId);

      mutate();

      setSuccessMessage('Item excluído com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setErrorMessage('Erro ao excluir item. Tente novamente.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleUpdateStatus = async (itemId: number) => {
    try {
      await updateItemStatus(itemId);

      mutate();

      setSuccessMessage('Item atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      setErrorMessage('Erro ao atualizar item. Tente novamente.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleEditItem = async () => {
    try {
      await updateItem({
        item_id: itemToEdit || 0,
        item_name: newItemName,
        is_completed: false,
        responsible_id: 4,
      });

      mutate();

      setSuccessMessage('Item editado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao editar item:', error);
      setErrorMessage('Erro ao editar item. Tente novamente.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setNewItemName('');
      setItemToEdit(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full'>
        <h1 className='text-4xl font-bold text-center text-indigo-600 mb-6'>
          {list.list_name}
        </h1>
        {successMessage && (
          <div className='bg-green-100 text-green-700 py-2 px-4 rounded mb-4'>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className='bg-red-100 text-red-700 py-2 px-4 rounded mb-4'>
            {errorMessage}
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <p className='text-gray-700'>
            <strong>Criado por:</strong>{' '}
            <span className='font-medium'>
              {list.user.firstName} {list.user.lastName}
            </span>
          </p>
          <p className='text-gray-700'>
            <strong>Tipo:</strong>{' '}
            <span className='font-medium'>{list.list_type}</span>
          </p>
          <p className='text-gray-700'>
            <strong>Data de Criação:</strong>{' '}
            <span className='font-medium'>
              {new Date(list.created_at).toLocaleString()}
            </span>
          </p>
          <p className='text-gray-700'>
            <strong>Última Atualização:</strong>{' '}
            <span className='font-medium'>
              {new Date(list.updated_at).toLocaleString()}
            </span>
          </p>
        </div>

        <table className='min-w-full bg-white mt-8'>
          <thead className='bg-indigo-600 text-white'>
            <tr>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-left'>
                Nome do Item
              </th>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-left'>
                Responsável
              </th>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-left'>
                Última Atualização
              </th>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-left'>
                Criado Em
              </th>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-left'>
                Status
              </th>
              <th className='py-3 px-4 border-b-2 border-indigo-400 text-center'>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {list.items.map(
              (item: {
                item_id: number;
                item_name: string;
                user: { firstName: string; lastName: string };
                updated_at: string;
                created_at: string;
                is_completed: boolean;
              }) => (
                <tr key={item.item_id} className='hover:bg-gray-100'>
                  <td className='py-2 px-4 border-b text-left'>
                    {item.item_name}
                  </td>
                  <td className='py-2 px-4 border-b text-left'>
                    {item.user?.firstName} {item.user?.lastName}
                  </td>
                  <td className='py-2 px-4 border-b text-left'>
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className='py-2 px-4 border-b text-left'>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className='py-2 px-4 border-b text-left'>
                    <span
                      className={
                        item.is_completed
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {item.is_completed ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                  <td className='py-2 px-4 border-b text-center flex justify-center space-x-2'>
                    <button
                      className='bg-indigo-600 text-white py-1 px-2 rounded hover:bg-indigo-700 w-20'
                      onClick={
                        () => {
                          console.log({
                            item_id: item.item_id,
                            item_name: item.item_name,
                          });
                          
                          setNewItemName(item.item_name);
                          setItemToEdit(item.item_id);
                          setIsEditModalOpen(true);
                        } // Abre o modal de edição
                      }
                    >
                      Editar
                    </button>
                    {item.is_completed ? (
                      <button
                        className='bg-yellow-600 text-white py-1 px-2 rounded hover:bg-yellow-700 w-20'
                        onClick={() => handleUpdateStatus(item.item_id)}
                      >
                        Reabrir
                      </button>
                    ) : (
                      <button
                        className='bg-green-600 text-white py-1 px-2 rounded hover:bg-green-700 w-20'
                        onClick={() => handleUpdateStatus(item.item_id)}
                      >
                        Concluir
                      </button>
                    )}
                    <button
                      className='bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 w-20'
                      onClick={() => handleDeleteItem(item.item_id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <button
          className='mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700'
          onClick={() => setIsModalOpen(true)}
        >
          Criar Novo Item
        </button>

        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg p-6 w-1/3'>
              <h2 className='text-xl font-bold mb-4'>Criar Novo Item</h2>
              <div className='mb-4'>
                <label className='block text-gray-700'>Nome do Item:</label>
                <input
                  type='text'
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className='border rounded w-full py-2 px-3'
                  placeholder='Digite o nome do item'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700'>Responsável:</label>
                <input
                  type='text'
                  value={responsibleUser}
                  onChange={(e) => setResponsibleUser(e.target.value)}
                  className='border rounded w-full py-2 px-3'
                  placeholder='Digite o nome do responsável'
                />
              </div>
              <div className='flex justify-between'>
                <button
                  className='bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400'
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700'
                  onClick={handleCreateItem}
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        )}
        {isEditModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-5 rounded shadow-lg w-96'>
              <h2 className='text-lg font-bold mb-4'>Editar Item</h2>
              <input
                type='text'
                className='border border-gray-300 rounded w-full p-2 mb-4'
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)} // Atualiza o nome do item em edição
              />
              <button
                className='bg-blue-600 text-white px-4 py-2 rounded'
                onClick={handleEditItem}
              >
                Salvar
              </button>
              <button
                className='bg-gray-300 text-black px-4 py-2 rounded ml-2'
                onClick={() => setIsEditModalOpen(false)} // Fecha o modal
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListContainer;
