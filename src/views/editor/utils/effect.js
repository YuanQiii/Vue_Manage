import { sha256 } from 'js-sha256'
import {createAnimation} from "@/views/editor/utils/utils";
import store from '@/store'
import Konva from "konva";

export function addSnow(key, value){
    let count = 1
    let animationArgsList = []
    while (count < 21){
        count++
        let imageObj = new Image();
        imageObj.onload = function (){

            let id = `${key}-${sha256(`${Math.random()}`)}`

            let konvaImage = new Konva.Image({
                x: Math.random() * 360,
                y: Math.random() * 640,
                image: imageObj,
                width: Math.round(imageObj.width / 3),
                height: Math.round(imageObj.height / 3),
                id
            });

            store.state.editor.konvaDynamicLayer.add(konvaImage)

            animationArgsList.push({
                id,
                type: '位移',
                delay: 0,
                repeat: 0,
                keyframe: [
                    {
                        id: 0,
                        x: Math.random() * 360,
                        y: Math.random() * 640,
                        time: Math.random() * 10000
                    }
                ]
            })

            if(animationArgsList.length === count - 1){
                console.log(animationArgsList)

                animationArgsList.forEach(ele => {
                    createAnimation(ele).playAnimation()
                })
            }
        }
        imageObj.src = URL.createObjectURL(value);
    }
}
