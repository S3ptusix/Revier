import pptxgen from 'pptxgenjs';
import { REPORT_DEFINITIONS } from '../services/reportsServices.js';
import { INSIGHT_GENERATORS } from './insights.js';

const EMERALD = '10B981';
const EMERALD_DARK = '047857';
const EMERALD_LIGHT = '6EE7B7';
const DARK = '111827';
const GRAY = 'D1D5DB';

const reportLabel = (id) => REPORT_DEFINITIONS.find((r) => r.id === id)?.label || id;

const buildTableRows = (report) => {
    if (!report || report.error) return [];
    return (report.labels || []).map((label, i) => [label, String(report.data?.[i] ?? '')]);
};

/**
 * ============================================================
 * WORD EXPORT (.doc)
 * ------------------------------------------------------------
 * Uses the HTML-wrapped-as-Word technique: an HTML document served
 * with a Word MIME type opens correctly in Word/LibreOffice, entirely
 * client-side, no extra backend work. For a native OOXML .docx,
 * generate it server-side instead (e.g. with the `docx` npm package).
 * ============================================================
 *
 * @param {object} reportsById - { [reportId]: reportData }
 * @param {string[]} selectedIds - report ids to include, in display order
 * @param {{ companyName?: string, startDate: string, endDate: string }} meta
 */
export const exportClientReportToWord = (reportsById, selectedIds, meta) => {
    const { companyName, startDate, endDate } = meta;

    const sections = selectedIds
        .map((id) => {
            const report = reportsById[id];
            const label = reportLabel(id);

            if (!report || report.error) {
                return `<h2>${label}</h2><p><em>No data available for this period.</em></p>`;
            }

            const rows = buildTableRows(report);
            const insight = INSIGHT_GENERATORS[id]?.(report);

            const tableHtml = rows.length
                ? `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;margin-bottom:12px;">
                        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
                        <tbody>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</tbody>
                   </table>`
                : `<p><em>No data available for this period.</em></p>`;

            const insightHtml = insight
                ? `<p style="color:#047857;"><strong>Insight:</strong> ${insight}</p>`
                : '';

            return `<h2>${label}</h2>${tableHtml}${insightHtml}`;
        })
        .join('\n');

    const htmlDoc = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Hiring Performance Report</title></head>
        <body style="font-family:Arial,Helvetica,sans-serif;">
            <h1>Hiring Performance Report${companyName ? ` — ${companyName}` : ''}</h1>
            <p>Report from ${startDate} to ${endDate}</p>
            <hr/>
            ${sections}
        </body>
        </html>
    `;

    const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `client-report-${startDate}-to-${endDate}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * ============================================================
 * POWERPOINT EXPORT (.pptx) via pptxgenjs
 * ============================================================
 *
 * @param {object} reportsById - { [reportId]: reportData }
 * @param {string[]} selectedIds - report ids to include, in display order
 * @param {{ companyName?: string, startDate: string, endDate: string }} meta
 */
export const exportClientReportToPowerPoint = async (reportsById, selectedIds, meta) => {
    const { companyName, startDate, endDate } = meta;
    const pptx = new pptxgen();

    // ---- Title slide ----
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: 'FFFFFF' };
    titleSlide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.0, w: 1.2, h: 0.08, fill: { color: EMERALD } });
    titleSlide.addText('Hiring Performance Report', {
        x: 0.5, y: 2.2, w: 9, h: 1, fontSize: 32, bold: true, color: DARK,
    });
    if (companyName) {
        titleSlide.addText(companyName, {
            x: 0.5, y: 2.9, w: 9, h: 0.6, fontSize: 20, color: EMERALD_DARK,
        });
    }
    titleSlide.addText(`Report from ${startDate} to ${endDate}`, {
        x: 0.5, y: 3.5, w: 9, h: 0.5, fontSize: 14, color: '6B7280',
    });

    // ---- One slide per selected report ----
    selectedIds.forEach((id) => {
        const report = reportsById[id];
        const label = reportLabel(id);
        const slide = pptx.addSlide();
        slide.addText(label, { x: 0.5, y: 0.4, fontSize: 26, bold: true, color: DARK });

        if (!report || report.error || !report.labels?.length) {
            slide.addText('No data available for this period.', {
                x: 0.5, y: 2.5, w: 9, fontSize: 16, color: '6B7280', italic: true,
            });
            return;
        }

        slide.addChart(
            pptx.ChartType.bar,
            [{ name: label, labels: report.labels, values: report.data }],
            {
                x: 0.5, y: 1.1, w: 9, h: 4.0,
                barDir: 'col',
                showLegend: false,
                chartColors: [EMERALD, EMERALD_LIGHT, EMERALD_DARK],
                catAxisLabelColor: DARK,
                valAxisLabelColor: DARK,
            }
        );

        const insight = INSIGHT_GENERATORS[id]?.(report);
        if (insight) {
            slide.addText(insight, {
                x: 0.5, y: 5.3, w: 9, h: 0.6, fontSize: 12, color: EMERALD_DARK, italic: true,
            });
        }
    });

    await pptx.writeFile({ fileName: `client-report-${startDate}-to-${endDate}.pptx` });
};