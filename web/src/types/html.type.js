export type InputType = {
  target: {
    value: string,
    result: string
  },
  keyCode: string,
  preventDefault: ()=>{},
  stopPropagation: ()=>{},
  persist: ()=>{},
  nativeEvent: any,
  currentTarget: any
};
export type ReferenceType = {
  current: any
};
