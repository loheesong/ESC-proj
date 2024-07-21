const dest = require('../../models/dest');
const db = require('../../models/db');

afterAll(() => {
    // Closing the DB connection allows Jest to exit successfully.
    db.cleanup()
})

describe('destination models functions', () => {
    describe('partial city tests', () => {  
        test('can search singa, 5', async () => {
            const actual_res = await dest.partial_city("singa", 5)
            const expected_res = [{"term":"Singapore, Singapore","uid":"RsBU"},{"term":"Sentosa, Singapore","uid":"3W9U"},{"term":"Kallang, Singapore, Singapore","uid":"YD2Z"},{"term":"Outram, Singapore, Singapore","uid":"LF74"},{"term":"Colonial District, Singapore, Singapore","uid":"8V8Y"}]
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('can search singa, 1', async () => {
            const actual_res = await dest.partial_city("singa", 1)
            const expected_res = [
                { term: 'Singapore, Singapore', uid: 'RsBU' }
            ]
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('can handle empty string', async () => { 
            const actual_res = await dest.partial_city("", 5)
            const expected_res = []
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('merica, 5', async () => { 
            const actual_res = await dest.partial_city("merica", 5)
            const expected_res = [{"term":"New Orleans, Louisiana, United States of America","uid":"2IFI"},{"term":"Las Americas, Spain","uid":"8Sjv"},{"term":"Fort Myers Beach, Florida, United States of America","uid":"IJJF"},{"term":"North Myrtle Beach, South Carolina, United States of America","uid":"YHX3"},{"term":"Loughman, Davenport, Florida, United States of America","uid":"VU5D"}]
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('omit num_res, will default to 5', async () => {
            const actual_res = await dest.partial_city("singa")
            const expected_res = [{"term":"Singapore, Singapore","uid":"RsBU"},{"term":"Sentosa, Singapore","uid":"3W9U"},{"term":"Kallang, Singapore, Singapore","uid":"YD2Z"},{"term":"Outram, Singapore, Singapore","uid":"LF74"},{"term":"Colonial District, Singapore, Singapore","uid":"8V8Y"}]
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('does not support misspelling of sinapor,5', async () => { 
            const actual_res = await dest.partial_city("sinapor", 5)
            const expected_res = []
            expect(actual_res).toStrictEqual(expected_res);
        })

        test('non alphabet query 123, 5', async () => { 
            const actual_res = await dest.partial_city("123", 5)
            const expected_res = []
            expect(actual_res).toStrictEqual(expected_res);
        })
    });
});