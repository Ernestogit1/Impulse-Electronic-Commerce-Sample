/**
 * RTK Query API slice. Every endpoint delegates to the `data` abstraction (mock or HTTP),
 * so caching, invalidation, and loading/skeleton states are identical regardless of source.
 */
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AnalyticsOverview,
  AuthUser,
  Category,
  CheckoutDTO,
  CreateProductDTO,
  LowStockItem,
  Order,
  OrderStatus,
  OrdersByStatus,
  Paginated,
  Product,
  ProductQuery,
  RevenuePoint,
  TopProduct,
  UpdateProductDTO,
  User,
  UserRole,
} from '@shared/types';
import { data } from '@/services/dataSource';

type QF<T> = { data: T } | { error: { status: number; message: string } };
async function run<T>(p: Promise<T>): Promise<QF<T>> {
  try {
    return { data: await p };
  } catch (e: any) {
    return { error: { status: e?.status ?? 500, message: e?.message ?? 'Request failed' } };
  }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product', 'Category', 'Order', 'User', 'Analytics'],
  endpoints: (build) => ({
    getProducts: build.query<Paginated<Product>, ProductQuery>({
      queryFn: (query) => run(data.listProducts(query)),
      providesTags: (res) =>
        res
          ? [...res.items.map((p) => ({ type: 'Product' as const, id: p.id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: build.query<Product, string>({
      queryFn: (slug) => run(data.getProductBySlug(slug)),
      providesTags: (res) => (res ? [{ type: 'Product', id: res.id }] : []),
    }),
    getCategories: build.query<Category[], void>({
      queryFn: () => run(data.listCategories()),
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    createProduct: build.mutation<Product, CreateProductDTO>({
      queryFn: (dto) => run(data.createProduct(dto)),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Analytics', id: 'ALL' }],
    }),
    updateProduct: build.mutation<Product, { id: string; dto: UpdateProductDTO }>({
      queryFn: ({ id, dto }) => run(data.updateProduct(id, dto)),
      invalidatesTags: (res) =>
        res ? [{ type: 'Product', id: res.id }, { type: 'Product', id: 'LIST' }] : [{ type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: build.mutation<{ id: string }, string>({
      queryFn: (id) => run(data.deleteProduct(id)),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Analytics', id: 'ALL' }],
    }),

    checkout: build.mutation<Order, { dto: CheckoutDTO; user: AuthUser }>({
      queryFn: ({ dto, user }) => run(data.checkout(dto, user)),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Product', id: 'LIST' }, { type: 'Analytics', id: 'ALL' }],
    }),
    getMyOrders: build.query<Order[], string>({
      queryFn: (userId) => run(data.listMyOrders(userId)),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    getOrder: build.query<Order, string>({
      queryFn: (id) => run(data.getOrder(id)),
      providesTags: (res) => (res ? [{ type: 'Order', id: res.id }] : []),
    }),

    adminGetOrders: build.query<Order[], void>({
      queryFn: () => run(data.adminListOrders()),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    adminUpdateOrderStatus: build.mutation<Order, { id: string; status: OrderStatus }>({
      queryFn: ({ id, status }) => run(data.adminUpdateOrderStatus(id, status)),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Analytics', id: 'ALL' }],
    }),
    adminGetUsers: build.query<User[], void>({
      queryFn: () => run(data.adminListUsers()),
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    adminUpdateUserRole: build.mutation<User, { id: string; role: UserRole }>({
      queryFn: ({ id, role }) => run(data.adminUpdateUserRole(id, role)),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getAnalyticsOverview: build.query<AnalyticsOverview, void>({
      queryFn: () => run(data.analyticsOverview()),
      providesTags: [{ type: 'Analytics', id: 'ALL' }],
    }),
    getRevenueSeries: build.query<RevenuePoint[], void>({
      queryFn: () => run(data.revenueSeries()),
      providesTags: [{ type: 'Analytics', id: 'ALL' }],
    }),
    getTopProducts: build.query<TopProduct[], void>({
      queryFn: () => run(data.topProducts()),
      providesTags: [{ type: 'Analytics', id: 'ALL' }],
    }),
    getOrdersByStatus: build.query<OrdersByStatus[], void>({
      queryFn: () => run(data.ordersByStatus()),
      providesTags: [{ type: 'Analytics', id: 'ALL' }],
    }),
    getLowStock: build.query<LowStockItem[], void>({
      queryFn: () => run(data.lowStock()),
      providesTags: [{ type: 'Analytics', id: 'ALL' }, { type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useAdminGetOrdersQuery,
  useAdminUpdateOrderStatusMutation,
  useAdminGetUsersQuery,
  useAdminUpdateUserRoleMutation,
  useGetAnalyticsOverviewQuery,
  useGetRevenueSeriesQuery,
  useGetTopProductsQuery,
  useGetOrdersByStatusQuery,
  useGetLowStockQuery,
} = apiSlice;
