const host = "https://hub.hsu.ac.kr"
//https://hub.hsu.ac.kr
function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getAPI = (target, URL = host, port='7000') => {
    return new Promise<any[]>((resolve, reject) => {
        fetch(`${URL}/${target}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(typeof res.message !== 'undefined') resolve([]) 
            else resolve(res)
        })
        .catch(err => reject(err))
    })   
}
const setAPI = (target, data, file = false) => {
    const formData = file ? {
        method: 'POST',
        body : data
    } : {
        method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        body : JSON.stringify(data)
    }
    return new Promise<any>((resolve, reject) => {
        fetch(`${host}/${target}`, {
            ...formData
        })
        .then(res => res.json()).then(res => resolve(res))
        .catch(err => reject(err) )
    })
}

const dictToArr = (dict:any[], idxName:string, value:string|null = null, array=false) => {
    let column = {}
    dict.forEach(data => {
        const v_data = (value == null) ? _objectWithoutProperties(data, [idxName]) : data[value]
        if(array) {
            if(typeof(column[data[idxName]]) === 'undefined') column[data[idxName]] = []
            column[data[idxName]].push(v_data)
        }
        else column[data[idxName]] = v_data
    })
    return column
}

const dictToArr_s = (dict:any[], idxName:string, idxName2:string, value:string|null = null, array=false) => {
    let column = {}
    dict.forEach(data => {
        const v_data = (value == null) ? _objectWithoutProperties(data, [idxName, idxName2]) : data[value]
        if(array) {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = {}
            if(typeof(column[data[idxName]][data[idxName2]]) == 'undefined') column[data[idxName]][data[idxName2]] = []
            column[data[idxName]][data[idxName2]].push(v_data)
        }
        else {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = {}
            column[data[idxName]][data[idxName2]] = v_data
        }
    })
    return column
}

const isAvailable = object => 
  !(typeof(object) === 'undefined' || 
  Object.keys(object).length === 0)


export { getAPI, setAPI, dictToArr, dictToArr_s, isAvailable }
