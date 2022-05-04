export const COUPON = {
    type: 0,
    name: null,
    platform: 0,
    amount: null,
    perLimit: 1,
    minPoint: null,
    startTime: null,
    endTime: null,
    useType: 0,
    note: null,
    publishCount: null,
    productRelationList: [],
    productCategoryRelationList: []
}

export const COUPON_TYPE_OPTIONS = [
    {
        label: '全场赠券',
        value: 0
    },
    {
        label: '会员赠券',
        value: 1
    },
    {
        label: '购物赠券',
        value: 2
    },
    {
        label: '注册赠券',
        value: 3
    }
]

export const COUPON_PLATFORM_OPTIONS = [
    {
        label: '全平台',
        value: 0
    },
    {
        label: '移动平台',
        value: 1
    },
    {
        label: 'PC平台',
        value: 2
    }
]

export const COUPON_USE_STATUS_OPTIONS = [
    {
        label: "未使用",
        value: 0,
    },
    {
        label: "已使用",
        value: 1,
    },
    {
        label: "已过期",
        value: 2,
    }
]

export const RECOMMEND_OPTIONS = [
    {
        label: "未推荐",
        value: 0,
    },
    {
        label: "推荐中",
        value: 1,
    },
]

