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

const ProductList = () => import("@/views/pms/list/ProductList.vue");

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

export const constantRouterMap = [
  {
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
    children: [
      {
        path: "",
        name: "home",
        component: Home,
        meta: {
          title: "首页",
          icon: "home",
        },
      },
    ],
  },
];

export const asyncRouterMap = [
  {
    path: "/pms",
    component: Layout,
    redirect: "/pms/product",
    name: "pms",
    meta: {
      title: "商品",
      icon: "product",
    },
    children: [
      {
        path: "product",
        name: "product",
        component: ProductList,
        meta: {
          title: "商品列表",
          icon: "product-list",
        },
      },
      {
        path: "addProduct",
        name: "addProduct",
        component: AddProduct,
        meta: {
          title: "添加商品",
          icon: "product-add",
        },
      },
      {
        path: "updateProduct",
        name: "updateProduct",
        component: UpdateProduct,
        meta: {
          title: "修改商品",
        },
        hidden: true,
      },
      {
        path: "productCate",
        name: "productCate",
        component: ProductCateList,
        meta: {
          title: "商品分类",
          icon: "product-cate",
        },
      },
      {
        path: "addProductCate",
        name: "addProductCate",
        component: AddProductCate,
        meta: {
          title: "添加商品分类",
        },
        hidden: true,
      },
      {
        path: "updateProductCate",
        name: "updateProductCate",
        component: UpdateProductCate,
        meta: {
          title: "修改商品分类",
        },
        hidden: true,
      },
      {
        path: "productAttr",
        name: "productAttr",
        component: Layout,
        meta: {
          title: "商品类型",
          icon: "product-attr",
        },
      },
      {
        path: "productAttrList",
        name: "productAttrList",
        component: Layout,
        meta: {
          title: "商品属性列表",
        },
        hidden: true,
      },
      {
        path: "addProductAttr",
        name: "addProductAttr",
        component: Layout,
        meta: {
          title: "添加商品属性",
        },
        hidden: true,
      },
      {
        path: "updateProductAttr",
        name: "updateProductAttr",
        component: Layout,
        meta: {
          title: "修改商品属性",
        },
        hidden: true,
      },
      {
        path: "brand",
        name: "brand",
        component: ProductBrandList,
        meta: {
          title: "品牌管理",
          icon: "product-brand",
        },
      },
      {
        path: "addBrand",
        name: "addBrand",
        component: AddProductBrand,
        meta: {
          title: "添加品牌",
        },
        hidden: true,
      },
      {
        path: "updateBrand",
        name: "updateBrand",
        component: UpdateProductBrand,
        meta: {
          title: "编辑品牌",
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
      title: "订单",
      icon: "order",
    },
    children: [
      {
        path: "order",
        name: "order",
        component: OrderList,
        meta: {
          title: "订单列表",
          icon: "product-list",
        },
      },
      {
        path: "orderDetail",
        name: "orderDetail",
        component: OrderDetail,
        meta: {
          title: "订单详情",
        },
        hidden: true,
      },
      {
        path: "deliverOrderList",
        name: "deliverOrderList",
        component: DeliverOrderList,
        meta: {
          title: "发货列表",
        },
        hidden: true,
      },
      {
        path: "orderSetting",
        name: "orderSetting",
        component: OrderSetting,
        meta: {
          title: "订单设置",
          icon: "order-setting",
        },
      },
      {
        path: "returnApply",
        name: "returnApply",
        component: OrderReturnApplyList,
        meta: {
          title: "退货申请处理",
          icon: "order-return",
        },
      },
      {
        path: "returnReason",
        name: "returnReason",
        component: Layout,
        meta: {
          title: "退货原因设置",
          icon: "order-return-reason",
        },
      },
      {
        path: "returnApplyDetail",
        name: "returnApplyDetail",
        component: Layout,
        meta: {
          title: "退货原因详情",
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
      title: "营销",
      icon: "sms",
    },
    children: [
      {
        path: "flash",
        name: "flash",
        component: Layout,
        meta: {
          title: "秒杀活动列表",
          icon: "sms-flash",
        },
      },
      {
        path: "flashSession",
        name: "flashSession",
        component: Layout,
        meta: {
          title: "秒杀时间段列表",
        },
        hidden: true,
      },
      {
        path: "selectSession",
        name: "selectSession",
        component: Layout,
        meta: {
          title: "秒杀时间段选择",
        },
        hidden: true,
      },
      {
        path: "flashProductRelation",
        name: "flashProductRelation",
        component: Layout,
        meta: {
          title: "秒杀商品列表",
        },
        hidden: true,
      },
      {
        path: "coupon",
        name: "coupon",
        component: Layout,
        meta: {
          title: "优惠券列表",
          icon: "sms-coupon",
        },
      },
      {
        path: "addCoupon",
        name: "addCoupon",
        component: Layout,
        meta: {
          title: "添加优惠券",
        },
        hidden: true,
      },
      {
        path: "updateCoupon",
        name: "updateCoupon",
        component: Layout,
        meta: {
          title: "修改优惠券",
        },
        hidden: true,
      },
      {
        path: "couponHistory",
        name: "couponHistory",
        component: Layout,
        meta: {
          title: "优惠券领取详情",
        },
        hidden: true,
      },
      {
        path: "brand",
        name: "homeBrand",
        component: Layout,
        meta: {
          title: "品牌推荐",
          icon: "product-brand",
        },
      },
      {
        path: "new",
        name: "homeNew",
        component: Layout,
        meta: {
          title: "新品推荐",
          icon: "sms-new",
        },
      },
      {
        path: "hot",
        name: "homeHot",
        component: Layout,
        meta: {
          title: "人气推荐",
          icon: "sms-hot",
        },
      },
      {
        path: "subject",
        name: "homeSubject",
        component: Layout,
        meta: {
          title: "专题推荐",
          icon: "sms-subject",
        },
      },
      {
        path: "advertise",
        name: "homeAdvertise",
        component: Layout,
        meta: {
          title: "广告列表",
          icon: "sms-ad",
        },
      },
      {
        path: "addAdvertise",
        name: "addHomeAdvertise",
        component: Layout,
        meta: {
          title: "添加广告",
        },
        hidden: true,
      },
      {
        path: "updateAdvertise",
        name: "updateHomeAdvertise",
        component: Layout,
        meta: {
          title: "编辑广告",
        },
        hidden: true,
      },
    ],
  },
  {
    path: "/ums",
    component: Layout,
    redirect: "/ums/admin",
    name: "ums",
    meta: {
      title: "权限",
      icon: "ums",
    },
    children: [
      {
        path: "admin",
        name: "admin",
        component: Layout,
        meta: {
          title: "用户列表",
          icon: "ums-admin",
        },
      },
      {
        path: "role",
        name: "role",
        component: Layout,
        meta: {
          title: "角色列表",
          icon: "ums-role",
        },
      },
      {
        path: "allocMenu",
        name: "allocMenu",
        component: Layout,
        meta: {
          title: "分配菜单",
        },
        hidden: true,
      },
      {
        path: "allocResource",
        name: "allocResource",
        component: Layout,
        meta: {
          title: "分配资源",
        },
        hidden: true,
      },
      {
        path: "menu",
        name: "menu",
        component: Layout,
        meta: {
          title: "菜单列表",
          icon: "ums-menu",
        },
      },
      {
        path: "addMenu",
        name: "addMenu",
        component: Layout,
        meta: {
          title: "添加菜单",
        },
        hidden: true,
      },
      {
        path: "updateMenu",
        name: "updateMenu",
        component: Layout,
        meta: {
          title: "修改菜单",
        },
        hidden: true,
      },
      {
        path: "resource",
        name: "resource",
        component: Layout,
        meta: {
          title: "资源列表",
          icon: "ums-resource",
        },
      },
      {
        path: "resourceCategory",
        name: "resourceCategory",
        component: Layout,
        meta: {
          title: "资源分类",
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
