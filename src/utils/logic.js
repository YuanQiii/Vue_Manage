/*
 * @Author: YuanQiii
 * @GitHub: https://github.com/YuanQiii
 * @Date: 2022-04-14 21:43:38
 * @FilePath: \vue_manage\src\utils\logic.js
 */

// 数据表展示
export function dataTableList(list, pageConfig, filterConditions) {
    let temp = [];
    let start = (pageConfig.pageNum - 1) * pageConfig.pageSize;
    let end = pageConfig.pageNum * pageConfig.pageSize;
    let max = list.length;
    end = end > max ? max : end;

    list.slice(start, end).forEach((element) => {
        let flags = [];
        let keys = Object.keys(filterConditions)
        if (keys.length) {
            keys.forEach((key) => {
                let value = filterConditions[key];

                if (value != null && (value === 0 || value != "")) {
                    if (typeof value == 'number') {
                        if (element[key] == value) {
                            flags.push(true);
                        } else {
                            flags.push(false);
                        }
                    } else {
                        if (element[key] != null && element[key].includes(value)) {
                            flags.push(true);
                        } else {
                            flags.push(false);
                        }
                    }
                } else {
                    flags.push(true);
                }
            });
            if (flags.every((value) => value)) {
                temp.push(element);
            }
        } else {
            temp.push(element)
        }

    });

    temp.sort((a, b) => {
        return b.sort - a.sort
    })


    return temp;
}

// 商品分类转换为选项
export function productCategory(list) {
    let productCategoryOptions = [];
    for (let i = 0; i < list.length; i++) {
        let children = [];
        if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
                children.push({
                    label: list[i].children[j].name,
                    value: list[i].children[j].id,
                });
            }
        }
        productCategoryOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children,
        });
    }
    return productCategoryOptions
}

// 分类id获取商品分类
export function getProductCategoryByIds(productCategoryOptions, ids) {
    let name;
    let parentName;
    for (let i = 0; i < productCategoryOptions.length; i++) {
        if (productCategoryOptions[i].value === ids[0]) {
            parentName = productCategoryOptions[i].label;
            for (let j = 0; j < productCategoryOptions[i].children.length; j++) {
                if (productCategoryOptions[i].children[j].value === ids[1]) {
                    name = productCategoryOptions[i].children[j].label;
                }
            }
        }
    }
    return {
        productCategoryId: ids[1],
        productCategoryName: name,
        parentCategoryName: parentName,
    };
}

// 商品id获取商品
export function getProductById(selectProductOptions, id) {
    let temp
    selectProductOptions.forEach(element => {
        if (id == element.productId) {
            temp = element
        }
    });
    return temp
}

export function addItem(list, item) {
    list.push(item)
    return list
}

// 更新元素
export function updateItem(list, item) {
    let temp = []
    list.forEach(element => {
        if (element.id == item.id) {
            temp.push(item)
        } else {
            temp.push(element)
        }
    });
    return temp
}

// 删除元素
export function deleteItemById(list, id) {
    let temp = []
    list.forEach(element => {
        if (element.id != id) {
            temp.push(element)
        }
    });
    return temp
}