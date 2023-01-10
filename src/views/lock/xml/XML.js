import dayjs from "dayjs";

export function addTag(xmlObj, parentName, tagName, layerName, attrs){
    let attrsObj = {}
    for (const [key, value] of Object.entries(attrs)){
        attrsObj[`_${key}`] = value
    }
    xmlObj[parentName][`${tagName}-${layerName.split('-')[1]}`] = attrsObj

    console.log(xmlObj)
}

export function updateTag(xmlObj, layerName, attrs = null, animation = null, event = null){
    let obj = getObj(xmlObj, layerName.split('-')[1])
    console.log(obj)

    if(attrs){
        console.log('更新xml属性')
        for (const [key, value] of Object.entries(attrs)){
            obj[`_${key}`] = value
        }
    }

    if(animation){
        console.log('更新xml动画')
        obj['PositionAnimation'] = animation['PositionAnimation']
    }

    if(event){
        let id = event.Controlled.split('-')[1]
        xmlObj['Lockscreen'][`Var-${id}`] = {
            _name: `isVisibility-${id}`
        }
        xmlObj['Lockscreen'][`Button-${dayjs().unix()}`] = {
            _x: `${event.Controller.x()}`,
            _y: `${event.Controller.y()}`,
            _width: `${event.Controller.width()}`,
            _height: `${event.Controller.height()}`,
            Triggers: {
                Trigger: {
                    _action: 'down',
                    Command: {
                        _target: `${event.Controlled.split('-')[1]}.visibility`,
                        _value: `eq(#isVisibility-${id},1)`
                    }
                }
            }
        }
    }

    console.log(xmlObj)
}

function getObj(obj, name){
    let temp = null
    function fn(tempObj){

        for (const [key, value] of Object.entries(tempObj)){
            if(!key.startsWith('_')){
                if(key === `Image-${name}`){
                    temp = value
                }else{
                    fn(value)
                }
            }
        }
    }
    fn(obj)
    return temp
}

export function handleXML(xmlStr){
    let temp = xmlStr
    let patterns = [/Image-[0-9]+/g, /Var-[0-9]+/g, /Button-[0-9]+/g, /Position-[0-9]+/g]
    patterns.forEach(ele => {
        let reg = /[A-z]+/
        let key = reg.exec(ele.toString())[0]
        temp = temp.replace(ele, key)
    })

    let startStr = '<?xml version="1.0" encoding="utf-8"?>'
    let index = 58

    let patternVar = /<Var[^>]*>/
    let Vars = patternVar.exec(temp).reverse()
    Vars.forEach(ele => {
        temp = temp.replace(ele, '')
    })
    Vars.forEach(ele => {
        temp = `${temp.slice(0, index)}${ele}${temp.slice(index)}`
    })

    temp = startStr + temp
    return temp
}

