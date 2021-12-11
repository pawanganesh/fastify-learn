tableName = 'users'
conditions = { id: 125, pid: 12 }
data = { username: 'Joe', age: 28, status: 'active' }

const updateQueryGenerator = (tableName, data = {}, conditions = {}) => {
    const dKeys = Object.keys(data);
    const dataTuples = dKeys.map((k, index) => `${k}=$${index + 1}`);
    const updates = dataTuples.join(", ");
    const len = Object.keys(data).length;

    let query = `UPDATE ${tableName} SET ${updates} `;
    conditionsCheck = !(Object.keys(conditions).length === 0)

    if (conditionsCheck) {
        const akeys = Object.keys(conditions);
        const condTuples = akeys.map((k, index) => `${k} = $${index + 1 + len} `);
        const condPlaceholders = condTuples.join(" AND ");
        query += ` WHERE ${condPlaceholders} RETURNING *`;
    }

    const values = [];
    Object.keys(data).forEach(key => values.push(data[key]));
    Object.keys(conditions).forEach(key => values.push(conditions[key]));


    return { query, values }
}

console.log(
    updateQueryGenerator("users",
        { username: 'Joe', age: 28, status: 'active' },
        { id: 125, pid: 12 })
)