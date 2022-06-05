import dbModels from '../models';
const {Sequelize} = dbModels;

export const filterObjectEntries = (obj, ...allowedFields) => {
    const filteredObj = {}
    Object.keys(obj).forEach(element => {
        if(allowedFields.includes(element)) {
            filteredObj[element] = obj[element];
        }
    });
    return filteredObj;
}

// Set custom order for relational DB
export const customOrder = (column, values, direction) => {
    let orderByClause = 'CASE ';
    
    for (let index = 0; index < values.length; index++) {
        let value = values[index];
    
        if (typeof value === 'string') value = `'${value}'`;
    
        orderByClause += `WHEN ${column} = ${value} THEN '${index}' `;
    }
    
    orderByClause += `ELSE ${column} END`
    
    return [Sequelize.literal(orderByClause), direction]
};