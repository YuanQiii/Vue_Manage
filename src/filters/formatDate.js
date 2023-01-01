const dayjs = require('dayjs')

export default function(value){
    let datetime = dayjs(value).format('YYYY/MM/DD')
    if(datetime == 'Invalid Date'){
        return 'N/A'
    }else{
        return datetime
    } 
}