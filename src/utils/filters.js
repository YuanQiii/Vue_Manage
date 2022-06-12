//  参数1：过滤器名称
//  参数2：过滤器的逻辑

Vue.filter('formatDate', function (value) {
    return value.replace('T', ' ').slice(0, -10)
})
