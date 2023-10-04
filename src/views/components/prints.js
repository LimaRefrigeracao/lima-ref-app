import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


//https://pdfmake.github.io/docs/0.3/getting-started/
var imageUrl = './logo-white.png';

// Use um objeto XMLHttpRequest para carregar a imagem (ou você pode usar 'fetch' se preferir).
var xhr = new XMLHttpRequest();
xhr.responseType = 'blob';

xhr.onload = function () {
    if (xhr.status === 200) {
        var reader = new FileReader();
        reader.onloadend = function () {
            // O resultado é a imagem em formato Base64.
            var base64Data = reader.result;
            console.log(base64Data);

            // Agora você pode usar 'base64Data' como desejar.
        };
        reader.readAsDataURL(xhr.response);
    }
};

xhr.open('GET', imageUrl);
xhr.send();

const generateReceipt = async (dataInfo, dataOS) => {
    const info = JSON.parse(JSON.stringify(dataInfo));
    const os = JSON.parse(JSON.stringify(dataOS));

    var docDefinition = {
        pageSize: 'A4',
        content: [
            {
                alignment: 'justify',
                columns: [
                    { image: 'logo', style: 'image', width: 200, height: 75 },

                    {
                        text: 'TELEFONE: (94) 99196-4476\n\n RUA C-DOIS, N 16, CAPUAVA 1, REDENÇÃO-PA',
                        style: 'text_info_header',
                        bold: true
                    }
                ]
            },
            {
                text: 'DATA: 04/10/2023\n\n',
                style: 'text_info_client'
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        text: 'NOME: João Pedro\n\n TELEFONE: 94992927891',
                        style: 'text_info_client'
                    },

                    {
                        text: 'PRODUTO: Geladeira\n\n OS: 320',
                        style: 'text_info_client'
                    }
                ]
            },
            {
                text: '\nENDEREÇO: Rua Treze de Maio, 49, Santos Dumont\n\n\n',
                style: 'text_info_client'
            },
            {
                table: {
                    style: 'table_os',
                    headerRows: 1,
                    widths: ['auto', '*', 'auto'],
                    body: [
                        [
                            { fillColor: '#EEF9FC', text: 'QUANT.', bold: true, style: 'text_table_os' },
                            { fillColor: '#EEF9FC', text: 'DESCRIÇÃO', bold: true, style: 'text_table_os' },
                            { fillColor: '#EEF9FC', text: 'VALOR', bold: true, style: 'text_table_os' }
                        ],
                        ['1', 'Mão de Obra', '80'],
                        [
                            { text: '', border: [] },
                            { color: '#050A4D', text: 'VALOR TOTAL :', alignment: 'right', bold: true, border: [] },
                            { fillColor: '#EEF9FC', text: 'R$ 80,00', bold: true, style: 'text_table_os' }
                        ]
                    ]
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
            '\n\n\n',
            {
                color: '#050A4D',
                text: 'OS SERVIÇOS PRESTADOS NESTE PRODUTO ACIMA CITADO, CONTAM COM GARANTIA DE 90 DIAS A PARTIR DE 04/10/2023 .'
            },

            '\n\n\n',
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

        images: {
            logo: './logo-white.png'
        },
        styles: {
            image: {
                margin: [0, 20],
                alignment: 'center'
            },
            text_info_header: {
                color: '#050A4D',
                alignment: 'center',
                margin: [0, 40]
            },
            text_info_client: {
                color: '#050A4D'
            },
            text_table_os: {
                alignment: 'center',
                color: '#050A4D'
            }
        }
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).open();
};

export { generateReceipt };
