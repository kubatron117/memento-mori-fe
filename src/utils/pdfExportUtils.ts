import { jsPDF } from 'jspdf';
import type { DecadeGroup, Week } from '@/utils/monthGroupingUtils';
import { getWeekBgClass, getGroupBgClass } from '@/utils/bgClassUtils';

function isWeekPassed(week: Week): boolean {
  return week.endDate.getTime() < Date.now();
}

function mapBgClassToColor(bgClass: string): [number, number, number] {
  if (bgClass === 'bg-orange-500') return [249, 115, 22];
  if (bgClass === 'bg-black') return [0, 0, 0];
  if (bgClass === 'bg-gray-300') return [209, 213, 219];
  if (bgClass === 'bg-red-500') return [239, 68, 68];
  if (bgClass === 'bg-yellow-500') return [245, 158, 11];
  if (bgClass === 'bg-green-500') return [16, 185, 129];
  return [160, 160, 160];
}

function getColorForGroup(
  group: DecadeGroup['groups'][0],
  visualizationType: 'week' | 'month' | 'year',
  scoreVisualizationEnabled: boolean
): [number, number, number] {
  let bgClass: string;
  if (visualizationType === 'week') {
    bgClass = getWeekBgClass(group.weeks[0], scoreVisualizationEnabled);
  } else {
    bgClass = getGroupBgClass(group, scoreVisualizationEnabled);
  }
  return mapBgClassToColor(bgClass);
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
  const bubbleCount = decade.groups.length;
  const columns = calculateColumns(contentWidth, bubbleSize, dynamicBubbleGap);
  const numberOfRows = bubbleCount > 0 ? Math.ceil(bubbleCount / columns) : 0;
  const gridHeight = numberOfRows * (bubbleSize + dynamicBubbleGap);
  return decadeLabelFontSize + gapBeforeBubbles + gridHeight + gapAfterBubbles;
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
  startY: number,
  scoreVisualizationEnabled: boolean,
  visualizationType: 'week' | 'month' | 'year'
): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(decadeLabelFontSize);
  doc.text(decade.label, marginLeft, startY + decadeLabelFontSize * 0.8);

  let currentY = startY + decadeLabelFontSize + gapBeforeBubbles;
  doc.setFont('helvetica', 'normal');

  const columns = calculateColumns(contentWidth, bubbleSize, dynamicBubbleGap);
  let xPos = marginLeft;
  let rowBubbleCount = 0;

  decade.groups.forEach(group => {
    const color = getColorForGroup(group, visualizationType, scoreVisualizationEnabled);
    doc.setFillColor(color[0], color[1], color[2]);
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

export function generateMementoMoriPdf(
  groupedData: DecadeGroup[],
  scoreVisualizationEnabled: boolean,
  visualizationType: 'week' | 'month' | 'year'
) {
  const pdfWidth = 500;
  const pdfHeight = 700;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight]
  });

  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 30;
  const bottomMinMargin = 10;

  const titleFontSize = 24;

  const decadeLabelFontSize = 10;
  const contentWidth = pdfWidth - marginLeft - marginRight;
  let gapAfterTitle = 5;

  const availableVerticalSpace = pdfHeight - marginTop - titleFontSize - gapAfterTitle - bottomMinMargin;

  const bubbleGapFactor = 0.3;
  const gapBeforeBubblesFactor = 0.3;
  const gapAfterBubblesFactor = 0.3;

  const bubbleSize = findMaxBubbleSize(
    availableVerticalSpace,
    groupedData,
    contentWidth,
    decadeLabelFontSize,
    bubbleGapFactor,
    gapBeforeBubblesFactor,
    gapAfterBubblesFactor
  );

  const totalHeightNeeded = computeTotalRequiredHeight(
    bubbleSize,
    groupedData,
    contentWidth,
    bubbleGapFactor,
    gapBeforeBubblesFactor,
    gapAfterBubblesFactor,
    decadeLabelFontSize
  );

  if (totalHeightNeeded > availableVerticalSpace * 0.9) {
    gapAfterTitle = 2;
  }

  let currentY = drawTitle(doc, 'MEMENTO MORI', pdfWidth, marginTop, titleFontSize, gapAfterTitle);
  const { dynamicBubbleGap, gapBeforeBubbles, gapAfterBubbles } = calculateDynamicGaps(
    bubbleSize,
    bubbleGapFactor,
    gapBeforeBubblesFactor,
    gapAfterBubblesFactor
  );

  groupedData.forEach(decade => {
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
      currentY,
      scoreVisualizationEnabled,
      visualizationType
    );
  });

  doc.save('memento_mori_calendar_memorian_io.pdf');
}
