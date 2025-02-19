import { jsPDF } from 'jspdf';
import type { DecadeGroup, Week } from '@/utils/monthGroupingUtils';

function isWeekPassed(week: Week): boolean {
  return week.endDate.getTime() < Date.now();
}


function getSimpleColorForGroup(
  group: DecadeGroup['groups'][0]
): [number, number, number] {
  const hasCurrent = group.weeks.some((w) => w.isCurrentWeek);
  const allPassed = group.weeks.every((w) => isWeekPassed(w));

  if (hasCurrent) {
    return [249, 115, 22];
  } else if (allPassed) {
    return [0, 0, 0];
  } else {
    return [160, 160, 160];
  }
}

function calculateDynamicGaps(
  bubbleSize: number,
  bubbleGapFactor: number,
  gapBeforeBubblesFactor: number,
  gapAfterBubblesFactor: number
) {
  return {
    dynamicBubbleGap: bubbleSize * bubbleGapFactor,
    gapBeforeBubbles: bubbleSize * gapBeforeBubblesFactor,
    gapAfterBubbles: bubbleSize * gapAfterBubblesFactor,
  };
}

function calculateColumns(
  contentWidth: number,
  bubbleSize: number,
  dynamicBubbleGap: number
): number {
  const columns = Math.floor((contentWidth + dynamicBubbleGap) / (bubbleSize + dynamicBubbleGap));
  return columns < 1 ? 1 : columns;
}

function computeDecadeBlockHeight(
  decade: DecadeGroup,
  bubbleSize: number,
  contentWidth: number,
  dynamicBubbleGap: number,
  gapBeforeBubbles: number,
  gapAfterBubbles: number,
  decadeLabelFontSize: number
): number {
  let height = decadeLabelFontSize + gapBeforeBubbles;

  const bubbleCount = decade.groups.length;
  const columns = calculateColumns(contentWidth, bubbleSize, dynamicBubbleGap);
  const rows = bubbleCount > 0 ? Math.ceil(bubbleCount / columns) : 0;
  const gridHeight = rows > 0 ? rows * (bubbleSize + dynamicBubbleGap) - dynamicBubbleGap : 0;

  height += gridHeight + gapAfterBubbles;
  return height;
}

function computeTotalRequiredHeight(
  bubbleSize: number,
  groupedData: DecadeGroup[],
  contentWidth: number,
  bubbleGapFactor: number,
  gapBeforeBubblesFactor: number,
  gapAfterBubblesFactor: number,
  decadeLabelFontSize: number
): number {
  const { dynamicBubbleGap, gapBeforeBubbles, gapAfterBubbles } = calculateDynamicGaps(
    bubbleSize,
    bubbleGapFactor,
    gapBeforeBubblesFactor,
    gapAfterBubblesFactor
  );

  return groupedData.reduce((total, decade) => {
    return total + computeDecadeBlockHeight(
      decade,
      bubbleSize,
      contentWidth,
      dynamicBubbleGap,
      gapBeforeBubbles,
      gapAfterBubbles,
      decadeLabelFontSize
    );
  }, 0);
}

function findMaxBubbleSize(
  availableVerticalSpace: number,
  groupedData: DecadeGroup[],
  contentWidth: number,
  decadeLabelFontSize: number,
  bubbleGapFactor: number,
  gapBeforeBubblesFactor: number,
  gapAfterBubblesFactor: number
): number {
  let low = 1;
  let high = 30;
  const eps = 0.01;

  while (high - low > eps) {
    const mid = (low + high) / 2;
    const totalHeight = computeTotalRequiredHeight(
      mid,
      groupedData,
      contentWidth,
      bubbleGapFactor,
      gapBeforeBubblesFactor,
      gapAfterBubblesFactor,
      decadeLabelFontSize
    );
    if (totalHeight <= availableVerticalSpace) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

function drawTitle(
  doc: jsPDF,
  title: string,
  pdfWidth: number,
  marginTop: number,
  titleFontSize: number,
  gapAfterTitle: number
): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(titleFontSize);
  doc.text(title, pdfWidth / 2, marginTop, { align: 'center' });
  return marginTop + titleFontSize + gapAfterTitle;
}

function drawDecadeBlock(
  doc: jsPDF,
  decade: DecadeGroup,
  marginLeft: number,
  contentWidth: number,
  bubbleSize: number,
  dynamicBubbleGap: number,
  gapBeforeBubbles: number,
  gapAfterBubbles: number,
  decadeLabelFontSize: number,
  startY: number
): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(decadeLabelFontSize);
  doc.text(decade.label, marginLeft, startY + decadeLabelFontSize * 0.8);

  let currentY = startY + decadeLabelFontSize + gapBeforeBubbles;

  doc.setFont('helvetica', 'normal');
  const columns = calculateColumns(contentWidth, bubbleSize, dynamicBubbleGap);
  let xPos = marginLeft;
  let rowBubbleCount = 0;

  decade.groups.forEach((group) => {
    const [r, g, b] = getSimpleColorForGroup(group);
    doc.setFillColor(r, g, b);

    const radius = bubbleSize / 2;
    doc.circle(xPos + radius, currentY + radius, radius, 'F');

    rowBubbleCount++;
    xPos += bubbleSize + dynamicBubbleGap;

    if (rowBubbleCount >= columns) {
      rowBubbleCount = 0;
      xPos = marginLeft;
      currentY += bubbleSize + dynamicBubbleGap;
    }
  });

  if (rowBubbleCount > 0) {
    currentY += bubbleSize + dynamicBubbleGap;
  }
  currentY += gapAfterBubbles;
  return currentY;
}

export function generateMementoMoriPdf(groupedData: DecadeGroup[]) {
  const pdfWidth = 500;  // mm
  const pdfHeight = 700; // mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight]
  });

  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 30;
  const marginBottom = 30;

  const titleFontSize = 24;
  const decadeLabelFontSize = 12;
  const quoteFontSize = 11;
  const signatureFontSize = 12;

  const contentWidth = pdfWidth - marginLeft - marginRight;

  let gapAfterTitle = 5;
  const bottomReserved = 20;

  const availableVerticalSpace = pdfHeight - marginTop - titleFontSize - gapAfterTitle - bottomReserved;

  const bubbleGapFactor = 0.3;
  const gapBeforeBubblesFactor = 0.3;
  const gapAfterBubblesFactor = 0.3;

  let bubbleSize = findMaxBubbleSize(availableVerticalSpace, groupedData, contentWidth, decadeLabelFontSize,
    bubbleGapFactor, gapBeforeBubblesFactor, gapAfterBubblesFactor);

  const totalHeightNeeded = computeTotalRequiredHeight(bubbleSize, groupedData, contentWidth, bubbleGapFactor,
    gapBeforeBubblesFactor, gapAfterBubblesFactor, decadeLabelFontSize);

  let skipBottomText = false;
  if (totalHeightNeeded > availableVerticalSpace * 0.9) {
    gapAfterTitle = 2;
    skipBottomText = true;
  }

  const finalAvailableVerticalSpace =
    pdfHeight - marginTop - titleFontSize - gapAfterTitle - (skipBottomText ? 0 : bottomReserved);

  const { dynamicBubbleGap, gapBeforeBubbles, gapAfterBubbles } = calculateDynamicGaps(
    bubbleSize, bubbleGapFactor, gapBeforeBubblesFactor, gapAfterBubblesFactor);

  let currentY = drawTitle(doc, 'MEMENTO MORI', pdfWidth, marginTop, titleFontSize, gapAfterTitle);

  groupedData.forEach((decade) => {
    currentY = drawDecadeBlock(
      doc,
      decade,
      marginLeft,
      contentWidth,
      bubbleSize,
      dynamicBubbleGap,
      gapBeforeBubbles,
      gapAfterBubbles,
      decadeLabelFontSize,
      currentY
    );
  });

  doc.save('memento_mori_calendar_memorian_io.pdf');
}
