import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    ShadingType,
    BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

export const generateAttritionDocx = async (report) => {
    const { year, companyName, data } = report;

    const generatedAt = new Date();

    const formattedDate = generatedAt.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    const totalLeavers = data.reduce((sum, d) => sum + d.leavers, 0);

    const avgAttrition =
        data.reduce((sum, d) => sum + d.attritionRate, 0) / data.length;

    // =========================
    // HEADER TITLE (CLEAN CORPORATE STYLE)
    // =========================
    const title = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
            new TextRun({
                text: "HR ATTRITION ANALYTICS REPORT",
                bold: true,
                size: 44,
                color: "1F4E79",
            }),
        ],
    });

    // =========================
    // META BLOCK (LEFT ALIGNED, CLEAN)
    // =========================
    const meta = [
        `Company: ${companyName}`,
        `Reporting Year: ${year}`,
        `Generated: ${formattedDate}`,
    ].map(
        (t) =>
            new Paragraph({
                spacing: { after: 80 },
                children: [
                    new TextRun({
                        text: t,
                        size: 22,
                    }),
                ],
            })
    );

    // =========================
    // KPI SECTION (LOOKS LIKE DASHBOARD)
    // =========================
    const kpis = [
        {
            label: "Total Leavers",
            value: totalLeavers,
            color: "C00000",
        },
        {
            label: "Avg Attrition Rate",
            value: `${avgAttrition.toFixed(2)}%`,
            color: "1F4E79",
        },
        {
            label: "Months Covered",
            value: data.length,
            color: "333333",
        },
    ];

    const kpiRows = new TableRow({
        children: kpis.map(
            (k) =>
                new TableCell({
                    shading: {
                        fill: "F5F7FB",
                        type: ShadingType.CLEAR,
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: k.label,
                                    bold: true,
                                    size: 20,
                                }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: String(k.value),
                                    bold: true,
                                    size: 28,
                                    color: k.color,
                                }),
                            ],
                        }),
                    ],
                })
        ),
    });

    const kpiTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [kpiRows],
    });

    // =========================
    // TABLE HEADER
    // =========================
    const headerCells = [
        "Month",
        "Start HC",
        "Joined",
        "Leavers",
        "End HC",
        "Attrition %",
    ].map(
        (text) =>
            new TableCell({
                shading: {
                    fill: "1F4E79",
                    type: ShadingType.CLEAR,
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text,
                                bold: true,
                                color: "FFFFFF",
                                size: 20,
                            }),
                        ],
                    }),
                ],
            })
    );

    // =========================
    // TABLE ROWS (IMPROVED READABILITY)
    // =========================
    const tableRows = [
        new TableRow({ children: headerCells }),

        ...data.map((row, i) =>
            new TableRow({
                children: [
                    row.month,
                    row.startHeadCount,
                    row.joined,
                    row.leavers,
                    row.endHeadCount,
                    `${row.attritionRate}%`,
                ].map((text) => {
                    const isEven = i % 2 === 0;

                    return new TableCell({
                        shading: isEven
                            ? { fill: "F2F6FC", type: ShadingType.CLEAR }
                            : undefined,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: String(text),
                                        size: 18,
                                    }),
                                ],
                            }),
                        ],
                    });
                }),
            })
        ),
    ];

    const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
    });

    // =========================
    // DOCUMENT
    // =========================
    const doc = new Document({
        sections: [
            {
                children: [
                    title,

                    ...meta,

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "KEY PERFORMANCE INDICATORS",
                                bold: true,
                                size: 26,
                                color: "1F4E79",
                            }),
                        ],
                        spacing: { after: 150 },
                    }),

                    kpiTable,

                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "MONTHLY ATTRITION BREAKDOWN",
                                bold: true,
                                size: 26,
                                color: "1F4E79",
                            }),
                        ],
                        spacing: { after: 150 },
                    }),

                    table,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, `attrition-report-${companyName}-${year}.docx`);
};