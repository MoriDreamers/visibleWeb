export const objectToList=(obj)=>{
    let list = []
    if (obj == null) {
        return list
    }
    for (let [key, value] of Object.entries(obj)) {
        const item = { key: key, value: value }
        list.push(item)
    } 
    return list
} 

/* 输入: { "a": 1, "b": 2 }
输出: [
    { key: "a", value: 1 },
    { key: "b", value: 2 }
] */

export const listToObject=(list)=>{
    let obj = {}
    if (list == null) {
        return obj
    }
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        /* 输入:[
                { key: "a", value: 1 },
                { key: "b", value: 2 }
                ]
        输出: 
              { "a": 1, "b": 2 }
              
            举个例子说明一下：
            const item = { key: "a", value: 1 }
            obj[item.key] = item.value
            其实就是：
            obj["a"] = 1
            等价于：
            { "a": 1 }
              */
        if( item.key == null ) {
            continue
        }
        obj[item.key] = item.value
    } 
    return obj
} 

export const deleteTabRow = (list, index) => {
    //删除表格里的某一行（index为行号）
    list.splice(index, 1)
}