/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-01 21:21:41
 * @FilePath: \vue_manage\src\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

const Login = () => import("@/views/login/Login.vue");
const wrongPage = () => import("@/views/404/wrongPage.vue");
const Layout = () => import("@/views/layout/Layout.vue");

const Home = () => import("@/views/home/Home.vue");

const ProductList = () => import("@/views/pms/product/ProductList.vue");

const AddProduct = () => import("@/views/pms/detail/AddProduct.vue");
const UpdateProduct = () => import("@/views/pms/detail/UpdateProduct.vue");

const ProductCateList = () =>
  import("@/views/pms/category/ProductCateList.vue");
const AddProductCate = () => import("@/views/pms/category/AddProductCate.vue");
const UpdateProductCate = () =>
  import("@/views/pms/category/UpdateProductCate.vue");

const ProductBrandList = () => import("@/views/pms/brand/ProductBrandList.vue");
const AddProductBrand = () => import("@/views/pms/brand/AddProductBrand.vue");
const UpdateProductBrand = () =>
  import("@/views/pms/brand/UpdateProductBrand.vue");

const OrderList = () => import("@/views/oms/list/OrderList.vue");
const OrderDetail = () => import("@/views/oms/list/OrderDetail.vue");
const DeliverOrderList = () => import("@/views/oms/list/DeliverOrderList.vue");

const OrderSetting = () => import("@/views/oms/setting/OrderSetting.vue");

const OrderReturnApplyList = () =>
  import("@/views/oms/apply/OrderReturnApplyList.vue");
const OrderReturnApplyDetail = () =>
  import("@/views/oms/apply/OrderReturnApplyDetail.vue");
const OrderReturnApplyReason = () =>
  import("@/views/oms/apply/OrderReturnApplyReason.vue");

const CouponList = () =>
  import("@/views/sms/coupon/CouponList.vue");
const AddCoupon = () =>
  import("@/views/sms/coupon/AddCoupon.vue");
const UpdateCoupon = () =>
  import("@/views/sms/coupon/UpdateCoupon.vue");
const CouponHistory = () =>
  import("@/views/sms/coupon/CouponHistory.vue");
const BrandRecommed = () =>
  import("@/views/sms/brand/BrandRecommend.vue");
const HotRecommend = () =>
  import("@/views/sms/hot/HotRecommend.vue");

const AdminList = () => import('@/views/ums/admin/AdminList.vue')
const RoleList = () => import('@/views/ums/role/RoleList')
const AllocMenu = () => import('@/views/ums/role/AllocMenu')
const AllocResource = () => import('@/views/ums/role/AllocResource')
const RoleMenuList = () => import('@/views/ums/menu/RoleMenuList')
const AddRoleMenu = () => import('@/views/ums/menu/AddRoleMenu')
const UpdateRoleMenu = () => import('@/views/ums/menu/UpdateRoleMenu')
const ResourceList = () => import('@/views/ums/resource/ResourceList')
const ResourceCategoryList = () => import('@/views/ums/resource/ResourceCategoryList')

export const constantRouterMap = [{
  path: "/login",
  name: "login",
  component: Login,
  hidden: true,
},
{
  path: "/404",
  name: "404",
  component: wrongPage,
  hidden: true,
},
{
  path: "",
  redirect: "/home",
},
{
  path: "/home",
  component: Layout,
  children: [{
    path: "",
    name: "home",
    component: Home,
    meta: {
      title: "??????",
      icon: "home",
    },
  },],
},
];

export const asyncRouterMap = [
  {
    path: "/pms",
    component: Layout,
    redirect: "/pms/product",
    name: "pms",
    meta: {
      title: "??????",
      icon: "product",
    },
    children: [{
      path: "product",
      name: "product",
      component: ProductList,
      meta: {
        title: "????????????",
        icon: "product-list",
      },
    },
    {
      path: "addProduct",
      name: "addProduct",
      component: AddProduct,
      meta: {
        title: "????????????",
        icon: "product-add",
      },
    },
    {
      path: "updateProduct",
      name: "updateProduct",
      component: UpdateProduct,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "productCate",
      name: "productCate",
      component: ProductCateList,
      meta: {
        title: "????????????",
        icon: "product-cate",
      },
    },
    {
      path: "addProductCate",
      name: "addProductCate",
      component: AddProductCate,
      meta: {
        title: "??????????????????",
      },
      hidden: true,
    },
    {
      path: "updateProductCate",
      name: "updateProductCate",
      component: UpdateProductCate,
      meta: {
        title: "??????????????????",
      },
      hidden: true,
    },
    {
      path: "brand",
      name: "brand",
      component: ProductBrandList,
      meta: {
        title: "????????????",
        icon: "product-brand",
      },
    },
    {
      path: "addBrand",
      name: "addBrand",
      component: AddProductBrand,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "updateBrand",
      name: "updateBrand",
      component: UpdateProductBrand,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    ],
  },
  {
    path: "/oms",
    component: Layout,
    redirect: "/oms/order",
    name: "oms",
    meta: {
      title: "??????",
      icon: "order",
    },
    children: [{
      path: "order",
      name: "order",
      component: OrderList,
      meta: {
        title: "????????????",
        icon: "product-list",
      },
    },
    {
      path: "orderDetail",
      name: "orderDetail",
      component: OrderDetail,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "deliverOrderList",
      name: "deliverOrderList",
      component: DeliverOrderList,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "orderSetting",
      name: "orderSetting",
      component: OrderSetting,
      meta: {
        title: "????????????",
        icon: "order-setting",
      },
    },
    {
      path: "returnApply",
      name: "returnApply",
      component: OrderReturnApplyList,
      meta: {
        title: "??????????????????",
        icon: "order-return",
      },
    },
    {
      path: "returnReason",
      name: "returnReason",
      component: OrderReturnApplyReason,
      meta: {
        title: "??????????????????",
        icon: "order-return-reason",
      },
    },
    {
      path: "returnApplyDetail",
      name: "returnApplyDetail",
      component: OrderReturnApplyDetail,
      meta: {
        title: "??????????????????",
      },
      hidden: true,
    },
    ],
  },
  {
    path: "/sms",
    component: Layout,
    redirect: "/sms/coupon",
    name: "sms",
    meta: {
      title: "??????",
      icon: "sms",
    },
    children: [
      {
        path: "coupon",
        name: "coupon",
        component: CouponList,
        meta: {
          title: "???????????????",
          icon: "sms-coupon",
        },
      },
      {
        path: "addCoupon",
        name: "addCoupon",
        component: AddCoupon,
        meta: {
          title: "???????????????",
        },
        hidden: true,
      },
      {
        path: "updateCoupon",
        name: "updateCoupon",
        component: UpdateCoupon,
        meta: {
          title: "???????????????",
        },
        hidden: true,
      },
      {
        path: "couponHistory",
        name: "couponHistory",
        component: CouponHistory,
        meta: {
          title: "?????????????????????",
        },
        hidden: true,
      },
      {
        path: "brand",
        name: "homeBrand",
        component: BrandRecommed,
        meta: {
          title: "????????????",
          icon: "product-brand",
        },
      },
      {
        path: "hot",
        name: "homeHot",
        component: HotRecommend,
        meta: {
          title: "????????????",
          icon: "sms-hot",
        },
      },
    ],
  },
  {
    path: "/ums",
    component: Layout,
    redirect: "/ums/adminList",
    name: "ums",
    meta: {
      title: "??????",
      icon: "ums",
    },
    children: [{
      path: "adminList",
      name: "adminList",
      component: AdminList,
      meta: {
        title: "????????????",
        icon: "ums-admin",
      },
    },
    {
      path: "roleList",
      name: "roleList",
      component: RoleList,
      meta: {
        title: "????????????",
        icon: "ums-role",
      },
    },
    {
      path: "roleMenuList",
      name: "roleMenuList",
      component: RoleMenuList,
      meta: {
        title: "????????????",
        icon: "ums-menu",
      },
    },
    {
      path: "allocMenu",
      name: "allocMenu",
      component: AllocMenu,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "allocResource",
      name: "allocResource",
      component: AllocResource,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "menu",
      name: "menu",
      component: Layout,
      meta: {
        title: "????????????",
        icon: "ums-menu",
      },
    },
    {
      path: "addRoleMenu",
      name: "addRoleMenu",
      component: AddRoleMenu,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "updateRoleMenu",
      name: "updateRoleMenu",
      component: UpdateRoleMenu,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    {
      path: "resourceList",
      name: "resourceList",
      component: ResourceList,
      meta: {
        title: "????????????",
        icon: "ums-resource",
      },
    },
    {
      path: "resourceCategoryList",
      name: "resourceCategoryList",
      component: ResourceCategoryList,
      meta: {
        title: "????????????",
      },
      hidden: true,
    },
    ],
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRouterMap,
});

export default router;