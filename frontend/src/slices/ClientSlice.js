import { api } from '../state/api';

export const clientSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getClients: build.query({
            query: ({page,pageSize,search,clientID,sort,token}) => ({
              url: "/api/contact/",
              method: "GET",
              params: {page,pageSize,search,clientID,sort},
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            providesTags: ['Client'],

        }),
        addClient: build.mutation({
            query: ({client,token}) => ({
                url: "/api/contact/",
                method: "POST",
                body: client,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Client','Group'],
        }),
        addClients : build.mutation({
            query: ({clients,token}) => ({
                url: "/api/contact/createContacts",
                method: "POST",
                body: clients,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Client','Group'],
        }),
        deleteClient: build.mutation({
            query: ({id,token}) => ({
                url: `/api/contact/${id}`,
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Client','Group'],
        }),
        getClient: build.query({
            query: ({id,token}) => ({
              url: `/api/contact/${id}`,
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            providesTags: ['Client'],
        }),
        updateClient: build.mutation({
            query: ({id,client,token}) => ({
                url: `/api/contact/${id}`,
                method: "PATCH",
                body: client,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Client','Group'],
        }),
    })
});

export const {
    useGetClientsQuery,
    useAddClientMutation,
    useDeleteClientMutation,
    useGetClientQuery,
    useUpdateClientMutation,
    useAddClientsMutation,
} = clientSlice;