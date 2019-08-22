import Host from './vdom/host';
import Element from './vdom/element';
import { invokeMinifiedError } from './error';
import { isString, isArray } from './types';

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

function getRenderErrorInfo() {
  const ownerComponent = Host.owner;
  if (ownerComponent) {
    const name = ownerComponent.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

export default function createElement(type, config, children) {
  if (type == null) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
    } else {
      invokeMinifiedError(0);
    }
  }
  // Reserved names are extracted
  let props = {};
  let propName;
  let key = null;
  let ref = null;
  const ownerComponent = Host.owner;

  if (config != null) {
    let hasReservedProps = false;

    if (config.ref != null) {
      hasReservedProps = true;
      ref = config.ref;
      if (process.env.NODE_ENV !== 'production') {
        if (isString(ref) && !ownerComponent) {
          console.error('createElement: adding a string ref "' + ref + '" outside the render method.');
        }
      }
    }

    if (config.key != null) {
      hasReservedProps = true;
      key = String(config.key);
    }

    // if no reserved props, assign config to props for better performance
    if (hasReservedProps) {
      for (propName in config) {
        // extract reserved props
        if (!RESERVED_PROPS[propName]) {
          props[propName] = config[propName];
        }
      }
    } else {
      props = config;
    }
  }

  // Children arguments can be more than one
  const childrenLength = arguments.length - 2;
  if (childrenLength > 0) {
    if (childrenLength === 1 && !isArray(children)) {
      props.children = children;
    } else {
      let childArray = children;
      if (childrenLength > 1) {
        childArray = new Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
      }
      props.children = childArray;
    }
  }

  // Resolve default props
  if (type && type.defaultProps) {
    let defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new Element(
    type,
    key,
    ref,
    props,
    ownerComponent
  );
}

