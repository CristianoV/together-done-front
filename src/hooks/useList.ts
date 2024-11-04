import useSWR from 'swr';
import { getRequest } from './FEATCH/getRequest';
import { sendRequest } from './FEATCH/sendRequest';
import { deleteRequest } from './FEATCH/deleteRequest';
import { patchRequest } from './FEATCH/patchRequest';
import useSWRMutation from 'swr/mutation';

export interface PayloadNewItemList {
  item_id?: number;
  item_name: string;
  is_completed: boolean;
  responsible_id: number;
}

// Hook para obter listas
export const useGetList = () => {
  const { data, error, mutate } = useSWR('/api/lists', getRequest);
  return { data, error, mutate };
};

// Hook para obter listas compartilhadas
export const useGetListShared = (id: string, page: number, take: number) => {
  const { data, error, mutate } = useSWR(
    `/api/lists/shared/${id}?page=${page}&take=${take}`,
    getRequest
  );

  return { data, error, mutate };
};

// Hook para adicionar um item a uma lista
export const useAddList = (id: string) => {
  const { trigger, isMutating } = useSWRMutation(
    `/api/lists/${id}/items`,
    sendRequest
  );

  const addList = async (item: PayloadNewItemList) => {
    try {
      const data = await trigger(item);
      return data; // Retorna os dados da operação
    } catch (error) {
      console.error('Failed to add item to list:', error);
      throw error; // Propaga o erro para tratamento no componente
    }
  };

  return { addList, isMutating };
};

// Função para obter uma lista específica
export const useGetListUnique = (id: string) => {
  const { data, error, mutate } = useSWR(`/api/lists/${id}`, getRequest);

  return { data, error, mutate };
};

// Função para excluir um item de uma lista
export const useDeleteItem = (listId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    `/api/lists/${listId}/items`,
    deleteRequest
  );

  const deleteItem = async (itemId: number) => {
    try {
      const data = await trigger({
        item_id: itemId.toString(),
      });
      return data; // Retorna os dados da operação'
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error; // Propaga o erro para tratamento no componente
    }
  };

  return { deleteItem, isMutating };
};

// Função para atualizar status de um item
export const useUpdateItemStatus = (listId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    `/api/lists/${listId}/item/status`,
    patchRequest
  );

  const updateItemStatus = async (itemId: number) => {
    try {
      const data = await trigger({
        item_id: itemId.toString(),
      });
      return data; // Retorna os dados da operação
    } catch (error) {
      console.error('Failed to update item status:', error);
      throw error; // Propaga o erro para tratamento no componente
    }
  };

  return { updateItemStatus, isMutating };
};

// Função para atualizar um item
export const useUpdateItem = (listId: string) => {
  const { trigger, isMutating } = useSWRMutation(
    `/api/lists/${listId}/item`,
    patchRequest
  );

  const updateItem = async (item: PayloadNewItemList) => {
    try {
      const data = await trigger(item);
      return data; // Retorna os dados da operação
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error; // Propaga o erro para tratamento no componente
    }
  };

  return { updateItem, isMutating };
};
