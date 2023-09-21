export interface FilterBtnsArr {
  title: string,
  value: string,
  ico: string,
  translate?: boolean
}

export interface FilterBtnsProps {
  showBtns: boolean,
  pickers: Object,
  pickedIs: string,
}