/**
* tableName: 'users'
* data: {username: 'handsomelonda', 'email': 'handsomelonda@gmail.com', ...}
* conditions: {id: 1, ...}
 */

const updateQueryGenerator = (tableName, data = {}, conditions = {}) => {
    const dKeys = Object.keys(data);
    const dataTuples = dKeys.map((k, index) => `${k}=$${index + 1}`);
    const updates = dataTuples.join(", ");
    const len = Object.keys(data).length;

    let text = `UPDATE ${tableName} SET ${updates} `;
    conditionsCheck = !(Object.keys(conditions).length === 0)

    if (conditionsCheck) {
        const akeys = Object.keys(conditions);
        const condTuples = akeys.map((k, index) => `${k} = $${index + 1 + len} `);
        const condPlaceholders = condTuples.join(" AND ");
        text += ` WHERE ${condPlaceholders} RETURNING *`;
    }

    const values = [];
    Object.keys(data).forEach(key => values.push(data[key]));
    Object.keys(conditions).forEach(key => values.push(conditions[key]));


    return { text, values }
}

module.exports = { updateQueryGenerator }