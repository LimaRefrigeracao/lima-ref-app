import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

//https://pdfmake.github.io/docs/0.3/getting-started/

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
                        text: 'TELEFONE: (94) 99196-4476\n\n RUA C-DOIS, 16, CAPUAVA 1, REDENÇÃO-PA',
                        style: 'text_info',
                        bold: true
                    }
                ]
            },

            {
                table: {
                    style: 'table_info_client',
                    headerRows: 1,
                    widths: ['*', 'auto', 100, '*'],
                    body: [
                        ['First', 'Second', 'Third', 'The last one'],
                        ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                        [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
                    ]
                }
            },
            {
                text: '\n'
            },
            {
                table: {
                    style: 'table_os',
                    headerRows: 1,
                    widths: ['*', 'auto', 100, '*'],
                    body: [
                        ['First', 'Second', 'Third', 'The last one'],
                        ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                        [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
                    ]
                }
            }
        ],

        images: {
            logo: 'https://raw.githubusercontent.com/impulse-devs/TexaSys/main/assets/img/logo.png'
        },
        styles: {
            image: {
                margin: [0, 20],
                alignment: 'center'
            },
            text_info: {
                alignment: 'center',
                margin: [0, 40]
            },
            table_info_client: {},
            table_os: {}
        }
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(docDefinition).open();
};

export { generateReceipt };
