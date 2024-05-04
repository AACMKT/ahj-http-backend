const fss = require('fs') ;
const fs = require('fs/promises') ;
const { constants } = require('fs/promises');

const defaultData = {
"tickets": [{
    id: "1",
    draft: "Let's create a ticket",
    date: '01.05.2024, 18:00',
    checked: false
}],
"descriptions": [{
    id: "1",
    details: "All fields should br filled in"
}]
};

async function checkFile() {
    try {
        await fs.access('data.json', constants.F_OK);
        console.log('file exists');
        return true;
    } catch {
        console.error('file does not exists');
        return false;
    }
};

module.exports.setId = async function setId() {
    let isExist = await checkFile();
    let id = '1';
    if (isExist) {
        let dbData = JSON.parse(fss.readFileSync('data.json', (err, data) => (data)));
        let idArray = dbData.tickets.map(el => Number(el.id));
        id = String(Math.max(...idArray) + 1);
    };
    return id
};

module.exports.getData = async function getData() {
    let isExist = await checkFile();
    if (!isExist) {
        fss.writeFileSync('data.json', JSON.stringify(defaultData));
    }
    dbData = JSON.parse(fss.readFileSync('data.json', (err, data) => (data)));
    return dbData;
};

module.exports.addData = async function addData(dt) {
    let isExist = await checkFile();
    if (!isExist) {
        let dtFormatted = {
            "tickets": [{
                id: "1",
                draft: dt.draft,
                date: dt.date,
                checked: false
            }],
            "descriptions": [{
                id: "1",
                description: dt.description
            }]
            };
        fss.writeFileSync('data.json', JSON.stringify(dtFormatted));
    }
    let dbData = JSON.parse(fss.readFileSync('data.json', (err, data) => (data)));
    let newDetails = {id: dt.id, details: dt.details};
    delete dt.details;
    console.log(dt)
    dbData.tickets.push(dt);
    dbData.descriptions.push(newDetails);
    
    fss.writeFileSync('data.json', JSON.stringify(dbData));
};

module.exports.updateData = function updateData(dt) {
    console.log(dt);
    let dbData = JSON.parse(fss.readFileSync('data.json', (err, data) => (data)));
    if (dt.id){
        dbData.tickets.forEach((el) => {
            if (el.id == dt.id) {
                el.draft = dt.draft;
                el.date = dt.date;
                el.checked = dt.checked;
            }
        });
        dbData.descriptions.forEach((el) => {
            if (el.id == dt.id) {
                el.details = dt.details;
            }
        });
    }
    fss.writeFileSync('data.json', JSON.stringify(dbData));
};

module.exports.deleteData = function deleteData(id) {

    let dbData = JSON.parse(fss.readFileSync('data.json', (err, data) => (data)));
    let dbTickets = dbData.tickets.filter(el => el.id != id);
    let dbDescriptions = dbData.descriptions.filter(el => el.id != id);
    dbData.tickets = dbTickets;
    dbData.descriptions = dbDescriptions; 
    fss.writeFileSync('data.json', JSON.stringify(dbData));
};

