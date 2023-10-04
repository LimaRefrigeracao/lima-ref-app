import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from './export_vfs_fonts';
import logo from './logoBase64';
import { formateDateLocale } from './tools';

const generateReceipt = async (dataInfo, dataOS) => {
    const INFO = JSON.parse(JSON.stringify(dataInfo));
    const OS = JSON.parse(JSON.stringify(dataOS));
    const DATE = await formateDateLocale();
    const ESTIMATE = JSON.parse(OS.estimate);
    
    const tableData = [
        [
            { fillColor: '#EEF9FC', text: 'QUANT.', bold: true, style: 'text_table_os' },
            { fillColor: '#EEF9FC', text: 'DESCRIÇÃO', bold: true, style: 'text_table_os' },
            { fillColor: '#EEF9FC', text: 'VALOR', bold: true, style: 'text_table_os' }
        ]
    ];

    const estimateValues = ESTIMATE.map((objeto) => [objeto.amount, objeto.description, `R$ ${objeto.price},00`]);
    for (let i = 0; i < estimateValues.length; i++) {
        tableData.push(
            estimateValues[i].map((value) => ({
                text: value.toString(),
                style: 'text_result_os'
            }))
        );
    }

    tableData.push([
        { text: '', border: [] },
        { color: '#050A4D', text: 'VALOR TOTAL :', alignment: 'right', bold: true, border: [] },
        { fillColor: '#EEF9FC', text: `R$ ${OS.value},00`, bold: true, style: 'text_table_os' }
    ]);


    var docDefinition = {
        pageSize: 'A4',
        content: [
            {
                alignment: 'center',
                columns: [
                    { image: logo, style: 'image', width: 220, height: 75 },

                    {
                        text: 'TELEFONE: (94) 99196-4476\n\n RUA C-DOIS, N 16, CAPUAVA 1, REDENÇÃO-PA',
                        style: 'text_info_header',
                        bold: true
                    }
                ]
            },
            '\n\n',
            {
                text: `DATA: ${DATE}`,
                style: 'text_info_client'
            },
            '\n',
            {
                alignment: 'justify',
                columns: [
                    {
                        text: `PRODUTO: ${INFO.product}`,
                        style: 'text_info_client'
                    },
                    {
                        text: `OS: ${INFO.order_of_service}`,
                        style: 'text_info_client'
                    }
                ]
            },
            '\n',
            {
                alignment: 'justify',
                columns: [
                    {
                        text: `NOME: ${INFO.client}`,
                        style: 'text_info_client'
                    },
                    {
                        text: `TELEFONE: ${INFO.telephone}`,
                        style: 'text_info_client'
                    }
                ]
            },
            '\n',
            {
                text: `ENDEREÇO: ${INFO.adress}`,
                style: 'text_info_client'
            },
            '\n\n',
            {
                table: {
                    style: 'table_os',
                    headerRows: 1,
                    widths: ['auto', '*', 'auto'],
                    body: tableData
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return i === 0 || i === node.table.body.length ? 1 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return i === 0 || i === node.table.widths.length ? 1 : 1;
                    },
                    hLineColor: function (i, node) {
                        return i === 0 || i === node.table.body.length ? 'gray' : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return i === 0 || i === node.table.widths.length ? 'gray' : 'gray';
                    },
                    paddingTop: function () {
                        return 10;
                    },
                    paddingBottom: function () {
                        return 10;
                    }
                }
            },
            '\n\n\n\n',
            {
                color: '#050A4D',
                text: `OS SERVIÇOS PRESTADOS NESTE PRODUTO ACIMA CITADO, CONTAM COM GARANTIA DE 90 DIAS A PARTIR DE ${DATE} .`
            },

            '\n\n\n\n',
            {
                alignment: 'center',
                columns: [
                    {
                        color: '#050A4D',
                        text: '_______________________________________\n ASSINATURA DO TÉCNICO'
                    },
                    {
                        color: '#050A4D',
                        text: '_______________________________________\n ASSINATURA DO CLIENTE'
                    }
                ]
            }
        ],
        styles: {
            image: {
                margin: [0, 0, 0, 20],
                alignment: 'center'
            },
            text_info_header: {
                color: '#050A4D',
                alignment: 'center',
                margin: [25, 20, 0, 20]
            },
            text_info_client: {
                color: '#050A4D'
            },
            text_table_os: {
                alignment: 'center',
                color: '#050A4D'
            },
            text_result_os: {
                alignment: 'center'
            }
        }
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).open();
};

export { generateReceipt };
