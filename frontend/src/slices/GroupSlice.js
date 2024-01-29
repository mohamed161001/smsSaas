import { api } from '../state/api';

export const groupSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getGroups: build.query({
            query: ({page,pageSize,search,clientID,sort,token}) => ({
              url: "/api/group/",
              method: "GET",
              params: {page,pageSize,search,clientID,sort},
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            providesTags: ['Group'],
        }),
        addGroup: build.mutation({
            query: ({group,token}) => ({
                url: "/api/group/",
                method: "POST",
                body: group,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Group'],
        }),
        deleteGroup: build.mutation({
            query: ({id,token}) => ({
                url: `/api/group/${id}`,
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Group','Client'],
        }),
        getGroup: build.query({
            query: ({id,token}) => ({
                url: `/api/group/${id}`,
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
        }),
        updateGroup: build.mutation({
            query: ({id,group,token}) => ({
                url: `/api/group/${id}`,
                method: "PATCH",
                body: group,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Group'],
        }),
    })
});

export const {
    useGetGroupsQuery,
    useAddGroupMutation,
    useDeleteGroupMutation,
    useGetGroupQuery,
    useUpdateGroupMutation,
} = groupSlice;