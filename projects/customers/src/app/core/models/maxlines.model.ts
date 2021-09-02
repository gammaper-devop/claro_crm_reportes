export interface MaxlinesResponse {
  quantityLineasAccumulated: number;
  quantityLinesAvailable: number;
  quantityLinesAllowedChip: number;
  quantityLinesAllowedPack: number;
  quantityLinesMaximum: number;
  warningMessage: string;
}

export class Maxlines {
  quantityLineasAccumulated: number;
  quantityLinesAllowed: number;
  quantityLinesAllowedChip: number;
  quantityLinesAllowedPack: number;
  quantityLinesMaximum: number;
  warningMessage: string;

  constructor(maxlines: MaxlinesResponse) {
    this.quantityLineasAccumulated = maxlines.quantityLineasAccumulated
      ? maxlines.quantityLineasAccumulated
      : 0;
    this.quantityLinesAllowed = maxlines.quantityLinesAvailable
      ? maxlines.quantityLinesAvailable
      : 0;
    this.quantityLinesAllowedChip = maxlines.quantityLinesAllowedChip
      ? maxlines.quantityLinesAllowedChip
      : 0;
    this.quantityLinesAllowedPack = maxlines.quantityLinesAllowedPack
      ? maxlines.quantityLinesAllowedPack
      : 0;
    this.quantityLinesMaximum = maxlines.quantityLinesMaximum
      ? maxlines.quantityLinesMaximum
      : 0;
    this.warningMessage = maxlines.warningMessage
      ? maxlines.warningMessage
      : '';
  }
}
