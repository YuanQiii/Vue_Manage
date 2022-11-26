import store from '@/store';

export function checkPermission(value) {
    return store.state.user.roles[0].includes(value)
}