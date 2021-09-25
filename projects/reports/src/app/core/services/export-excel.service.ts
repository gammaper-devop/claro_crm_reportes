import { formatDate } from "@angular/common";
import { Injectable, LOCALE_ID } from "@angular/core";
import * as FileSaver from 'file-saver';
import * as XLSX from 'XLSX';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UFT-8';
const EXCEL_EXT = '.xlsx';
const EXCEL_SHEET = 'REPORTE DE VENDEDORES';
@Injectable()

export class ExportExcelService {

    
    constructor() {

    }

    exportToExcel(json: any[], excelFileName: string): void {

        let Heading = [
            ["TIPO DOC.", "N° DOC.", "NOMBRES", "VENDEDOR", "TELF. VEND.", "DESC. PDV", "ESTADO", "EMPADRONADOR", "TIP. VAL."]
        ];
        let Data = json;
        let ws = XLSX.utils.aoa_to_sheet(Heading);
        XLSX.utils.sheet_add_json(ws, Data, {
            header: ["documentType", "documentNumber", "fullNames", "employeeId", "employeePhone", "pointSaleCode", "employeeStatus", "employeeUser", "authentication"],
            skipHeader: true,
            origin: -1
        });

        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, EXCEL_SHEET);
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcel(excelBuffer, excelFileName);
    }

    private saveAsExcel(buffer: any, filename: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        const dateString = formatDate(new Date().getTime(), 'dd-MM-yyyy', 'es-PE')
        FileSaver.saveAs(data, filename + '_' + dateString + EXCEL_EXT)
    }
}