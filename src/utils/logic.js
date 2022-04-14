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
    return temp;
}