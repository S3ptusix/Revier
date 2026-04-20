/* eslint-disable no-unused-vars */
import PptxGenJS from "pptxgenjs";
import { saveAs } from "file-saver";

export const generateAttritionPPT = async (report) => {
    const { year, companyName, data } = report;

    const ppt = new PptxGenJS();

    const totalLeavers = data.reduce((sum, d) => sum + d.leavers, 0);

    const avgAttrition =
        data.reduce((sum, d) => sum + d.attritionRate, 0) / data.length;

    // =========================
    // SLIDE 1: TITLE
    // =========================
    let slide = ppt.addSlide();

    slide.addText("HR ATTRITION REPORT", {
        x: 0.5,
        y: 1.5,
        w: "90%",
        fontSize: 36,
        bold: true,
        color: "1F4E79",
        align: "center",
    });

    slide.addText(companyName, {
        x: 0.5,
        y: 2.5,
        w: "90%",
        fontSize: 24,
        color: "333333",
        align: "center",
    });

    slide.addText(`Year: ${year}`, {
        x: 0.5,
        y: 3,
        w: "90%",
        fontSize: 18,
        color: "666666",
        align: "center",
    });

    // =========================
    // SLIDE 2: KPI DASHBOARD
    // =========================
    slide = ppt.addSlide();

    slide.addText("Key Metrics", {
        x: 0.5,
        y: 0.3,
        fontSize: 28,
        bold: true,
        color: "1F4E79",
    });

    const kpis = [
        { label: "Total Leavers", value: totalLeavers },
        { label: "Avg Attrition %", value: `${avgAttrition.toFixed(2)}%` },
        { label: "Months Covered", value: data.length },
    ];

    kpis.forEach((k, i) => {
        slide.addText(k.label, {
            x: 0.5,
            y: 1.2 + i * 1.2,
            fontSize: 16,
            bold: true,
        });

        slide.addText(String(k.value), {
            x: 3,
            y: 1.2 + i * 1.2,
            fontSize: 20,
            bold: true,
            color: "1F4E79",
        });
    });

    // =========================
    // SLIDE 3: TABLE
    // =========================
    slide = ppt.addSlide();

    slide.addText("Monthly Breakdown", {
        x: 0.5,
        y: 0.3,
        fontSize: 24,
        bold: true,
        color: "1F4E79",
    });

    const tableData = [
        [
            "Month",
            "Start HC",
            "Joined",
            "Leavers",
            "End HC",
            "Attrition %",
        ],
        ...data.map((d) => [
            d.month,
            d.startHeadCount,
            d.joined,
            d.leavers,
            d.endHeadCount,
            `${d.attritionRate}%`,
        ]),
    ];

    slide.addTable(tableData, {
        x: 0.3,
        y: 1,
        w: 9,
        fontSize: 12,
        border: { pt: 1, color: "CCCCCC" },
        fill: "F5F7FB",
        color: "000000",
    });

    // =========================
    // SLIDE 4: SUMMARY
    // =========================
    slide = ppt.addSlide();

    slide.addText("Executive Summary", {
        x: 0.5,
        y: 0.5,
        fontSize: 28,
        bold: true,
        color: "1F4E79",
    });

    slide.addText(
        `Total Leavers: ${totalLeavers}\nAverage Attrition Rate: ${avgAttrition.toFixed(
            2
        )}%`,
        {
            x: 0.5,
            y: 1.5,
            fontSize: 18,
            color: "333333",
        }
    );

    slide.addText(
        "This report provides monthly workforce attrition insights for HR decision-making.",
        {
            x: 0.5,
            y: 3,
            w: 8,
            fontSize: 14,
            color: "666666",
        }
    );

    // =========================
    // DOWNLOAD PPT
    // =========================
    const fileName = `attrition-report-${companyName}-${year}.pptx`;

    ppt.writeFile({ fileName });
};