module.exports = {
    options: {
        explicitArray: false
    },
    csv2json: {
        options: {
            csv: {
                delimiter: ';',
                encoding: 'utf8'
            }
        },
        src: ['_resources/csv/omniture_report_suites.csv'],
        dest: '_release/ext_sources/report_suites.json'
    }
};