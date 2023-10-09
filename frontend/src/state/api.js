import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  prepareHeaders: (headers, { getState }) => {
    const token =  getState().auth.token
    if (token) {
      console.log('token : ', token);
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  reducerPath: "adminApi",
  tagTypes: ['Users'],
  endpoints: (build) => ({
    // Define your endpoint here
    loginUser: build.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      onError: (error) => {console.log(error);},
      invalidatesTags: ["Users"],
    }),
    getUser: build.query({
      query: ({ id, token }) => ({
        url: `/api/profile/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Users']
    }),
    updateUser: build.mutation({
      query: ({ id, user, token }) => ({
        url: `/api/profile/${id}`,
        method: "PATCH",
        body: user,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Users']
    }),
    deleteUserImage: build.mutation({
      query: ({ id, token }) => ({
        url: `/api/profile/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Users']
    }),
    forgetPassword: build.mutation({
      query: ({ email }) => ({
        url: `/api/user/forgot_pwd`,
        method: "POST",
        body: { email },
      }),
      onError: (error) => {console.log(error);},
      invalidatesTags: ["Users"],
    }),
  }),
})

export const {
  useLoginUserMutation,
  useGetUserQuery,
  useForgetPasswordMutation,
  useUpdateUserMutation,
  useDeleteUserImageMutation,
} = api;
