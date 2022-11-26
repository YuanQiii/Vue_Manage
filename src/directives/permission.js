import store from '@/store';

export default {
    inserted(el, binding, vnode){
        console.log(binding);
    	//指令的绑定值
        const { value } = binding;
        if(value){
    	    // 获取角色
            let roles = store.state.user && store.state.user.roles
            let hasPermission = roles[0].includes(value)

             //没有权限删除此元素
            if(!hasPermission){
                console.log(el);
                el.parentNode && el.parentNode.removeChild(el);
            }
        }
    }
}
