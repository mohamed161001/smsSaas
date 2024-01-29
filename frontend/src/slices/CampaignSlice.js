import { api } from '../state/api';

export const campaignSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getCampaigns: build.query({
            query: ({page,pageSize,search,clientID,sort,token}) => ({
              url: "/api/campaign/",
              method: "GET",
              params: {page,pageSize,search,clientID,sort},
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            providesTags: ['Campaign'],
        }),
        getSmsBalance: build.query({
            query: ({user,token}) => ({
              url: "/api/campaign/balance",
              method: "GET",
              params: {user},
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            providesTags: ['Campaign'],
        }),
        createCampaign: build.mutation({
            query: ({campaign,token}) => ({
                url: "/api/campaign/createCampaign",
                method: "POST",
                body: campaign,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }),
            invalidatesTags: ['Campaign'],
        }),
    })
});

export const {
    useGetCampaignsQuery,
    useGetSmsBalanceQuery,
    useCreateCampaignMutation,
} = campaignSlice;