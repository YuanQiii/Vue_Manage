

let handleMove = throttle((konvaStage) => {
    // console.log(konvaStage.getPointerPosition())

}, 100)

let handleValueTransform = throttle((value, scale) => {
    console.log(Math.round(value * scale))
}, 100)

export {
    handleMove,
    handleValueTransform
}

function throttle(fn, delay) {
    let last = 0 // 上次触发时间
    return function (...args) {
        const now = Date.now()
        if (now - last > delay) {
            last = now
            fn.apply(this, args)
        }
    }
}

export function debounce(fn, delay) {
    let timer;
    return function (...args) {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}


export function layerImageIsSame(){

}

