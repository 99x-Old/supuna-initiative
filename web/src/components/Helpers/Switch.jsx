import { Children } from 'react';
import type { PropsType } from 'types/react.type';

const Switch = (props: PropsType) => {
  const getChildren = () => {
    const cases = [];
    const defaults = [];

    Children.forEach(props.children, (item: any) => {
      switch (item.type.componentName) {
        case 'case':
          if (typeof props.condition === 'function') {
            if (props.condition(item.props.value)) {
              cases.push(item);
            }
          } else if (props.condition === item.props.value) {
            cases.push(item);
          }
          break;
        default:
          defaults.push(item);
          break;
      }
    });

    if (cases.length > 0) {
      return cases;
    }
    return defaults;
  };
  const children = getChildren();

  return children.length === 0 ? null : children;
};

const Case = (props: PropsType) => props.children;

const Default = (props: PropsType) => props.children;

export default Switch;
export { Case };
export { Default };
